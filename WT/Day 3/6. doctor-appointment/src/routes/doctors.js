import express from 'express';
import mongoose from 'mongoose';

import { Doctor } from '../models/Doctor.js';
import { Slot } from '../models/Slot.js';
import { parseOffsetPagination, parseCursorPagination, buildNextCursorFromDocs } from '../utils/pagination.js';
import { buildEtag, handleIfNoneMatch, requireIfMatch } from '../utils/etag.js';
import { encodeCursor } from '../utils/cursor.js';
import { httpError } from '../utils/httpErrors.js';
import { writeAudit } from '../services/auditService.js';

export const doctorsRouter = express.Router();

// GET /doctors?city=&specialty=&page=&limit=
// GET /doctors?mode=cursor&cursor=&limit=
doctorsRouter.get('/', async (req, res, next) => {
  try {
    const { city, specialty, mode } = req.query;

    const baseFilter = {};
    if (city) baseFilter.city = city;
    if (specialty) baseFilter.specialty = specialty;

    // ---------- Cursor pagination ----------
    if (mode === 'cursor') {
      const { limit, filter } = parseCursorPagination(req.query);

      const queryFilter = {
        ...baseFilter,
        ...filter
      };

      const docs = await Doctor.find(queryFilter)
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1);

      const hasNext = docs.length > limit;
      if (hasNext) docs.pop();

      const nextCursor = hasNext
        ? buildNextCursorFromDocs(docs)
        : null;

      return res.json({
        items: docs,
        nextCursor,
        hasNext
        });
    }

    // ---------- Offset pagination (default) ----------
    const { limit, skip, page } = parseOffsetPagination(req.query);

    const [items, total] = await Promise.all([
      Doctor.find(baseFilter)
        .sort({ createdAt: 1, _id: 1 })
        .skip(skip)
        .limit(limit),
      Doctor.countDocuments(baseFilter)
    ]);

    res.json({
      items,
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

// GET /doctors/:id  (ETag + If-None-Match)
doctorsRouter.get('/:id', async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      throw httpError(404, 'Doctor not found');
    }

    const etag = buildEtag({
      prefix: 'doctor',
      id: doctor._id,
      updatedAt: doctor.updatedAt
    });

    // Conditional GET
    if (handleIfNoneMatch(req, res, etag)) return;

    res.set('ETag', etag);
    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

// PUT /doctors/:id  (If-Match required)
doctorsRouter.put('/:id', async (req, res, next) => {
  //WRITE YOUR CODE HERE
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      throw httpError(404, 'Doctor not found');
    }

    const currentEtag = buildEtag({
      prefix: 'doctor',
      id: doctor._id,
      updatedAt: doctor.updatedAt
    });

    // Enforce optimistic locking
    requireIfMatch(req, currentEtag);

    // ---- Update allowed fields only ----
    const { name, specialty, city, fee } = req.body;

    if (name !== undefined) doctor.name = name;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (city !== undefined) doctor.city = city;
    if (fee !== undefined) doctor.fee = fee;

    await doctor.save();

    const newEtag = buildEtag({
      prefix: 'doctor',
      id: doctor._id,
      updatedAt: doctor.updatedAt
    });

    res.set('ETag', newEtag);
    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

// GET /doctors/:id/availability?date=YYYY-MM-DD&mode=offset&page=1&limit=10
// GET /doctors/:id/availability?date=YYYY-MM-DD&mode=cursor&cursor=&limit=10
// Returns AVAILABLE slots for that date.
// GET /doctors/:id/availability
doctorsRouter.get('/:id/availability', async (req, res, next) => {
  try {
    const { date, mode } = req.query;
    const doctorId = req.params.id;

    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    const baseFilter = {
      doctorId,
      status: 'AVAILABLE',
      startAt: { $gte: dayStart, $lte: dayEnd }
    };

    // ---------- Cursor pagination ----------
    if (mode === 'cursor') {
      const { limit, filter } = parseCursorPagination(req.query);

      const docs = await Slot.find({ ...baseFilter, ...filter })
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1);

      const hasNext = docs.length > limit;
      if (hasNext) docs.pop();

      const nextCursor = hasNext ? buildNextCursorFromDocs(docs) : null;

      return res.json({
        items: docs,
        nextCursor,
        hasNext
        }
      );
    }

    // ---------- Offset pagination ----------
    const { limit, skip, page } = parseOffsetPagination(req.query);

    const [items, total] = await Promise.all([
      Slot.find(baseFilter)
        .sort({ createdAt: 1, _id: 1 })
        .skip(skip)
        .limit(limit),
      Slot.countDocuments(baseFilter)
    ]);

    res.json({
      items,
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
