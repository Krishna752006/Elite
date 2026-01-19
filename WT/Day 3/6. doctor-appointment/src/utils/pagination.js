import { encodeCursor, decodeCursor } from './cursor.js';

function parseIntSafe(v, defVal) {
  const n = parseInt(String(v || ''), 10);
  return Number.isFinite(n) && n > 0 ? n : defVal;
}

export function parseOffsetPagination(query) {
  const limit = Math.min(parseIntSafe(query.limit, 10), 50);
  const page = Math.max(parseIntSafe(query.page, 1), 1);
  const skip = (page - 1) * limit;
  return { limit, page, skip};
}

export function parseCursorPagination(query) {
  const limit = Math.min(parseIntSafe(query.limit, 10), 50);
  const decoded = query.cursor ? decodeCursor(query.cursor) : null;

  let filter = {};

  if (decoded) {
    filter = {
      $or: [
        { createdAt: { $gt: decoded.createdAt } },
        {
          createdAt: decoded.createdAt,
          _id: { $gt: decoded.id }
        }
      ]
    };
  }

  return {
    limit,
    cursor: decoded,
    filter
  };
}

export function buildNextCursorFromDocs(docs) {
  if (!docs || docs.length === 0) return null;

  const last = docs[docs.length - 1];

  return encodeCursor({
    createdAt: last.createdAt,
    id: last._id
  });
}
