const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();
const app = express();

const indexRouter = require("./routes/indexRouter");
const signupRouter = require("./routes/signupRouter");
const authRouter = require("./routes/authRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.use("/signup", signupRouter);
app.use("/auth", authRouter);

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
