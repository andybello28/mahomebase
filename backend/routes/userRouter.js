const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const validateLeague = require("../validators/leagueValidator");
const { createLeague } = require("../db/queries");

router.post("/leagues", validateLeague, async (req, res) => {
  try {
    const errors = validationResult(req);
    //message will be an array of messages saying why the requested league failed to be pushed. Some of these
    //are gotten straight from the express validator or if the requested league to be added is already assigned to a user.
    if (!errors.isEmpty()) {
      let msgArray = [];
      errors.array().forEach((e) => {
        msgArray.push(e.msg);
      });
      return res.json({ message: msgArray });
    }
    const { leagueId } = req.body;
    const { google_id: googleId, leagues: leagues } = req.user;
    const newLeagues = await createLeague(googleId, leagues, leagueId);

    if (!newLeagues) {
      return res.json({
        message: [`${leagueId} already registered to your account`],
      });
    } else {
      return res.json({
        leagues: newLeagues,
      });
    }
  } catch (error) {
    console.error("Error in POST /leagues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
