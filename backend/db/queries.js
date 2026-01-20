const prisma = require("./prisma");
const client = require("../redis/client");

async function findOrCreate(googleId, email, name) {
  try {
    let user = await prisma.user.findUnique({
      where: {
        google_id: googleId,
      },
    });

    if (user) {
      return user;
    }

    user = await prisma.user.create({
      data: {
        google_id: googleId,
        email: email,
        name: name,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in findOrCreate:", error);
    throw error;
  }
}

async function getUserByGoogleId(googleId) {
  try {
    const cacheKey = `user:${googleId}`;
    const cached = await client.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const user = await prisma.user.findUnique({
      where: {
        google_id: googleId,
      },
    });
    if (user) {
      await client.set(cacheKey, JSON.stringify(user), {
        EX: 60 * (5 + Math.floor(Math.random() * 3)),
      });
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by googleId:", error);
    throw error;
  }
}

async function linkSleeperId(googleId, sleeperUsername, sleeperId) {
  try {
    const updatedUser = await prisma.user.update({
      where: { google_id: googleId },
      data: {
        sleeper_username: sleeperUsername,
        sleeper_id: sleeperId,
      },
    });
    await client.del(`user:${googleId}`);
    return updatedUser.sleeper_username;
  } catch (error) {
    console.error("Error linking sleeperId: ", error);
    throw error;
  }
}

async function unlinkSleeperId(googleId) {
  try {
    const updatedUser = await prisma.user.update({
      where: { google_id: googleId },
      data: {
        sleeper_username: null,
        sleeper_id: null,
        excluded_league_ids: {
          set: [],
        },
      },
    });
    await client.del(`user:${googleId}`);
    return updatedUser.sleeper_username;
  } catch (error) {
    console.error("Error unlinking sleeper account:", error);
    throw error;
  }
}

async function upsertLeague(googleId, leagueData) {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { google_id: googleId },
      select: { league_ids: true },
    });

    const currentLeagueIds = currentUser?.league_ids || [];

    // Get current NFL state to check season type
    const round_response = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await round_response.json();
    const seasonType = state.season_type;
    const round = state.week || 1;

    // Fetch roster data from Sleeper
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueData.league_id}/rosters`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch roster data: ${response.status}`);
    }

    let roster_data = await response.json();

    // During offseason (post or off), preserve existing roster data if new data is empty
    if (seasonType === "post" || seasonType === "off") {
      const existingLeague = await prisma.league.findUnique({
        where: { league_id: leagueData.league_id },
        select: { roster_data: true },
      });

      // Check if roster data is empty (no players on any roster)
      const hasPlayers = roster_data.some(
        (roster) => roster.players && roster.players.length > 0
      );

      if (!hasPlayers && existingLeague?.roster_data) {
        // Keep the existing roster data from the previous season
        roster_data = existingLeague.roster_data;
      }
    }

    const tx_response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueData.league_id}/transactions/${round}`
    );
    const leagueTransactions = await tx_response.json();

    if (!currentLeagueIds.includes(leagueData.league_id)) {
      await prisma.user.update({
        where: { google_id: googleId },
        data: {
          league_ids: {
            push: leagueData.league_id,
          },
        },
      });
    }

    const league = await prisma.league.upsert({
      where: { league_id: leagueData.league_id },
      update: {
        name: leagueData.name,
        season: leagueData.season,
        rosters: leagueData.total_rosters,
        roster_positions: leagueData.roster_positions,
        scoring_settings: leagueData.scoring_settings,
        roster_data: roster_data,
        transactions: leagueTransactions,
        total_linked: {
          increment: 1,
        },
      },
      create: {
        league_id: leagueData.league_id,
        name: leagueData.name,
        season: leagueData.season,
        rosters: leagueData.total_rosters,
        roster_positions: leagueData.roster_positions,
        scoring_settings: leagueData.scoring_settings,
        roster_data: roster_data,
        transactions: leagueTransactions,
        total_linked: 1,
      },
    });
    await client.set(`league:${leagueData.league_id}`, JSON.stringify(league), {
      EX: 60 * (5 + Math.floor(Math.random() * 3)),
    });

    return league;
  } catch (error) {
    console.error("Error in upsertLeague:", error);
    throw error;
  }
}

async function updateLeague(leagueData) {
  try {
    // Get current NFL state to check season type
    const round_response = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await round_response.json();
    const seasonType = state.season_type;
    const round = state.week || 1;

    // Fetch roster data from Sleeper
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueData.league_id}/rosters`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch roster data: ${response.status}`);
    }

    let roster_data = await response.json();

    // During offseason (post or off), preserve existing roster data if new data is empty
    if (seasonType === "post" || seasonType === "off") {
      const existingLeague = await prisma.league.findUnique({
        where: { league_id: leagueData.league_id },
        select: { roster_data: true },
      });

      // Check if roster data is empty (no players on any roster)
      const hasPlayers = roster_data.some(
        (roster) => roster.players && roster.players.length > 0
      );

      if (!hasPlayers && existingLeague?.roster_data) {
        // Keep the existing roster data from the previous season
        roster_data = existingLeague.roster_data;
      }
    }

    const tx_response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueData.league_id}/transactions/${round}`
    );
    const leagueTransactions = await tx_response.json();

    await prisma.league.update({
      where: { league_id: leagueData.league_id },
      data: {
        name: leagueData.name,
        season: leagueData.season,
        rosters: leagueData.total_rosters,
        roster_positions: leagueData.roster_positions,
        scoring_settings: leagueData.scoring_settings,
        roster_data: roster_data,
        transactions: leagueTransactions,
      },
    });
  } catch (error) {
    console.error("Error in updateLeague:", error);
    throw error;
  }
}

