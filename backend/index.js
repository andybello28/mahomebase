const express = require("express");
const cors = require("cors");
const session = require("express-session");
const prisma = require("./db/prisma");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");
require("dotenv").config();
const app = express();

const indexRouter = require("./routes/indexRouter");
const signupRouter = require("./routes/signupRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

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
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour in ms
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);

app.use("/signup", signupRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
