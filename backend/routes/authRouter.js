const express = require("express");
const passport = require("../config/passport");
const router = express.Router();

const frontendUrl = process.env.FRONTEND_URL;

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
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
    failureRedirect: `${frontendUrl}?login=fail`,
    successRedirect: `${frontendUrl}/profile?login=success`,
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
      res.redirect(`${frontendUrl}?logout=success`);
    });
  });
});

module.exports = router;
