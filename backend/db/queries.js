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

async function createLeague(sleeper_username) {
  try {
    // Step 1: Get Sleeper user ID
    const idResponse = await fetch(
      `https://api.sleeper.app/v1/user/${sleeper_username}`
    );
    if (!idResponse.ok) throw new Error("Failed to fetch user ID");

    const sleeper_user = await idResponse.json();
    const sleeper_id = sleeper_user.user_id;

    const updatedLeagues = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 2017; year--) {
      const response = await fetch(
        `https://api.sleeper.app/v1/user/${sleeper_id}/leagues/nfl/${year}`
      );

      if (response.ok) {
        const leagues = await response.json();
        updatedLeagues.push(...leagues);
      } else {
        console.warn(`Failed to fetch leagues for ${year}`);
      }
    }

    const final = await prisma.league.create;
  } catch (error) {
    console.error("Error fetching leagues: ", error);
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

async function createLeague(googleId, leagueData) {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { google_id: googleId },
      select: { league_ids: true },
    });

    const currentLeagueIds = currentUser.league_ids || [];

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

    const existingLeague = await prisma.league.findUnique({
      where: {
        league_id: leagueData.league_id,
      },
    });

    let league;
    if (!existingLeague) {
      league = await prisma.league.create({
        data: {
          league_id: leagueData.league_id,
          name: leagueData.name,
          rosters: leagueData.total_rosters,
          roster_positions: leagueData.roster_positions,
          scoring_settings: leagueData.scoring_settings,
          season: leagueData.season,
          total_linked: 1,
        },
      });
    } else {
      league = await prisma.league.update({
        where: {
          league_id: leagueData.league_id,
        },
        data: {
          total_linked: {
            increment: 1,
          },
        },
      });
    }

    return league;
  } catch (error) {
    console.error("Error updating user leagues:", error);
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

module.exports = {
  findOrCreate,
  linkSleeperId,
  unlinkSleeperId,
  createLeague,
  deleteLeagues,
  getLeague,
};
