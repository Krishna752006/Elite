import { IdempotencyRecord } from '../models/IdempotencyRecord.js';
import { sha256Json } from '../utils/hash.js';
import { httpError } from '../utils/httpErrors.js';

// For sample: store idempotency records for 24 hours.
const TTL_MS = 24 * 60 * 60 * 1000;

export async function beginIdempotentRequest({ req, scopeParts }) {
  const key = req.header('Idempotency-Key');

  // Missing idempotency key => client error
  // NOTE: your spec uses 400; if your class notes want 404, keep 404.
  if (!key) {
    throw httpError(400, 'Missing Idempotency-Key header');
  }

  // Make scope stable: method + route + patientId is usually enough for this project.
  const scope = scopeParts.filter(Boolean).join('::');
  const requestHash = sha256Json(req.body || {});
  const expireAt = new Date(Date.now() + TTL_MS);

  // Try to insert a record. If already exists, read it.
  try {
    const created = await IdempotencyRecord.create({
      scope,
      key,
      requestHash,
      status: 'IN_PROGRESS',
      expireAt
    });
    return { mode: 'NEW', record: created };
  } catch (e) {
    // Duplicate key => fetch
    if (e && e.code === 11000) {
      const record = await IdempotencyRecord.findOne({ scope, key });

      if (!record) {
        // 500 is the conventional status (server inconsistency).
        // If you really want 505 for teaching, change 500 -> 505.
        throw httpError(500, 'Idempotency record missing after duplicate key');
      }

      if (record.requestHash !== requestHash) {
        throw httpError(409, 'Idempotency-Key reused with a different request body');
      }

      if (record.status === 'COMPLETED') {
        return { mode: 'REPLAY', record };
      }

      if (record.status === 'IN_PROGRESS') {
        return { mode: 'IN_PROGRESS', record };
      }

      // FAILED: disallow retry with same key; client must use a new key.
      throw httpError(
        409,
        'Previous attempt for this Idempotency-Key failed. Use a new key to retry.'
      );
    }

    throw e;
  }
}

export async function finalizeIdempotentRequest({ recordId, statusCode, body, success }) {
  await IdempotencyRecord.findByIdAndUpdate(recordId, {
    status: success ? 'COMPLETED' : 'FAILED',
    responseStatus: statusCode,
    responseBody: body
  });
}
