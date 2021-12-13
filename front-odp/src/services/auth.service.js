import api from "./api";
import TokenService from "./token.service";

class AuthService {
  login(user) {
    return api
      .post("auth/login", {
        username: user.username,
        password: user.password,
      })
      .then((res) => {
        if (res.data.accessToken) {
          TokenService.setUser(res.data);
        }

        return res.data;
      });
  }

  logout() {
    TokenService.removeUser();
  }

  register(user) {
    return api.post("auth/register", {
      fullname: user.fullname,
      username: user.username,
      password: user.password,
    });
  }
}

export default new AuthService();
