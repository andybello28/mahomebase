const express = require("express");
const cors = require("cors");
const session = require("express-session");
const prisma = require("./db/prisma");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");
require("dotenv").config();
const app = express();

const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const nflRouter = require("./routes/nflRouter");

const startPlayerScheduler = require("./schedulers/playerScheduler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

app.use(
  session({
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hr in ms
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/nfl", nflRouter);

startPlayerScheduler();

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
