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
  //WRITE YOUR CODE HERE
});

// GET /appointments/:id (ETag + If-None-Match)
appointmentsRouter.get('/:id', async (req, res, next) => {
  //WRITE YOUR CODE HERE
});

// POST /appointments  (Idempotency-Key required)
// body: { patientId, doctorId, slotId, notes? }
appointmentsRouter.post('/', async (req, res, next) => {
 

    // 1) Validate doctor & slot
    

    // 2) Atomically book the slot (AVAILABLE -> BOOKED)
   

    // 3) Create appointment
    

    // 4) Link slot -> appointment
    

    // 5) Confirm appointment
    appt.status = 'CONFIRMED';
    await appt.save();

    
});

// PATCH /appointments/:id  (If-Match required)
// body examples:
// { action: "cancel", reason: "..." }
// { action: "reschedule", newSlotId: "..." }
appointmentsRouter.patch('/:id', async (req, res, next) => {
  //WRITE YOUR CODE HERE
});
