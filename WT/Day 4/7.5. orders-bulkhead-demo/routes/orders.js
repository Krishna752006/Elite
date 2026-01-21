
const express = require("express");
const Order = require("../models/Order");
const Bulkhead = require("../bulkhead");

const router = express.Router();

// Bulkhead allowing only 2 concurrent operations
const paymentBulkhead = new Bulkhead(2);

// Simulated slow service
function fakePaymentService(orderId) {
  return new Promise((resolve) => {
    console.log("Processing payment for", orderId);
    setTimeout(() => resolve("PAID"), 3000);
  });
}

// CREATE ORDER (Bulkhead protected)
router.post("/", async (req, res) => {
  try {
    const order = await Order.create({
      product: req.body.product,
      amount: req.body.amount,
      status: "CREATED"
    });

    await paymentBulkhead.execute(async () => {
      const status = await fakePaymentService(order._id);
      order.status = status;
      await order.save();
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(429).json({
      error: err.message,
      message: "Too many concurrent requests. Please retry later."
    });
  }
});

// READ ORDER
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

module.exports = router;
