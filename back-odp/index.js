require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.use(cors());
// app.options("*", cors());
app.use(express.json());

const db = require("./app/models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("reset database");
});

app.get("/", (req, res) => {
  res.send("PKC ODP");
});

app.post("/api/register", (req, res) => {
  console.log(req.body);
  res.send(req.body.name);
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});