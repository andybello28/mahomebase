const { body } = require("express-validator");

const validateLeague = [
  body("leagueId")
    .trim()
    .isLength({ min: 18, max: 18 })
    .withMessage("Sleeper league IDs must be exactly 18 characters long")
    .isNumeric()
    .withMessage("Sleeper league IDs must contain only numbers")
    .escape(),
];

module.exports = validateLeague;
