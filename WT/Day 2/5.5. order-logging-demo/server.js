
const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orders");
const correlationMiddleware = require("./middleware/correlation");
const logger = require("./utils/logger");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/order_logging_demo")
  .then(() => logger.info("MongoDB connected"))
  .catch(err => logger.error("MongoDB error", { error: err.message }));

app.use(correlationMiddleware);

app.use("/orders", orderRoutes);

app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    correlationId: req.correlationId,
    error: err.message
  });
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () =>
  logger.info("Order Logging Demo running on http://localhost:3000")
);
