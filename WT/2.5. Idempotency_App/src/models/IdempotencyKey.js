const mongoose = require("mongoose");

const IdempotencyKeySchema = new mongoose.Schema({
  key: String,
  method: String,
  path: String,
  userId: String,
  requestHash: String,
  status: { type: String, enum: ["IN_PROGRESS", "COMPLETED"], default: "IN_PROGRESS" },
  responseStatus: Number,
  responseBody: mongoose.Schema.Types.Mixed
}, { timestamps: true });

IdempotencyKeySchema.index(
  { key: 1, method: 1, path: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("IdempotencyKey", IdempotencyKeySchema);