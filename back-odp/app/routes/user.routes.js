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

  app.get("/api/all", controller.allAccess);

  app.get("/api/user", [authJwt.verifyToken], controller.userAccess);

  app.get(
    "/api/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminAccess
  );
};
