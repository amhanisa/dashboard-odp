require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
// app.options("*", cors());
app.use(express.json());

const db = require("./app/models");
// { force: true }
db.sequelize.sync().then(() => {
  console.log("reset database");
});

app.get("/", (req, res) => {
  res.send("PKC ODP");
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/sale.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
