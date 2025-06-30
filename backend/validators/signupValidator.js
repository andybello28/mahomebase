const { body } = require("express-validator");

const validateSignup = [
  body("Username")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Username must be between 1 and 10 characters")
    .escape(),
  body("Password")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Password must be between 1 and 10 characters")
    .escape(),
];

module.exports = validateSignup;
