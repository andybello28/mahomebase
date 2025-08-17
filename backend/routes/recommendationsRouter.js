const express = require("express");
const { OpenAI } = require("openai");
const { getLeague } = require("../db/queries");
require("dotenv").config();

const { getPlayer } = require("../db/queries");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//Owner_id is the owner id of the team being traded with
router.get("/trade/:leagueid/:owner_id", async (req, res) => {
  const { leagueid, owner_id } = req.params;
  const leagueData = await getLeague(leagueid);
  const user = req.user;

  const roster_positions = leagueData.roster_positions;
  const ppr = leagueData.scoring_settings.rec;

  let userRoster = leagueData.roster_data.find(
    (roster) => roster.owner_id === user.sleeper_id
  );

  if (!userRoster) {
    userRoster = [];
  }

  userRoster.players = await Promise.all(
    userRoster.players.map(async (player) => {
      let ret = await getPlayer(player);
      if (userRoster.starters.includes(player)) {
        ret.starter = true;
      } else {
        ret.starter = false;
      }
      return ret;
    })
  );

  userRoster = userRoster.players.map((player) => {
    return {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      position: player.position,
      stats: player.stats,
      projection: player.projection,
      starter: player.starter,
    };
  });

  let otherRoster = leagueData.roster_data.find(
    (roster) => roster.owner_id === owner_id
  );

  if (!otherRoster) {
    otherRoster = [];
  }

  otherRoster.players = await Promise.all(
    otherRoster.players.map(async (player) => {
      let ret = await getPlayer(player);
      if (otherRoster.starters.includes(player)) {
        ret.starter = true;
      } else {
        ret.starter = false;
      }
      return ret;
    })
  );

  otherRoster = otherRoster.players.map((player) => {
    return {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      position: player.position,
      stats: player.stats,
      projection: player.projection,
      starter: player.starter,
    };
  });

  const response = await openai.responses.create({
    model: "o4-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: 'You are a fantasy football expert tasked with analyzing the users team, league context, and proposing fair, realistic trades within roster settings. You are given: user_roster, other_roster, other_name, roster_positions, points_per_rec, league_rosters. Each player object has starter (true if starting) and projection/stats information. Core Rules: 1. Fairness is the highest priority: always evaluate whether BOTH teams starting lineups improve or at least maintain equal strength. 2. Never trade away a player who is significantly more valuable than the players received unless the overall starting lineup for that team still improves. 3. Starters should be prioritized in trades, but only if they clearly improve the lineup compared to current starters at the same position. Avoid proposing trades for players whose \\starter\\ property is marked false. 4. Focus on high-end RBs and WRs first, prioritizing RB1s and WR1s, then RB2s and WR2s, before considering QBs or TEs. Tight ends and QBs can be included if the trade makes clear starter upgrades. 5. The best example of a balanced trade is an RB1 and WR2 for an RB2 and WR1, where each team upgrades one starter without creating a hole. 6. Only include players with both starter and projection/stats data. Never trade kickers or defenses. 7. Avoid 1-for-1 trades of the same position unless value is extremely close. Prefer balanced swaps where both teams gain in different areas without creating new weaknesses. 8. Compare potential gains directly to current starters at the same position for both teams. If the gained player is not better than the current starter for that position, avoid the trade. 9. Always propose a trade unless absolutely no fair option exists. If no ideal trade is found, fallback options may include: WR1 for RB1, WR2 for RB2, or low-end TE for low-end QB, but still ensure both teams starters are improved or maintained. 10. A trade where you upgrade over every single player you trade away is not likely to be fair. If you get a strong WR like a WR1, you should be giving away a top tight end, rb, or qb. 11. Keep the explanation 2-3 sentences and based strictly on the data provided. Talk enthusiatically like a fantasy football analyst (ESPN/First Take) without personal language like "I believe." Your explanation should say why both teams improve. Output JSON: {"players_received":[{"id":""}],"players_traded":[{"id":""}],"explanation":""}',
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `User Roster: ${JSON.stringify(userRoster)}`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Positions: ${JSON.stringify(roster_positions)}`,
          },
        ],
      },
      {
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: `PPR: ${JSON.stringify(ppr)}`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `other_roster: ${JSON.stringify(otherRoster)}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_object",
      },
    },
    reasoning: {
      effort: "medium",
    },
    tools: [],
    store: true,
  });
  res.json({
    output: JSON.parse(response.output_text.trim()),
  });
});

router.get("/lineup/:leagueid", async (req, res) => {
  const { leagueid } = req.params;
  const leagueData = await getLeague(leagueid);
  const user = req.user;

  const roster_positions = leagueData.roster_positions;
  const ppr = leagueData.scoring_settings.rec;

  let userRoster = leagueData.roster_data.find(
    (roster) => roster.owner_id === user.sleeper_id
  );

  if (!userRoster) {
    userRoster = [];
  }

  userRoster.players = await Promise.all(
    userRoster.players.map(async (player) => {
      let ret = await getPlayer(player);
      if (userRoster.starters.includes(player)) {
        ret.starter = true;
      } else {
        ret.starter = false;
      }
      return ret;
    })
  );

  userRoster = userRoster.players.map((player) => {
    return {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      position: player.position,
      stats: player.stats,
      projection: player.projection,
      starter: player.starter,
    };
  });

  const response = await openai.responses.create({
    model: "o4-mini",
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: 'You are a fantasy football expert tasked with analyzing the user\'s team, roster context, matchups, and projections to propose fair, data-driven lineup decisions. You are given: user_roster, roster_positions, points_per_rec, league_rosters. Each player object has \'starter\' (true if currently starting) and projection/stats information. Core Rules: 1. Recommend changes only as swaps between a current starter and a benched player who is projected to clearly outperform them. 2. Represent each change as an array [id_starter, id_bench], where id_starter is the current starter being benched and id_bench is the previously benched player who should start instead. No player should be recommended as a bench if they are already benched and no current starters should be recommended to replace a current starter. The only way this should be possible is if there is a situation where we need to move around runningbacks and wrs to put the best available player in at the flex. If so, specify this is whats happening. 3. Prioritize high-end RBs and WRs first (RB1/WR1, then RB2/WR2) before considering QBs or TEs; include QBs and TEs only if they clearly upgrade the lineup. 4. Avoid unnecessary swaps; only recommend changes when the expected gain is meaningful. 5. Only include players with both starter and projection/stats data; never start kickers or defenses unless explicitly required. 6. Compare potential gains directly to current starters at the same position. 7. If the lineup is already optimal, return a message clearly explaining that no changes are needed and why. 8. Keep the explanation 2-3 sentences and based strictly on the data provided. Talk enthusiastically like a fantasy football analyst (ESPN/First Take) without personal language like \'I \' The first element of a swap array is a new starter and the second is a recommended bench player. Output JSON: {\\"swaps\\":[[\\"id1\\",\\"id2\\"],[\\"id3\\",\\"id4\\"]],\\"explanation\\":\\"\\"} and each swap in swaps must contain one player whose starter property is false and one player whose starter property is true.',
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `User Roster: ${JSON.stringify(userRoster)}`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Positions: ${JSON.stringify(roster_positions)}`,
          },
        ],
      },
      {
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: `PPR: ${JSON.stringify(ppr)}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_object",
      },
    },
    reasoning: {
      effort: "medium",
    },
    tools: [],
    store: true,
  });

  res.json({
    output: JSON.parse(response.output_text.trim()),
  });
});

module.exports = router;
