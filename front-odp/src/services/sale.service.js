import api from "./api";

class SaleService {
  addSale({ quantity, selectedLocation }) {
    return api.post("sale/add", {
      quantity,
      selectedLocation,
    });
  }

  getUserSales() {
    return api.get("sale");
  }

  deleteUserSale({ id }) {
    return api.post("sale/delete", { id });
  }

  updateSaleValue(sale) {
    return api.post("sale/updateValue", { sale });
  }

  getTotalSales() {
    return api.get("sale/total");
  }

  getAllSales() {
    return api.get("sale/all");
  }

  addSaleFromAdmin(sale) {
    return api.post("sale/addSaleFromAdmin", sale);
  }

  // FOR DASHBOARD

  getAllSalesForDashboard() {
    return api.get("dashboard/allSales");
  }

  getCummulativeSalesForDashboard() {
    return api.get("dashboard/cummulative");
  }

  getSalesRanking() {
    return api.get("dashboard/salesRanking");
  }
}

export default new SaleService();
