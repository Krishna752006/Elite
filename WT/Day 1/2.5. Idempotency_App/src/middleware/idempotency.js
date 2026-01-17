const crypto = require("crypto");
const IdempotencyKey = require("../models/IdempotencyKey");

function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map(k => JSON.stringify(k)+":"+stableStringify(obj[k])).join(",") + "}";
}

function hash(body) {
  return crypto.createHash("sha256").update(stableStringify(body)).digest("hex");
}

module.exports = function idempotency() {
  return async function(req, res, next) {
    const key = req.header("Idempotency-Key");
    if (!key) return res.status(400).json({ error: "Missing Idempotency-Key" });

    const filter = {
      key,
      method: req.method,
      path: req.baseUrl + req.path,
      userId: req.body?.userId || null
    };

    const reqHash = hash(req.body);
    let record = await IdempotencyKey.findOne(filter);

    if (record) {
      if (record.requestHash !== reqHash)
        return res.status(409).json({ error: "Payload mismatch for idempotency key" });

      if (record.status === "COMPLETED")
        return res.status(record.responseStatus).json(record.responseBody);

      return res.status(202).json({ status: "IN_PROGRESS" });
    }

    await IdempotencyKey.create({ ...filter, requestHash: reqHash });

    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await IdempotencyKey.updateOne(
        filter,
        { status: "COMPLETED", responseStatus: res.statusCode, responseBody: body }
      );
      return originalJson(body);
    };

    next();
  };
};