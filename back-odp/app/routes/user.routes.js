const controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );
  app.post(
    "/api/user/edit",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.editUser
  );
  app.get("/api/user", [authJwt.verifyToken], controller.getUser);
};
