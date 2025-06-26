const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const indexRouter = require("./routes/indexRouter");
const signupRouter = require("./routes/signupRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/", indexRouter);

app.use("/signup", signupRouter);

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
