import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    ts: { type: Date, default: Date.now, index: true },
    actorType: { type: String, default: 'system' },
    actorId: { type: String, default: '' },
    action: { type: String, required: true, index: true },
    entityType: { type: String, default: '' },
    entityId: { type: String, default: '' },
    requestId: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: false }
);

auditLogSchema.index({ action: 1, ts: -1, _id: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
