const express = require("express");
const router = express.Router();
const { getPlayer } = require("../db/queries");

router.get("/season", async (req, res) => {
  try {
    const response = await fetch("https://api.sleeper.app/v1/state/nfl");
    roundData = await response.json();
    res.json({ week: roundData.week, season: roundData.season });
  } catch (error) {
    console.error("Error getting round: ", error);
    throw error;
  }
});

router.get("/players/trending", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.sleeper.app/v1/players/nfl/trending/add?lookback_hours=24&limit=50"
    );
    const trendingPlayers = await response.json();
    let output = [];
    for (const player of trendingPlayers) {
      output.push(await getPlayer(player));
    }
    res.json(output);
  } catch (error) {
    console.error("Error getting trending players from sleeper: ", error);
    throw error;
  }
});

module.exports = router;
