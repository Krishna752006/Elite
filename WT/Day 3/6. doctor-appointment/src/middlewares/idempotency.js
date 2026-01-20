import { IdempotencyRecord } from '../models/IdempotencyRecord.js';
import { sha256Json } from '../utils/hash.js';
import { httpError } from '../utils/httpErrors.js';

// Store idempotency records for 24 hours
const TTL_MS = 24 * 60 * 60 * 1000;

export async function beginIdempotentRequest({ req, scopeParts }) {
  const key = req.header('Idempotency-Key');

  if (!key) {
    throw httpError(400, 'Missing Idempotency-Key header');
  }

  const scope = scopeParts.filter(Boolean).join('::');
  const requestHash = sha256Json(req.body || {});
  const expireAt = new Date(Date.now() + TTL_MS);

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
    if (e.code === 11000) {
      const record = await IdempotencyRecord.findOne({ scope, key });

      if (!record) {
        throw httpError(500, 'Idempotency record missing after duplicate key');
      }

      if (record.requestHash !== requestHash) {
        throw httpError(409, 'Idempotency-Key reused with a different request body');
      }

      if (record.status === 'COMPLETED') {
        return { mode: 'REPLAY', record };
      }

      if (record.status === 'IN_PROGRESS') {
        throw httpError(409, 'Request already in progress');
      }

      throw httpError(409, 'Previous attempt failed. Use a new Idempotency-Key.');
    }

    throw e;
  }
}

export async function finalizeIdempotentRequest({
  recordId,
  statusCode,
  body,
  success
}) {
  await IdempotencyRecord.findByIdAndUpdate(recordId, {
    status: success ? 'COMPLETED' : 'FAILED',
    responseStatus: statusCode,
    responseBody: body
  });
}
