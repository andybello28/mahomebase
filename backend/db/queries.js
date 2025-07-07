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

async function linkSleeperId(googleId, sleeperUsername) {
  try {
    const updatedUser = await prisma.user.update({
      where: { google_id: googleId },
      data: {
        sleeper_username: sleeperUsername,
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
      },
    });
    return updatedUser.sleeper_username;
  } catch (error) {
    console.error("Error unlinking sleeper account:", error);
    throw error;
  }
}

module.exports = { findOrCreate, linkSleeperId, unlinkSleeperId };
