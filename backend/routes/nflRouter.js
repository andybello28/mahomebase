const express = require("express");
const router = express.Router();

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

module.exports = router;
