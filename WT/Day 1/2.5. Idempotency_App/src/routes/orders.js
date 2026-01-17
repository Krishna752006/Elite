const express = require("express");
const Order = require("../models/Order");
const { charge } = require("../services/paymentProvider");
const idempotency = require("../middleware/idempotency");

const router = express.Router();

router.post("/", idempotency(), async (req, res, next) => {
  try {
    const { userId, amount, currency } = req.body;

    const order = await Order.create({ userId, amount, currency });

    try {
      const payment = await charge({ orderId: order._id, amount, currency });
      order.status = "PAID";
      order.payment = payment;
      await order.save();
      res.status(201).json(order);
    } catch (e) {
      order.status = "PAYMENT_FAILED";
      await order.save();
      res.status(502).json({ error: "Payment failed", order });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json({ orders });
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

module.exports = router;