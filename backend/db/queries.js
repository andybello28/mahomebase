const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function findOrCreate(googleId) {
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
      },
    });

    return user;
  } catch (error) {
    console.error("Error in findOrCreate:", error);
    throw error;
  }
}

module.exports = { findOrCreate };
