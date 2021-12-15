require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");

io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("asd");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

global.socketIo = io;

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
require("./app/routes/location.routes")(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(
    "App listening at http://%s:%s",
    server.address().address,
    server.address().port
  );
});
