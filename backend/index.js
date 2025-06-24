const express = require("express");
const passport = require("passport");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.json({
    name: "Andy",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
