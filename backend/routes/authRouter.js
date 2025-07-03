const express = require("express");
const passport = require("../config/passport");
const router = express.Router();

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null, message: "Not authenticated" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
    successRedirect: "http://localhost:3000/profile",
    session: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return next(err);
      }

      res.clearCookie("connect.sid");
      res.redirect("http://localhost:3000");
    });
  });
});

module.exports = router;
