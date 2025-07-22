const prisma = require("./prisma");

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
    const user = await prisma.user.findUnique({
      where: {
        google_id: googleId,
      },
    });
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
      },
    });
    return updatedUser.sleeper_username;
  } catch (error) {
    console.error("Error unlinking sleeper account:", error);
    throw error;
  }
}

async function upsertLeague(googleId, leagueData) {
  try {
    // Get the user's current league_ids
    const currentUser = await prisma.user.findUnique({
      where: { google_id: googleId },
      select: { league_ids: true },
    });

    const currentLeagueIds = currentUser?.league_ids || [];

    // Always fetch fresh roster data from Sleeper
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueData.league_id}/rosters`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch roster data: ${response.status}`);
    }

    const roster_data = await response.json();

    const round_response = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await round_response.json();
    const round = state.week === 0 ? 1 : state.week;
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

    return league;
  } catch (error) {
    console.error("Error in upsertLeague:", error);
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
      } else {
        await prisma.league.update({
          where: { league_id: id },
          data: {
            total_linked: {
              decrement: 1,
            },
          },
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
    const leagueData = await prisma.league.findUnique({
      where: { league_id: league_id },
    });
    if (!leagueData) {
      return null;
    }
    return leagueData;
  } catch (error) {
    console.error("Error getting league:", error);
    throw error;
  }
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

async function getPlayer(player_id) {
  const player = await prisma.player.findUnique({
    where: {
      id: player_id,
    },
  });
  return player;
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
  deleteLeagues,
  getLeague,
  createPlayers,
  getPlayer,
  getUserByGoogleId,
  getLeagueTransactions,
};
