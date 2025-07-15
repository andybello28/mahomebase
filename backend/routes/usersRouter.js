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
    console.log(allLeaguesData);
    return res.status(200).json({
      leagues: allLeaguesData,
    });
  } catch (error) {
    console.error("Error in GET /users/:googleid/leagues", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:googleid/leagues", async (req, res) => {
  const { google_id: google_id, league_ids: league_ids } = req.user;
  const sleeperId = req.user.sleeper_id;
  const currentYear = new Date().getFullYear().toString();
  const years = Array.from({ length: currentYear - 2017 + 1 }, (_, i) =>
    (currentYear - i).toString()
  );
  try {
    for (const year of years) {
      const response = await fetch(
        `https://api.sleeper.app/v1/user/${sleeperId}/leagues/nfl/${year}`
      );
      const leagues = await response.json();
      for (const league of leagues) {
        if (league_ids.includes(league.league_id)) {
          continue;
        } else {
          await createLeague(google_id, league);
        }
      }
    }
    return res.status(200).json({ message: "Leagues updated successfully" });
  } catch (error) {
    console.error("Error in POST /users/:googleid/leagues", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues/transactions", async (req, res) => {
  try {
    const { league_ids: league_ids } = req.user;
    const currentYear = new Date().getFullYear().toString();
    const leagues = await Promise.all(league_ids.map((id) => getLeague(id)));
    const filteredLeagues = leagues.filter(
      (league) => league.season === currentYear
    );
    const response1 = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await response1.json();
    const round = state.week === 0 ? 1 : state.week;
    let transactions = [];
    for (const filteredLeague of filteredLeagues) {
      const response2 = await fetch(
        `https://api.sleeper.app/v1/league/${filteredLeague.league_id}/transactions/${round}`
      );
      const leagueTransaction = await response2.json();
      transactions.push(...leagueTransaction);
    }
    res.json(transactions);
  } catch (error) {
    console.error("Error getting recent activity");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues/:leagueid", async (req, res) => {
  try {
    const { league_id } = req.params;
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${league_id}`
    );
    const leagueData = await response.json();
    return res.status(200).json({
      league: leagueData,
    });
  } catch (error) {
    console.error("Error in POST /users/:googleid/leagues/:season", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
