const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.send("yo");
});

module.exports = indexRouter;
