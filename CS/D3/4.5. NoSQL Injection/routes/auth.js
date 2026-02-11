
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ❌ Vulnerable Login (Injection Possible)
router.post("/login-vulnerable", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.send("Login Successful (Vulnerable)");
  else res.status(401).send("Invalid Credentials");
});

// ✅ Secure Login (Prepared-Statement Equivalent)
router.post("/login-secure", async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid Input Type");
  }

  const user = await User.findOne({ username, password }).lean();
  if (user) res.send("Login Successful (Secure)");
  else res.status(401).send("Invalid Credentials");
});

module.exports = router;
