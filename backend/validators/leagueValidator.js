const { body } = require("express-validator");

const validateLeague = [
  body("leagueId")
    .trim()
    .isLength({ min: 18, max: 19 })
    .withMessage("Sleeper league IDs must be 18 or 19 digits long")
    .isNumeric()
    .withMessage("Sleeper league IDs must contain only numbers")
    .escape(),
];

module.exports = validateLeague;
