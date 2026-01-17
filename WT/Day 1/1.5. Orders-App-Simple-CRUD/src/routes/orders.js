const express = require("express");
const Order = require("../models/Order");
const { charge } = require("../services/paymentProvider");

const router = express.Router();

router.post("/", async (req, res, next) => {
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

// PUT = full update (client sends all fields)
router.put("/:id", async (req, res) => {
  try {
    const { userId, amount, currency, status } = req.body;

    // keep it simple: require the core fields
    if (!userId || amount === undefined || !currency) {
      return res.status(400).json({
        error: "userId, amount, currency are required for PUT",
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Not found" });

    order.userId = userId;
    order.amount = amount;
    order.currency = currency;
    if (status !== undefined) order.status = status;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH = partial update (client sends only changed fields)
router.patch("/:id", async (req, res) => {
  try {
    const allowed = ["userId", "amount", "currency", "status"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;