
const express = require("express");
const Order = require("../models/Order");
const CircuitBreaker = require("../circuitBreaker");

const router = express.Router();

// Circuit breaker protecting payment service
const paymentBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 10000
});

// Simulated external payment service
async function fakePaymentService(orderId) {
  console.log("Calling payment service for", orderId);

  // Simulate failure 70% of the time
  if (Math.random() < 0.7) {
    throw new Error("Payment service failed");
  }

  return "PAID";
}

// CREATE ORDER (Circuit Breaker protected)
router.post("/", async (req, res) => {
  try {
    const order = await Order.create({
      product: req.body.product,
      amount: req.body.amount,
      status: "CREATED"
    });

    await paymentBreaker.execute(async () => {
      const status = await fakePaymentService(order._id);
      order.status = status;
      await order.save();
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(503).json({
      error: err.message,
      breakerState: paymentBreaker.state
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
