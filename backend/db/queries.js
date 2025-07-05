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
        leagues: leagues,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in findOrCreate:", error);
    throw error;
  }
}

async function createLeague(googleId, currentLeagues, leagueId) {
  try {
    if (currentLeagues.includes(leagueId)) {
      return null;
    }

    const updatedUser = await prisma.user.update({
      where: { google_id: googleId },
      data: {
        leagues: {
          push: leagueId,
        },
      },
    });

    return updatedUser.leagues;
  } catch (error) {
    console.error("Error adding league to list: ", error);
    throw error;
  }
}

module.exports = { findOrCreate, createLeague };
