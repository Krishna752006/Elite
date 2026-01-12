const express = require("express");
const { getBehavior, setBehavior } = require("../services/paymentProvider");

const router = express.Router();

router.get("/payment-behavior", (req, res) => {
  res.json(getBehavior());
});

router.post("/payment-behavior", (req, res) => {
  setBehavior(req.body || {});
  res.json(getBehavior());
});

module.exports = router;