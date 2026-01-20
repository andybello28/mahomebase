const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const validateSleeper = require("../validators/sleeperValidator");
const leagueValidator = require("../validators/leagueValidator");
const {
  linkSleeperId,
  unlinkSleeperId,
  upsertLeague,
  updateLeague,
  deleteLeague,
  deleteLeagues,
  getLeague,
  getUserByGoogleId,
  getLeagueTransactions,
} = require("../db/queries");

router.put("/:googleid/sleeper", validateSleeper, async (req, res) => {
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

    await linkSleeperId(googleId, sleeperUsername, sleeperId);

    const updatedUser = await getUserByGoogleId(googleId);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in POST /link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:googleid/sleeper", async (req, res) => {
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
  const { sleeper_id: sleeper_id, league_ids: league_ids } = req.user;
  if (!sleeper_id) {
    return res.status(400).json({ error: "User not linked to Sleeper" });
  }

  try {
    const leagueDataList = await Promise.all(
      league_ids.map((id) => getLeague(id))
    );
    //Remove nulls
    const allLeaguesData = leagueDataList.filter((data) => data);

    return res.status(200).json({
      leagues: allLeaguesData,
    });
  } catch (error) {
    console.error("Error in GET /users/:googleid/leagues", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:googleid/leagues", async (req, res) => {
  const {
    google_id: google_id,
    league_ids: league_ids,
    excluded_league_ids,
  } = req.user;
  const sleeperId = req.user.sleeper_id;
  if (!sleeperId) {
    return res.status(400).json({ error: "User not linked to Sleeper" });
  }
  let MAX_LEAGUES;
  if (league_ids.length === 0) {
    MAX_LEAGUES = 10;
  } else {
    MAX_LEAGUES = league_ids.length;
  }
  try {
    // Get the current NFL season from Sleeper API state
    const stateResponse = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await stateResponse.json();
    const currentSeason = state.season;

    if (league_ids && league_ids.length > 0) {
      const leaguePromises = league_ids.map(async (league_id) => {
        const response = await fetch(
          `https://api.sleeper.app/v1/league/${league_id}`
        );
        const leagueData = await response.json();
        if (leagueData) {
          return updateLeague(leagueData);
        }
      });
      await Promise.all(leaguePromises);
    }
    const response = await fetch(
      `https://api.sleeper.app/v1/user/${sleeperId}/leagues/nfl/${currentSeason}`
    );
    const leagues = await response.json();
    const availableSlots = MAX_LEAGUES - (league_ids?.length || 0);
    if (availableSlots <= 0) {
      return res.status(400).json({
        error: `League limit reached.`,
      });
    }
    const leaguesToAdd = leagues
      .filter(
        (league) =>
          !league_ids.includes(league.league_id) &&
          !excluded_league_ids.includes(league.league_id)
      )
      .slice(0, availableSlots);

    await Promise.all(
      leaguesToAdd.map((league) => upsertLeague(google_id, league))
    );
    return res.status(200).json({ message: "League successfully linked" });
  } catch (error) {
    console.error(`Error in POST /users/:googleid/leagues for `, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues/transactions", async (req, res) => {
  try {
    const { sleeper_id: sleeper_id, league_ids: league_ids } = req.user;
    const transactionsPerLeague = await Promise.all(
      league_ids.map(async (league_id) => {
        const league = await getLeague(league_id);
        if (!league) return [];
        const leagueTransactions = await getLeagueTransactions(
          league.league_id
        );
        const userTransactions = leagueTransactions.filter(
          (tx) => tx.creator === sleeper_id
        );
        return userTransactions.map((tx) => ({
          ...tx,
          league_data: league,
        }));
      })
    );
    const transactions = transactionsPerLeague.flat();
    res.json(transactions);
  } catch (error) {
    console.error("Error getting all recent activity: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues/:leagueid/transactions", async (req, res) => {
  try {
    const { sleeper_id: sleeper_id } = req.user;
    const { leagueid } = req.params;
    const league = await getLeague(leagueid);
    let transactions = [];
    let leagueTransactions = await getLeagueTransactions(league.league_id);

    const userTransactions = leagueTransactions.filter(
      (tx) => tx.creator === sleeper_id
    );

    const enrichedTransactions = userTransactions.map((tx) => ({
      ...tx,
      league_data: league,
    }));

    transactions.push(...enrichedTransactions);
    res.json(transactions);
  } catch (error) {
    console.error("Error getting league recent activity: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:googleid/leagues/:leagueid", async (req, res) => {
  try {
    const { leagueid } = req.params;
    const leagueData = await getLeague(leagueid);
    return res.status(200).json({
      league: leagueData,
    });
  } catch (error) {
    console.error("Error in GET /:googleid/leagues/:leagueid", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/:googleid/leagues/:leagueid",
  leagueValidator,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: errors.array()[0]?.msg || "Validation error" });
      }
      const { leagueid } = req.params;
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { google_id, league_ids } = req.user;
      if (league_ids.length >= 20) {
        return res.status(403).json({ error: "20 league cap reached" });
      }
      if (league_ids.includes(leagueid)) {
        return res.status(409).json({ error: "League already exists" });
      }
      const response = await fetch(
        `https://api.sleeper.app/v1/league/${leagueid}`
      );
      const leagueData = await response.json();
      if (!leagueData) {
        return res.status(404).json({ error: "League not found" });
      }
      const responseUsers = await fetch(
        `https://api.sleeper.app/v1/league/${leagueid}/users`
      );
      const leagueUsers = await responseUsers.json();
      const userInLeague = leagueUsers.some(
        (sleeperUser) => req.user.sleeper_id === sleeperUser.user_id
      );
      if (!userInLeague) {
        return res.status(404).json({ error: `You are not in this league!` });
      }
      await upsertLeague(google_id, leagueData);
      return res.status(200).json({ message: "Leagues updated successfully" });
    } catch (error) {
      console.error("Error in POST /:googleid/leagues/:leagueid:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete("/:googleid/leagues/:leagueid", async (req, res) => {
  const { league_ids, google_id, excluded_league_ids } = req.user;
  const { leagueid } = req.params;
  try {
    await deleteLeague(google_id, league_ids, leagueid, excluded_league_ids);
    return res.status(200).json({ message: "League deleted successfully" });
  } catch (error) {
    console.error("Error deleting league:", error);

    if (
      error.message === "League not found for user" ||
      error.message === "League does not exist"
    ) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
