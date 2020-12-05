const mongoose = require("mongoose");
const express = require("express");
const cookieSession = require("cookie-session");

const accountRouter = require("./routes/account");
const apiRouter = require("./routes/api");

const app = express();
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cis197-final";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("dist"));
app.use(express.json());

app.use(
  cookieSession({
    name: "local-session",
    keys: ["spooky"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).send(`there is an error!: ${err}`);
};

app.use("/api", apiRouter);
app.use("/account", accountRouter);

app.use(errorHandler);

app.get("/favicon.ico", (_, res) => res.status(404).send());
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
