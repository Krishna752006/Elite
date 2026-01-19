import { httpError } from './httpErrors.js';

export function buildEtag({ prefix, id, updatedAt }) {
  const ts = updatedAt instanceof Date
    ? updatedAt.getTime()
    : new Date(updatedAt).getTime();

  return `"${prefix}-${id}-${ts}"`;
}

/**
 * Handles conditional GET (If-None-Match)
 * Returns true if response was sent (304)
 */
export function handleIfNoneMatch(req, res, currentEtag) {
  const ifNoneMatch = req.headers['if-none-match'];

  if (ifNoneMatch && ifNoneMatch === currentEtag) {
    res.status(304).end();
    return true;
  }

  return false;
}

/**
 * Enforces If-Match (used for PUT/PATCH/DELETE)
 * Throws 428 or 412
 */
export function requireIfMatch(req, currentEtag) {
  const ifMatch = req.headers['if-match'];

  if (!ifMatch) {
    throw httpError(428, 'If-Match header required');
  }

  if (ifMatch !== currentEtag) {
    throw httpError(412, 'ETag mismatch');
  }
}