async function deleteLeague(
  google_id,
  league_ids,
  league_id,
  excluded_league_ids
) {
  try {
    if (!league_ids.includes(league_id)) {
      throw new Error("League not found for user");
    }
    const updated_league_ids = league_ids.filter((id) => id !== league_id);
    if (!excluded_league_ids.includes(league_id)) {
      await prisma.user.update({
        where: { google_id },
        data: {
          league_ids: updated_league_ids,
          excluded_league_ids: {
            push: league_id,
          },
        },
      });
    } else {
      await prisma.user.update({
        where: { google_id },
        data: {
          league_ids: updated_league_ids,
        },
      });
    }
    let league = await prisma.league.findUnique({
      where: { league_id },
    });
    if (!league) {
      throw new Error("League does not exist");
    }
    if (league.total_linked === 1) {
      await prisma.league.delete({
        where: { league_id },
      });
      await client.del(`league:${league_id}`);
    } else {
      const updatedLeague = await prisma.league.update({
        where: { league_id },
        data: {
          total_linked: {
            decrement: 1,
          },
        },
      });
      await client.set(`league:${league_id}`, JSON.stringify(updatedLeague), {
        EX: 60 * (5 + Math.floor(Math.random() * 3)),
      });
    }
  } catch (error) {
    console.error(`Error deleting league ${league_id}:`, error);
    throw error;
  }
}

async function deleteLeagues(googleId, league_ids) {
  try {
    const updatedUser = await prisma.user.update({
      where: { google_id: googleId },
      data: {
        league_ids: [],
      },
    });

    for (const id of league_ids) {
      let league = await prisma.league.findUnique({
        where: { league_id: id },
      });
      if (league.total_linked === 1) {
        await prisma.league.delete({
          where: { league_id: id },
        });
        await client.del(`league:${id}`);
      } else {
        const updatedLeague = await prisma.league.update({
          where: { league_id: id },
          data: {
            total_linked: {
              decrement: 1,
            },
          },
        });
        await client.set(`league:${id}`, JSON.stringify(updatedLeague), {
          EX: 60 * (5 + Math.floor(Math.random() * 3)),
        });
      }
    }
    return updatedUser;
  } catch (error) {
    console.error("Error deleting user leagues:", error);
    throw error;
  }
}

