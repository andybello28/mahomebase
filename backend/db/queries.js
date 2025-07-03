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

module.exports = { findOrCreate };
