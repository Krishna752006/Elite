import { encodeCursor, decodeCursor } from './cursor.js';

function getQuery(input) {
  // Allow calling with req OR req.query (both work)
  return input && input.query ? input.query : (input || {});
}

function parseIntSafe(v, defVal) {
  const n = parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? n : defVal;
}

// Offset pagination: page + limit
// Returns: { page, limit, skip }
export function parseOffsetPagination(input) {
  const q = getQuery(input);

  const pageRaw = parseIntSafe(q.page, 1);
  const limitRaw = parseIntSafe(q.limit, 10);

  const page = Math.max(pageRaw, 1);
  const limit = Math.min(Math.max(limitRaw, 1), 100); // safety cap
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Cursor pagination: cursor token + limit
// Returns: { limit, cursor } where cursor is { createdAt: Date, id: string } or null
export function parseCursorPagination(input) {
  const q = getQuery(input);

  const limitRaw = parseIntSafe(q.limit, 10);
  const limit = Math.min(Math.max(limitRaw, 1), 100);

  const cursorToken = q.cursor ? String(q.cursor) : null;
  const cursor = cursorToken ? decodeCursor(cursorToken) : null;

  return { limit, cursor };
}

/**
 * Build nextCursor for cursor pagination.
 *
 * Usage pattern (important):
 *  - Query Mongo with .limit(limit + 1)
 *  - Then call buildNextCursorFromDocs(docs, limit)
 *  - It returns { items, nextCursor }
 */
export function buildNextCursorFromDocs(docs, limit) {
  const arr = Array.isArray(docs) ? docs : [];
  const hasMore = arr.length > limit;

  const items = hasMore ? arr.slice(0, limit) : arr;

  if (!hasMore || items.length === 0) {
    return { items, nextCursor: null };
  }

  const last = items[items.length - 1];

  // IMPORTANT: cursor.js expects { createdAt, id }
  // Most of your models have timestamps, so createdAt exists.
  const createdAt = last.createdAt;
  const id = last._id;

  if (!createdAt || !id) {
    return { items, nextCursor: null };
  }

  const nextCursor = encodeCursor({ createdAt, id });
  return { items, nextCursor };
}
