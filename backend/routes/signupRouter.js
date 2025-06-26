const { Router } = require("express");
const signupRouter = Router();
const { validationResult } = require("express-validator");
const validateSignup = require("../validators/signupValidator");
const { signupGet } = require("../controllers/signupController");

signupRouter.get("/", signupGet);

signupRouter.post("/", validateSignup, (req, res) => {
  const errors = validationResult(req);

  const messages = errors.array().map((err) => err.msg);

  if (!errors.isEmpty()) {
    return res.status(400).json({ failMessage: messages });
  }
  const { Username, Password } = req.body;

  res.status(200).json({ success: true, Username });
});

module.exports = signupRouter;
