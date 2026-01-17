
const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

function generateETag(order) {
  return `"order-${order._id}-${order.updatedAt.getTime()}"`;
}

router.post("/", async (req, res) => {
  const order = await Order.create({
    product: req.body.product,
    amount: req.body.amount,
    status: "CREATED"
  });
  res.status(201).json(order);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  const etag = generateETag(order);
  res.set("ETag", etag);

  const clientETag = req.headers["if-none-match"];
  if (clientETag === etag) {
    return res.status(304).end();
  }

  res.json(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!order) return res.status(404).json({ error: "Order not found" });

  res.json(order);
});

module.exports = router;
