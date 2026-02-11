const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sessionAuth = require("../middleware/sessionAuth");
const roleAuth = require("../middleware/roleAuth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).send("User exists");

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
    role: role || "user"
  });

  res.send("User created");
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("Invalid credentials");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(401).send("Invalid credentials");

  req.session.user = {
    userId: user._id,
    role: user.role
  };

  res.send("Login successful");
});

router.get("/profile", sessionAuth, (req, res) => {
  res.json(req.session.user);
});

router.get("/admin", sessionAuth, roleAuth("admin"), (req, res) => {
  res.send("Welcome Admin");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
});

module.exports = router;