import api from "./api";

class SaleService {
  addSale({ quantity, selectedLocation }) {
    return api
      .post("sale/add", {
        quantity,
        selectedLocation,
      })
      .then((res) => {
        console.log(res);
      });
  }

  getUserSales() {
    return api.get("sale");
  }

  deleteUserSale({ id }) {
    return api
      .post("sale/delete", {
        id,
      })
      .then((res) => {
        console.log(res);
      });
  }

  updateSaleValue(sale) {
    console.log(sale);
    return api.post("sale/updateValue", { sale });
  }

  getTotalSales() {
    return api.get("sale/total");
  }

  getAllSales() {
    return api.get("sale/all");
  }

  // FOR DASHBOARD

  getAllSalesForDashboard() {
    return api.get("dashboard/allSales");
  }

  getCummulativeSalesForDashboard() {
    return api.get("dashboard/cummulative");
  }
}

export default new SaleService();
