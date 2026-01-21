import express from 'express';
import mongoose from 'mongoose';

import { Doctor } from '../models/Doctor.js';
import { Slot } from '../models/Slot.js';
import { parseOffsetPagination, parseCursorPagination, buildNextCursorFromDocs } from '../utils/pagination.js';
import { buildEtag, handleIfNoneMatch, requireIfMatch } from '../utils/etag.js';
import { httpError } from '../utils/httpErrors.js';
import { writeAudit } from '../services/auditService.js';

export const doctorsRouter = express.Router();

// GET /doctors?city=&specialty=&page=&limit=
// GET /doctors?mode=cursor&cursor=&limit=
doctorsRouter.get('/', async (req, res, next) => {
  try {
    const { city, specialty } = req.query;
    const mode = String(req.query.mode || 'offset');

    const filter = {};
    if (city) filter.city = String(city);
    if (specialty) filter.specialty = String(specialty);

    // Cursor pagination (createdAt desc, _id desc)
    if (mode === 'cursor') {
      const { limit, cursor } = parseCursorPagination(req);

      const query = { ...filter };

      if (cursor?.createdAt && cursor?.id) {
        query.$or = [
          { createdAt: { $lt: cursor.createdAt } },
          { createdAt: cursor.createdAt, _id: { $lt: new mongoose.Types.ObjectId(cursor.id) } }
        ];
      }

      const docs = await Doctor.find(query)
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit + 1);

      const { items, nextCursor } = buildNextCursorFromDocs(docs, limit);

      return res.json({
        mode: 'cursor',
        items,
        nextCursor
      });
    }

    // Offset pagination
    const { page, limit, skip } = parseOffsetPagination(req);

    const [items, total] = await Promise.all([
      Doctor.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit),
      Doctor.countDocuments(filter)
    ]);

    return res.json({
      mode: 'offset',
      page,
      limit,
      total,
      items
    });
  } catch (err) {
    return next(err);
  }
});

// GET /doctors/:id  (ETag + If-None-Match)
doctorsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await Doctor.findById(id);
    if (!doc) throw httpError(404, 'Doctor not found');

    const etag = buildEtag('doctor', doc._id, doc.updatedAt);
    if (handleIfNoneMatch(req, res, etag)) return;

    res.set('ETag', etag);
    return res.json({ item: doc });
  } catch (err) {
    return next(err);
  }
});

// PUT /doctors/:id  (If-Match required)
doctorsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Doctor.findById(id);
    if (!existing) throw httpError(404, 'Doctor not found');

    const currentEtag = buildEtag('doctor', existing._id, existing.updatedAt);
    requireIfMatch(req, currentEtag); // throws 428 (missing) or 412 (stale)

    const { name, specialty, city, fee } = req.body || {};
    if (name !== undefined) existing.name = name;
    if (specialty !== undefined) existing.specialty = specialty;
    if (city !== undefined) existing.city = city;
    if (fee !== undefined) existing.fee = fee;

    await existing.save();

    const newEtag = buildEtag('doctor', existing._id, existing.updatedAt);
    res.set('ETag', newEtag);

    // Audit (best-effort)
    try {
      await writeAudit({
        action: 'doctor.updated',
        entityType: 'Doctor',
        entityId: existing._id,
        actorId: req.header('X-Actor-Id') || 'system',
        meta: { updatedFields: Object.keys(req.body || {}) }
      });
    } catch (_) {}

    return res.json({ item: existing });
  } catch (err) {
    return next(err);
  }
});

// GET /doctors/:id/availability?date=YYYY-MM-DD&mode=offset&page=1&limit=10
// GET /doctors/:id/availability?date=YYYY-MM-DD&mode=cursor&cursor=&limit=10
// Returns AVAILABLE slots for that date.
doctorsRouter.get('/:id/availability', async (req, res, next) => {
  try {
    const { id: doctorId } = req.params;
    const date = req.query.date ? String(req.query.date) : null;

    if (!date) throw httpError(400, 'Missing required query param: date');

    // Validate doctor exists
    const doctorExists = await Doctor.exists({ _id: doctorId });
    if (!doctorExists) throw httpError(404, 'Doctor not found');

    // Build UTC day window
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw httpError(400, 'Invalid date format. Use YYYY-MM-DD');
    }

    const mode = String(req.query.mode || 'offset');

    const baseFilter = {
      doctorId: new mongoose.Types.ObjectId(doctorId),
      status: 'AVAILABLE',
      startAt: { $gte: start, $lte: end }
    };

    // Cursor mode (NOTE: cursor.js uses createdAt, so cursor pagination here is by createdAt)
    if (mode === 'cursor') {
      const { limit, cursor } = parseCursorPagination(req);

      const query = { ...baseFilter };

      if (cursor?.createdAt && cursor?.id) {
        query.$or = [
          { createdAt: { $gt: cursor.createdAt } },
          { createdAt: cursor.createdAt, _id: { $gt: new mongoose.Types.ObjectId(cursor.id) } }
        ];
      }

      const docs = await Slot.find(query)
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1);

      const { items, nextCursor } = buildNextCursorFromDocs(docs, limit);

      return res.json({
        mode: 'cursor',
        items,
        nextCursor
      });
    }

    // Offset mode (sorted by start time for UX)
    const { page, limit, skip } = parseOffsetPagination(req);

    const [items, total] = await Promise.all([
      Slot.find(baseFilter).sort({ startAt: 1, _id: 1 }).skip(skip).limit(limit),
      Slot.countDocuments(baseFilter)
    ]);

    return res.json({
      mode: 'offset',
      page,
      limit,
      total,
      items
    });
  } catch (err) {
    return next(err);
  }
});
