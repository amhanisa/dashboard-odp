const controller = require("../controllers/location.controller");
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
    "/api/location/all",
    [authJwt.verifyToken],
    controller.getAllLocation
  );
  app.post("/api/location/add", [authJwt.verifyToken], controller.addLocation);
  app.post(
    "/api/location/delete",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteLocation
  );
  app.post(
    "/api/location/edit",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.editLocation
  );
};
