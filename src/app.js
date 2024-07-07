const express = require("express");

const app = express();
const api = require("./routes/api");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", api);

app.get("/", (req, res) => {
  res.send("welcome");
});

module.exports = app;
