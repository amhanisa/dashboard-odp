import api from "./api";

class UserService {
  getAllUsers() {
    return api.get("user/all");
  }
}

export default new UserService();
