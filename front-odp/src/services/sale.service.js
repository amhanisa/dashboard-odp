import api from "./api";

class SaleService {
  addSale({ quantity }) {
    return api
      .post("sale/add", {
        quantity,
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

  getTotalSales() {
    return api.get("sale/total");
  }

  getAllSales() {
    return api.get("sale/all");
  }

  getCummulativeSales() {
    return api.get("sale/sum");
  }
}

export default new SaleService();
