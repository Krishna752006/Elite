import express from 'express';
import mongoose from 'mongoose';

import { Appointment } from '../models/Appointment.js';
import { Slot } from '../models/Slot.js';
import { Doctor } from '../models/Doctor.js';

import { parseOffsetPagination, parseCursorPagination, buildNextCursorFromDocs } from '../utils/pagination.js';
import { buildEtag, handleIfNoneMatch, requireIfMatch } from '../utils/etag.js';
import { httpError } from '../utils/httpErrors.js';

import { beginIdempotentRequest, finalizeIdempotentRequest } from '../middlewares/idempotency.js';

import { writeAudit } from '../services/auditService.js';

export const appointmentsRouter = express.Router();

// GET /appointments?doctorId=&patientId=&status=&mode=offset&page=&limit=
// GET /appointments?mode=cursor&cursor=&limit=
appointmentsRouter.get('/', async (req, res, next) => {
  //WRITE CODE HERE
  try {
    const { doctorId, patientId, status, mode } = req.query;

    const baseFilter = {};
    if (doctorId) baseFilter.doctorId = doctorId;
    if (patientId) baseFilter.patientId = patientId;
    if (status) baseFilter.status = status;

    // ---------- Cursor pagination ----------
    if (mode === 'cursor') {
      const { limit, filter } = parseCursorPagination(req.query);

      const queryFilter = {
        ...baseFilter,
        ...filter
      };

      const docs = await Appointment.find(queryFilter)
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1);

      const hasNext = docs.length > limit;
      if (hasNext) docs.pop();

      const nextCursor = hasNext
        ? buildNextCursorFromDocs(docs)
        : null;

      return res.json({
        data: docs,
        pageInfo: {
          mode: 'cursor',
          limit,
          nextCursor,
          hasNext
        }
      });
    }

    // ---------- Offset pagination (default) ----------
    const { limit, skip, page } = parseOffsetPagination(req.query);

    const [data, total] = await Promise.all([
      Appointment.find(baseFilter)
        .sort({ createdAt: 1, _id: 1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(baseFilter)
    ]);

    res.json({
      data,
      pageInfo: {
        mode: 'offset',
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});


// GET /appointments/:id  (ETag + If-None-Match)
appointmentsRouter.get('/:id', async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      throw httpError(404, 'Appointment not found');
    }

    // Build ETag based on appointment ID + updatedAt
    const etag = buildEtag({
      prefix: 'appointment',
      id: appt._id,
      updatedAt: appt.updatedAt
    });

    // Conditional GET: return 304 if ETag matches
    if (handleIfNoneMatch(req, res, etag)) return;

    res.set('ETag', etag);
    res.json(appt);

  } catch (err) {
    next(err);
  }
});

// POST /appointments  (Idempotency-Key required)
// body: { patientId, doctorId, slotId, notes? }
appointmentsRouter.post('/', async (req, res, next) => {
  let idem;
  try {
    // ---------- 0) Validate Idempotency ----------
    idem = await beginIdempotentRequest({
      req,
      scopeParts: ['POST', '/appointments', req.body?.patientId]
    });

    if (idem.mode === 'REPLAY') {
      return res
        .status(idem.record.responseStatus)
        .json(idem.record.responseBody);
    }

    if (idem.mode === 'IN_PROGRESS') {
      throw httpError(409, 'Request already in progress for this Idempotency-Key');
    }

    const { patientId, doctorId, slotId, notes } = req.body;

    if (!patientId || !doctorId || !slotId) {
      throw httpError(400, 'patientId, doctorId and slotId are required');
    }

    // ---------- 1) Validate doctor ----------
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw httpError(404, 'Doctor not found');

    // ---------- 2) Atomically book slot ----------
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, doctorId, status: 'AVAILABLE' },
      { $set: { status: 'BOOKED' } },
      { new: true }
    );

    if (!slot) throw httpError(409, 'Slot not available');

    // ---------- 3) Create appointment ----------
    const appt = await Appointment.create({
      patientId,
      doctorId,
      slotId,
      notes,
      status: 'REQUESTED' // initial state
    });

    // ---------- 4) Link slot -> appointment ----------
    slot.appointmentId = appt._id;
    await slot.save();

    // ---------- 5) Mock payment / SMS ----------
    // (Assume success)
    if (idem.mode === 'REPLAY') {
    res.set('idempotent-replay', 'true');
    return res
      .status(idem.record.responseStatus)
      .json(idem.record.responseBody);
  }

    // ---------- 6) Confirm appointment ----------
    appt.status = 'CONFIRMED';
    await appt.save();

    // ---------- 7) Audit ----------
    // appointments.js
    await writeAudit({
      entityType: 'Appointment',
      entityId: appt._id,
      action: 'CREATE',
      meta: { patientId, doctorId, slotId },
      requestId: req.requestId // pass it explicitly
    });

    // ---------- 8) Finalize idempotency ----------
    await finalizeIdempotentRequest({
      recordId: idem.record._id,
      statusCode: 201,
      body: appt,
      success: true
    });

    res.status(201).json(appt);

  } catch (err) {
    // Ensure idempotency finalize doesn't fail if requestId missing
    if (idem?.record?._id) {
      await finalizeIdempotentRequest({
        recordId: idem.record._id,
        statusCode: err?.status || 500,
        body: { error: err?.message || 'Unknown error' },
        success: false
      });
    }

    next(err);
  }
});

