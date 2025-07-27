const { param } = require("express-validator");

const leagueValidator = [
  param("leagueid")
    .isNumeric()
    .withMessage("Sleeper league ID's must contain strictly digits")
    .trim()
    .escape(),
];

module.exports = leagueValidator;
