const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/google", (req, res, next) => {
  console.log("👉 /auth/google route HIT");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    //res.redirect("/profile");
    res.redirect("/profile.html");
  }
);

module.exports = router;