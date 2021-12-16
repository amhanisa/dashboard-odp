import { createStore } from "vuex";
import auth from "./auth.module";
import user from "./user.module";
import location from "./location.module";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, user, location },
});
