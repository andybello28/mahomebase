const cron = require("node-cron");
const { createPlayers } = require("../db/queries");

function startPlayerScheduler() {
  // Every day at 3 am
  const cronExpression = "0 3 * * *";

  cron.schedule(cronExpression, async () => {
    try {
      console.log("Running daily players update...");
      await createPlayers();
      console.log("Players update complete.");
    } catch (error) {
      console.error("Error during scheduled players update:", error);
    }
  });
}

module.exports = startPlayerScheduler;
