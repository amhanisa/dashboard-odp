import api from "./api";

class UserService {
  getAllUsers() {
    return api.get("user/all");
  }

  editUser({ user, selectedLocations }) {
    console.log(user);
    console.log(selectedLocations);
    return api.post("user/edit", {
      user,
      selectedLocations,
    });
  }
}

export default new UserService();
