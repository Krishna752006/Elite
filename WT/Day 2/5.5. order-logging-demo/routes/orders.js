
const express = require("express");
const Order = require("../models/Order");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    logger.info("Creating order", { correlationId: req.correlationId });

    const order = await Order.create({
      product: req.body.product,
      amount: req.body.amount,
      status: "CREATED"
    });

    logger.info("Order created", {
      correlationId: req.correlationId,
      orderId: order._id
    });

    res.status(201).json(order);
  } catch (err) {
    logger.error("Order creation failed", {
      correlationId: req.correlationId,
      error: err.message
    });
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    logger.info("Fetching order", {
      correlationId: req.correlationId,
      orderId: req.params.id
    });

    const order = await Order.findById(req.params.id);
    if (!order) {
      logger.error("Order not found", {
        correlationId: req.correlationId,
        orderId: req.params.id
      });
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    logger.error("Fetch order failed", {
      correlationId: req.correlationId,
      error: err.message
    });
    next(err);
  }
});

module.exports = router;
