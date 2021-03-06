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
    [authJwt.verifyToken, authJwt.isAdmin],
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

  app.post(
    "/api/sale/addSaleFromAdmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addSaleFromAdmin
  );

  //FOR DASHBOARD
  app.get(
    "/api/dashboard/cummulative",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getCummulativeSalesForDashboard
  );
  app.get(
    "/api/dashboard/allSales",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllSalesForDashboard
  );
  app.get(
    "/api/dashboard/salesRanking",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSalesRanking
  );
};
