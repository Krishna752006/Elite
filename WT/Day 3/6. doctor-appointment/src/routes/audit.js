import express from 'express';
import mongoose from 'mongoose';

import { AuditLog } from '../models/AuditLog.js';
import { parseOffsetPagination, parseCursorPagination } from '../utils/pagination.js';
import { encodeCursor } from '../utils/cursor.js';

export const auditRouter = express.Router();

// GET /audit/logs?entityType=&entityId=&action=&mode=offset&page=&limit=
// GET /audit/logs?mode=cursor&cursor=&limit=
auditRouter.get('/logs', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.entityType) filter.entityType = String(req.query.entityType);
    if (req.query.entityId) filter.entityId = String(req.query.entityId);
    if (req.query.action) filter.action = String(req.query.action);

    const mode = String(req.query.mode || 'offset');

    if (mode === 'cursor') {
      const { limit, cursor } = parseCursorPagination(req.query);
      const sort = { ts: -1, _id: -1 };

      const query = { ...filter };
      if (cursor) {
        query.$or = [
          { ts: { $lt: cursor.createdAt } },
          { ts: cursor.createdAt, _id: { $lt: new mongoose.Types.ObjectId(cursor.id) } }
        ];
      }

      const docs = await AuditLog.find(query).sort(sort).limit(limit + 1);
      const hasMore = docs.length > limit;
      const pageDocs = hasMore ? docs.slice(0, limit) : docs;
      const last = pageDocs[pageDocs.length - 1];
      const nextCursor = hasMore && last ? encodeCursor({ createdAt: last.ts, id: last._id }) : null;

      res.json({ mode: 'cursor', items: pageDocs, nextCursor, hasMore });
      return;
    }

    const { page, limit, skip } = parseOffsetPagination(req.query);
    const [items, total] = await Promise.all([
      AuditLog.find(filter).sort({ ts: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filter)
    ]);

    res.json({ mode: 'offset', page, limit, total, totalPages: Math.ceil(total / limit), items });
  } catch (e) {
    next(e);
  }
});
