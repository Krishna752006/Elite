import express from 'express';

import { Doctor } from '../models/Doctor.js';
import { Slot } from '../models/Slot.js';
import { Appointment } from '../models/Appointment.js';
import { IdempotencyRecord } from '../models/IdempotencyRecord.js';
import { AuditLog } from '../models/AuditLog.js';
import { httpError } from '../utils/httpErrors.js';

export const testRouter = express.Router();

function parseIntSafe(v, defVal) {
  const n = parseInt(String(v || ''), 10);
  return Number.isFinite(n) ? n : defVal;
}

function dayStartUtc(ymd) {
  return new Date(`${ymd}T00:00:00.000Z`);
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toYmdUtc(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// POST /test/reset
testRouter.post('/reset', async (req, res, next) => {
  try {
    await Promise.all([
      Doctor.deleteMany({}),
      Slot.deleteMany({}),
      Appointment.deleteMany({}),
      IdempotencyRecord.deleteMany({}),
      AuditLog.deleteMany({})
    ]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /test/seed?days=14&baseDate=2026-17-01
// Creates a few doctors + AVAILABLE slots for next N days.
testRouter.post('/seed', async (req, res, next) => {
  try {
    const days = Math.min(Math.max(parseIntSafe(req.query.days, 14), 1), 60);
    const baseDate = String(req.query.baseDate || process.env.SEED_BASE_DATE || '2026-01-01');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(baseDate)) {
      throw httpError(400, 'baseDate must be YYYY-MM-DD');
    }

    // Clean slate (seed endpoints are meant for tests)
    await Promise.all([
      Doctor.deleteMany({}),
      Slot.deleteMany({}),
      Appointment.deleteMany({}),
      IdempotencyRecord.deleteMany({}),
      AuditLog.deleteMany({})
    ]);

    const doctors = await Doctor.create([
      { name: 'Dr Anaya Rao', specialty: 'Dermatology', city: 'Hyderabad', fee: 500 },
      { name: 'Dr Kiran Mehta', specialty: 'Cardiology', city: 'Hyderabad', fee: 800 },
      { name: 'Dr Neel Shah', specialty: 'General Medicine', city: 'Hyderabad', fee: 400 }
    ]);

    const base = dayStartUtc(baseDate);

    // Slots: 6 slots/day per doctor, from 09:00 to 12:00 (every 30 mins)
    const slotDocs = [];
    for (const doc of doctors) {
      for (let i = 0; i < days; i += 1) {
        const day = addDays(base, i);
        const ymd = toYmdUtc(day);
        const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
        for (const t of times) {
          const startAt = new Date(`${ymd}T${t}:00.000Z`);
          const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);
          slotDocs.push({ doctorId: doc._id, startAt, endAt, status: 'AVAILABLE' });
        }
      }
    }

    await Slot.insertMany(slotDocs, { ordered: false });

    res.json({ ok: true, doctorsCount: doctors.length, slotsCount: slotDocs.length, daysSeeded: days, baseDate });
  } catch (e) {
    next(e);
  }
});
