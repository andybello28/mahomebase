const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const validateSleeper = require("../validators/sleeperValidator");
const {
  linkSleeperId,
  unlinkSleeperId,
  createLeague,
  deleteLeagues,
  getLeague,
} = require("../db/queries");

router.post("/:googleid/link", validateSleeper, async (req, res) => {
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

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2017; year--) {
      years.push(year);
    }

    const { sleeperUsername } = req.body;
    const { google_id: googleId } = req.user;

    //Check if the user is in sleeper api
    const sleeperRes = await fetch(
      `https://api.sleeper.app/v1/user/${sleeperUsername}`
    );
    const sleeperData = await sleeperRes.json();
    if (!sleeperData) {
      return res.status(404).json({
        message: [`Could not find ${sleeperUsername} in Sleeper`],
      });
    }

    const sleeperId = sleeperData.user_id;

    const connectSleeper = await linkSleeperId(
      googleId,
      sleeperUsername,
      sleeperId
    );

    let allLeaguesData = [];
    for (const season of years) {
      const response = await fetch(
        `https://api.sleeper.app/v1/user/${sleeperId}/leagues/nfl/${season}`
      );

      if (!response.ok) {
        console.error(
          `API request failed for season ${season} with status ${response.status}`
        );
        continue;
      }

      const leaguesData = await response.json();

      if (leaguesData && leaguesData.length > 0) {
        for (const element of leaguesData) {
          allLeaguesData.push(element);
          await createLeague(googleId, element);
        }
      }
    }
    return res.status(200).json({
      sleeper_username: connectSleeper,
    });
  } catch (error) {
    console.error("Error in POST /link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:googleid/unlink", async (req, res) => {
  try {
    const { google_id: googleId, league_ids: leagueIds } = req.user;

    const nullUsername = await unlinkSleeperId(googleId);
    await deleteLeagues(googleId, leagueIds);
    return res.status(200).json({
      sleeper_username: nullUsername,
    });
  } catch (error) {
    console.error("Error in POST /unlink:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues", async (req, res) => {
  const { league_ids: league_ids } = req.user;

  try {
    let allLeaguesData = [];
    for (const id of league_ids) {
      const leagueData = await getLeague(id);

      if (!leagueData) {
        console.error("API request failed");
        continue;
      }

      allLeaguesData.push(leagueData);
    }

    return res.status(200).json({
      leagues: allLeaguesData,
    });
  } catch (error) {
    console.error("Error in POST /users/:googleid/leagues", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues/:leagueid", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/user/${sleeper_id}/leagues/nfl/${season}`
    );
    const leagueData = response.json();
  } catch (error) {
    console.error("Error in POST /users/:googleid/leagues/:season", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
