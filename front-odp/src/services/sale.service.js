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
}

export default new SaleService();
