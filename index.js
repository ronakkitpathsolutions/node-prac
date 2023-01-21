const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv')
const db = require("./src/db/db.js");
const router = require("./src/routes/index");

dotenv.config()

const PORT = process.env.PORT || 4000;
const app = express();

db.then(() => {
  console.log("started");
}).catch((error) => console.log(error));

// default json format middleware
app.use(express.json());
app.use(cors());
app.use("/api", router);

app.get("/api", (req, res) =>
  res.status(200).json({ message: "Server started" })
);

app.listen(PORT, () => {
  console.log("start started");
});
