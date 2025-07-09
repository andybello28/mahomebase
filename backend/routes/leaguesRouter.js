const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { season } = req.body;
  const { sleeper_username: sleeper_username } = req.user;
  try {
    const idResponse = await fetch(
      `https://api.sleeper.app/v1/user/${sleeper_username}`
    );
    const sleeper_user = await idResponse.json();
    sleeper_id = sleeper_user.user_id;
    console.log(sleeper_id);
    const response = await fetch(
      // This needs to be user ID not sleeper username so we need to do an intermediate fetch
      `https://api.sleeper.app/v1/user/${sleeper_id}/leagues/nfl/${season}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API request failed with status ${response.status}`,
      });
    }

    const leaguesData = await response.json();

    console.log(leaguesData);

    return res.status(200).json({ leagueData: leaguesData });
  } catch (error) {
    console.error("Error in GET /leagues:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
