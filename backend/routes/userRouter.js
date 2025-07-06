const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const validateLeague = require("../validators/leagueValidator");
const { createLeague, deleteLeague } = require("../db/queries");

router.post("/leagues/create", validateLeague, async (req, res) => {
  try {
    const errors = validationResult(req);
    //message will be an array of messages saying why the requested league failed to be pushed.
    if (!errors.isEmpty()) {
      let msgArray = [];
      errors.array().forEach((e) => {
        msgArray.push(e.msg);
      });
      return res.status(400).json({ message: msgArray });
    }
    const { leagueId } = req.body;
    const { google_id: googleId, leagues: leagues } = req.user;

    //Check if the league is in sleeper api
    const sleeperRes = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId.trim()}`
    );
    const sleeperResText = await sleeperRes.text();
    if (sleeperResText === "null") {
      return res.status(404).json({
        message: ["Could not find this league in Sleeper"],
      });
    }

    const newLeagues = await createLeague(googleId, leagues, leagueId);

    if (!newLeagues) {
      return res.status(409).json({
        message: [
          `This league is already registered to your Mahomebase account`,
        ],
      });
    } else {
      return res.status(200).json({
        leagues: newLeagues,
      });
    }
  } catch (error) {
    console.error("Error in POST /leagues/create:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leagues/delete", async (req, res) => {
  try {
    const { leagueId } = req.body;
    const { google_id: googleId, leagues: leagues } = req.user;

    const updatedLeagues = await deleteLeague(googleId, leagues, leagueId);
    return res.status(200).json({
      leagues: updatedLeagues,
    });
  } catch (error) {
    console.error("Error in POST /leagues/delete:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
