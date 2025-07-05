const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const validateLeague = require("../validators/leagueValidator");
const { createLeague } = require("../db/queries");

router.post("/leagues", validateLeague, async (req, res) => {
  try {
    const errors = validationResult(req);
    //message will be an array of messages saying why the requested league failed to be pushed.
    if (!errors.isEmpty()) {
      let msgArray = [];
      errors.array().forEach((e) => {
        msgArray.push(e.msg);
      });
      return res.json({ message: msgArray });
    }
    const { leagueId } = req.body;
    const { google_id: googleId, leagues: leagues } = req.user;

    //Check if the league is in sleeper api
    const sleeperRes = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId.trim()}`
    );
    const sleeperResText = await sleeperRes.text();
    if (sleeperResText === "null") {
      return res.json({
        message: ["Could not find this league in Sleeper"],
      });
    }

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
