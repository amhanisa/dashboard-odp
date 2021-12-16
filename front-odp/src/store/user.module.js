import UserService from "../services/user.service";

const users = {
  state: {
    users: [],
    currentUser: null,
  },
  actions: {
    refreshUsers({ commit }) {
      return UserService.getAllUsers().then(
        (res) => {
          commit("registerUsers", res.data);
          return Promise.resolve(res.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    refreshCurrentUserLocations({ commit }) {
      return UserService.getUser().then(
        (res) => {
          console.log(res.data);
          commit("refreshCurrentUserLocations", res.data);
          return Promise.resolve(res.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    registerUsers(state, users) {
      state.users = users;
    },
    refreshCurrentUserLocations(state, user) {
      state.currentUser = user;
    },
  },
  getters: {
    users: (state) => {
      return state.users;
    },
    currentUserLocations: (state) => {
      return state.currentUser.locations;
    },
  },
};

export default users;
