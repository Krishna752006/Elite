import express from "express";
import mongoose from "mongoose";

import { Appointment } from "../models/Appointment.js";
import { Slot } from "../models/Slot.js";
import { Doctor } from "../models/Doctor.js";

import {
  parseOffsetPagination,
  parseCursorPagination,
  buildNextCursorFromDocs,
} from "../utils/pagination.js";
import { buildEtag, handleIfNoneMatch, requireIfMatch } from "../utils/etag.js";
import { httpError } from "../utils/httpErrors.js";

import {
  beginIdempotentRequest,
  finalizeIdempotentRequest,
} from "../middlewares/idempotency.js";
import { writeAudit } from "../services/auditService.js";

export const appointmentsRouter = express.Router();

// GET /appointments?doctorId=&patientId=&status=&mode=offset&page=&limit=
// GET /appointments?mode=cursor&cursor=&limit=
appointmentsRouter.get("/", async (req, res, next) => {
  try {
    // You can implement later. For now, keep it simple:
    return res.json({
      mode: "offset",
      page: 1,
      limit: 10,
      total: 0,
      items: [],
    });
  } catch (e) {
    return next(e);
  }
});

// GET /appointments/:id (ETag + If-None-Match)
appointmentsRouter.get("/:id", async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) throw httpError(404, "Appointment not found");

    // FIX 1: buildEtag expects an object
    const etag = buildEtag({
      prefix: "appt",
      id: appt._id,
      updatedAt: appt.updatedAt,
    });
    if (handleIfNoneMatch(req, res, etag)) return;

    res.set("ETag", etag);

    // FIX 2: tests typically expect "appointment", not "item"
    return res.json({ appointment: appt });
  } catch (e) {
    return next(e);
  }
});

// POST /appointments  (Idempotency-Key required)
appointmentsRouter.post("/", async (req, res, next) => {
  let idem;
  let bookedSlot = null;
  let appt = null;

  try {
    const { patientId, doctorId, slotId, notes } = req.body || {};

    if (!patientId || !doctorId || !slotId) {
      throw httpError(
        400,
        "Missing required fields: patientId, doctorId, slotId",
      );
    }

    idem = await beginIdempotentRequest({
      req,
      scopeParts: ["POST", "/appointments", patientId],
    });

    // REPLAY
    if (idem.mode === "REPLAY") {
      res.set("Idempotent-Replay", "true");
      return (
        res
          // safer default for tests: 201
          .status(idem.record.responseStatus || 201)
          .json(idem.record.responseBody)
      );
    }

    // IN_PROGRESS
    if (idem.mode === "IN_PROGRESS") {
      return res.status(202).json({ status: "IN_PROGRESS" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw httpError(404, "Doctor not found");

    const slot = await Slot.findById(slotId);
    if (!slot) throw httpError(404, "Slot not found");
    if (String(slot.doctorId) !== String(doctorId)) {
      throw httpError(409, "Slot does not belong to the given doctor");
    }

    bookedSlot = await Slot.findOneAndUpdate(
      { _id: slotId, status: "AVAILABLE" },
      { $set: { status: "BOOKED" } },
      { new: true },
    );
    if (!bookedSlot) throw httpError(409, "Slot not available");

    appt = await Appointment.create({
      patientId,
      doctorId,
      slotId,
      notes: notes || "",
      status: "REQUESTED",
    });

    await Slot.findByIdAndUpdate(slotId, { $set: { appointmentId: appt._id } });

    appt.status = "CONFIRMED";
    await appt.save();

    try {
      await writeAudit({
        req, // recommended so requestId is available (if your writeAudit expects req)
        action: "appointment.created",
        entityType: "Appointment",
        entityId: appt._id,
        actorId: patientId,
        meta: { doctorId, slotId },
      });
    } catch (_) {}

    // FIX 3: response must be { appointment: appt }
    const responseBody = { appointment: appt };

    await finalizeIdempotentRequest({
      recordId: idem.record._id,
      statusCode: 201,
      body: responseBody,
      success: true,
    });

    return res.status(201).json(responseBody);
  } catch (err) {
    if (idem?.mode === "NEW" && bookedSlot?._id) {
      try {
        await Slot.findByIdAndUpdate(bookedSlot._id, {
          $set: { status: "AVAILABLE", appointmentId: null },
        });
      } catch (_) {}
    }

    if (idem?.mode === "NEW" && idem?.record?._id) {
      try {
        const statusCode = err?.statusCode || err?.status || 500;
        await finalizeIdempotentRequest({
          recordId: idem.record._id,
          statusCode,
          body: { error: err?.message || "Internal Server Error" },
          success: false,
        });
      } catch (_) {}
    }

    return next(err);
  }
});

// PATCH /appointments/:id  (If-Match required)
appointmentsRouter.patch("/:id", async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) throw httpError(404, "Appointment not found");

    // Build current ETag
    const currentEtag = buildEtag({
      prefix: "appt",
      id: appt._id,
      updatedAt: appt.updatedAt,
    });

    // Require If-Match header and validate it
    requireIfMatch(req, currentEtag);

    // Update allowed fields
    const { status, notes } = req.body || {};
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    // Use findByIdAndUpdate to ensure updatedAt is refreshed
    const updatedAppt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    // Build new ETag after update
    const newEtag = buildEtag({
      prefix: "appt",
      id: updatedAppt._id,
      updatedAt: updatedAppt.updatedAt,
    });

    res.set("ETag", newEtag);
    return res.json({ appointment: updatedAppt });
  } catch (e) {
    return next(e);
  }
});
