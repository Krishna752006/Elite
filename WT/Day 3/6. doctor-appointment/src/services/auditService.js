import { AuditLog } from '../models/AuditLog.js';

export async function writeAudit({ req, action, entityType = '', entityId = '', actorType = 'system', actorId = '', meta = {} }) {
  try {
    await AuditLog.create({
      action,
      entityType,
      entityId,
      actorType,
      actorId,
      requestId: req.requestId,
      meta
    });
  } catch (e) {
    // Audit must never crash main flow.
    console.warn(JSON.stringify({
      ts: new Date().toISOString(),
      level: 'warn',
      requestId: req.requestId,
      message: 'Failed to write audit log',
      error: e.message
    }));
  }
}
