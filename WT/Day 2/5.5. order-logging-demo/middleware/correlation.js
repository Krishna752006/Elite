
const { v4: uuid } = require("uuid");
const logger = require("../utils/logger");

module.exports = function correlationMiddleware(req, res, next) {
  const incomingId = req.header("X-Correlation-Id");
  const correlationId = incomingId || uuid();

  req.correlationId = correlationId;
  res.setHeader("X-Correlation-Id", correlationId);

  logger.info("Incoming request", {
    correlationId,
    method: req.method,
    path: req.originalUrl
  });

  next();
};