async function getLeague(league_id) {
  try {
    const cacheKey = `league:${league_id}`;

    const cached = await client.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const leagueData = await prisma.league.findUnique({
      where: { league_id },
    });

    if (!leagueData) {
      return null;
    }

    await client.set(cacheKey, JSON.stringify(leagueData), {
      EX: 60 * (5 + Math.floor(Math.random() * 3)),
    });
    return leagueData;
  } catch (error) {
    console.error("Error getting league:", error);
    throw error;
  }
}

async function getPlayer(player_id) {
  const player = await prisma.player.findUnique({
    where: {
      id: player_id,
    },
  });
  return player;
}

async function createPlayers() {
  try {
    const response = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!response.ok) {
      throw new Error(`Failed to fetch players: ${response.status}`);
    }
    const players = await response.json();
    for (const [id, playerData] of Object.entries(players)) {
      await prisma.player.upsert({
        where: { id },
        update: {
          first_name: playerData.first_name,
          last_name: playerData.last_name,
          search_full_name: playerData.search_full_name,
          team: playerData.team,
          position: playerData.position,
          fantasy_positions: playerData.fantasy_positions ?? [],
          age: playerData.age,
          status: playerData.status,
          college: playerData.college,
          years_exp: playerData.years_exp,
        },
        create: {
          id,
          first_name: playerData.first_name,
          last_name: playerData.last_name,
          search_full_name: playerData.search_full_name,
          team: playerData.team,
          position: playerData.position,
          fantasy_positions: playerData.fantasy_positions ?? [],
          age: playerData.age,
          status: playerData.status,
          college: playerData.college,
          years_exp: playerData.years_exp,
        },
      });
    }
    return players;
  } catch (error) {
    console.error("Error getting players:", error);
    throw error;
  }
}

async function updatePlayersESPN() {
  function normalizeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  // Get the current NFL season from Sleeper API
  const stateResponse = await fetch("https://api.sleeper.app/v1/state/nfl");
  const state = await stateResponse.json();
  const currentSeason = state.season;

  let data;
  try {
    const response = await fetch(
      "https://partners.api.espn.com/v2/sports/football/nfl/athletes?limit=7000"
    );
    data = await response.json();
  } catch (error) {
    console.error("Failed to fetch athlete list:", error.message);
  }

  const CHUNK_SIZE = 25;
  const chunks = [];

  for (let i = 0; i < data.athletes.length; i += CHUNK_SIZE) {
    chunks.push(data.athletes.slice(i, i + CHUNK_SIZE));
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (athlete) => {
        try {
          const response2 = await fetch(
            `https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${athlete.id}/overview`
          );
          const playerData = await response2.json();
          const projection =
            playerData.fantasy?.projection ??
            playerData.rotowire?.headline ??
            null;
          let stats = {};
          playerData.statistics?.displayNames?.forEach((label, index) => {
            const split = playerData.statistics.splits?.find(
              (s) => s.displayName === "Regular Season"
            );
            stats[label] = split.stats[index];
          });

          const response3 = await fetch(
            `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/athletes/${athlete.id}?lang=en&region=us`
          );
          const playerData2 = await response3.json();
          let name = playerData2.firstName + " " + playerData2.lastName;
          name = normalizeName(name);
          const headshot = playerData2.headshot.href;
          const playerDb = await prisma.player.findFirst({
            where: { search_full_name: name },
          });
          if (playerDb) {
            await prisma.player.update({
              where: { id: playerDb.id },
              data: {
                headshot,
                projection,
                stats,
              },
            });
          }
        } catch (error) {
          return null;
        }
      })
    );
  }
}

async function getLeagueTransactions(league_id) {
  try {
    const league = await prisma.league.findUnique({
      where: {
        league_id: league_id,
      },
    });
    return league.transactions;
  } catch (error) {
    console.error("Error getting league transactions:", error);
    throw error;
  }
}

module.exports = {
  findOrCreate,
  linkSleeperId,
  unlinkSleeperId,
  upsertLeague,
  updateLeague,
  deleteLeague,
  deleteLeagues,
  getLeague,
  createPlayers,
  updatePlayersESPN,
  getPlayer,
  getUserByGoogleId,
  getLeagueTransactions,
};
