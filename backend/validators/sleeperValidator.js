const { body } = require("express-validator");

const validateSleeper = [body("sleeper_username").trim().escape()];

module.exports = validateSleeper;
