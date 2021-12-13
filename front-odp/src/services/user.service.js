import api from "./api";

class UserService {
  getPublicContent() {
    return api.get("all");
  }

  getUserBoard() {
    return api.get("user");
  }

  getAdminBoard() {
    return api.get("admin");
  }
}

export default new UserService();
