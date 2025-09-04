const cron = require("node-cron");
const { createPlayers, updatePlayersESPN } = require("../db/queries");

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

function startWeeklyPlayerUpdate() {
  // Every day at 4 am
  const cronExpression = "0 4 * * *";

  cron.schedule(cronExpression, async () => {
    try {
      console.log("Running weekly players detailed update...");
      await updatePlayersESPN();
      console.log("Weekly detailed update complete.");
    } catch (error) {
      console.error("Error during scheduled weekly update:", error);
    }
  });
}

module.exports = { startPlayerScheduler, startWeeklyPlayerUpdate };
