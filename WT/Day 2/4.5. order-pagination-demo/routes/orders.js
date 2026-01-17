
const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Seed orders for demo
router.post("/seed", async (req, res) => {
  await Order.deleteMany({});
  const orders = [];
  for (let i = 1; i <= 50; i++) {
    orders.push({
      product: "Product-" + i,
      amount: 100 + i,
      status: "CREATED"
    });
  }
  await Order.insertMany(orders);
  res.json({ message: "50 orders seeded" });
});

// OFFSET-BASED PAGINATION
// GET /orders/offset?page=1&limit=10
router.get("/offset", async (req, res) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");
  const skip = (page - 1) * limit;

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments();

  res.json({
    paginationType: "offset",
    page,
    limit,
    total,
    data: orders
  });
});

// CURSOR-BASED PAGINATION
// GET /orders/cursor?cursor=<createdAt>&limit=10
router.get("/cursor", async (req, res) => {
  const limit = parseInt(req.query.limit || "10");
  const cursor = req.query.cursor;

  const query = cursor
    ? { createdAt: { $lt: new Date(cursor) } }
    : {};

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  const nextCursor =
    orders.length > 0
      ? orders[orders.length - 1].createdAt
      : null;

  res.json({
    paginationType: "cursor",
    limit,
    nextCursor,
    data: orders
  });
});

module.exports = router;