// PATCH /appointments/:id  (If-Match required)
// body examples:
// { action: "cancel", reason: "..." }
// { action: "reschedule", newSlotId: "..." }
appointmentsRouter.patch('/:id', async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) throw httpError(404, 'Appointment not found');

    // ---------- ETag / If-Match ----------
    const currentEtag = buildEtag({
      prefix: 'appointment',
      id: appt._id,
      updatedAt: appt.updatedAt
    });
    requireIfMatch(req, currentEtag);

    const { action, reason, newSlotId } = req.body;

    if (!action || !['cancel', 'reschedule'].includes(action)) {
      throw httpError(400, 'Invalid action. Must be "cancel" or "reschedule"');
    }

    // ---------- CANCEL ----------
    if (action === 'cancel') {
      if (appt.status === 'CANCELLED') {
        throw httpError(409, 'Appointment is already cancelled');
      }

      // Update appointment status
      appt.status = 'CANCELLED';
      appt.notes = reason || appt.notes;
      await appt.save();

      // Release the slot
      if (appt.slotId) {
        await Slot.findByIdAndUpdate(appt.slotId, {
          status: 'AVAILABLE',
          appointmentId: null
        });
      }

      // Audit
      await writeAudit({
        entityType: 'Appointment',
        entityId: appt._id,
        action: 'CANCEL',
        meta: { reason }
      });

      const newEtag = buildEtag({
        prefix: 'appointment',
        id: appt._id,
        updatedAt: appt.updatedAt
      });
      res.set('ETag', newEtag);
      return res.json(appt);
    }

    // ---------- RESCHEDULE ----------
    if (action === 'reschedule') {
      if (!newSlotId) throw httpError(400, 'newSlotId is required for reschedule');

      const newSlot = await Slot.findOneAndUpdate(
        { _id: newSlotId, doctorId: appt.doctorId, status: 'AVAILABLE' },
        { $set: { status: 'BOOKED' } },
        { new: true }
      );

      if (!newSlot) throw httpError(409, 'New slot not available');

      // Release old slot
      if (appt.slotId) {
        await Slot.findByIdAndUpdate(appt.slotId, {
          status: 'AVAILABLE',
          appointmentId: null
        });
      }

      // Update appointment
      appt.slotId = newSlot._id;
      appt.status = 'CONFIRMED';
      await appt.save();

      // Link new slot
      newSlot.appointmentId = appt._id;
      await newSlot.save();

      // Audit
      await writeAudit({
        entityType: 'Appointment',
        entityId: appt._id,
        action: 'RESCHEDULE',
        meta: { oldSlotId: appt.slotId, newSlotId }
      });

      const newEtag = buildEtag({
        prefix: 'appointment',
        id: appt._id,
        updatedAt: appt.updatedAt
      });
      res.set('ETag', newEtag);
      return res.json(appt);
    }

  } catch (err) {
    next(err);
  }
});

