import { createStore } from "vuex";
import auth from "./auth.module";
import location from "./location.module";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, location },
});
