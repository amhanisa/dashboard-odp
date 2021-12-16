const controller = require("../controllers/sale.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/sale", [authJwt.verifyToken], controller.getUserSales);
  app.post("/api/sale/add", [authJwt.verifyToken], controller.addSale);
  app.post(
    "/api/sale/delete",
    [authJwt.verifyToken],
    controller.deleteUserSale
  );
  app.post(
    "/api/sale/updateValue",
    [authJwt.verifyToken],
    controller.updateSaleValue
  );

  app.get(
    "/api/sale/total",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getTotalSales
  );
  app.get(
    "/api/sale/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllSales
  );

  //FOR DASHBOARD
  app.get(
    "/api/dashboard/cummulative",
    controller.getCummulativeSalesForDashboard
  );
  app.get("/api/dashboard/allSales", controller.getAllSalesForDashboard);
};
