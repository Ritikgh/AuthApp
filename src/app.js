const express = require("express");
const app = express();
require("dotenv").config({ path: __dirname + "/../.env" });
const mongoUtil = require("./db/mongoUtil");
const bodyParser = require("body-parser");

app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.text());
app.use((err, req, res, next) => {
  logger.info("Error", err);
  res.status(500).json({ error: err.message });
});

// Connecting to mongodb exported from db >> mongoUtil.js file
mongoUtil.connectToMongoDB(async (err) => {
  if (err) {
    console.error("MongoDB connection error,", err);
  }
});
// Connecting express server
app.listen(process.env.PORT, () => {
  console.log(`App litsening on port ${process.env.PORT}`);
});

const router = require("./routes/routes");
app.use("/userAuthentication/api/v1", router);
