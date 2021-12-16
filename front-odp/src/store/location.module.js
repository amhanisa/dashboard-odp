import LocationService from "../services/location.service";

const locations = {
  state: {
    locations: [],
  },
  actions: {
    refreshLocations({ commit }) {
      return LocationService.getAllLocations().then(
        (res) => {
          commit("registerLocations", res.data);
          return Promise.resolve(res.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    registerLocations(state, locations) {
      state.locations = locations;
    },
  },
  getters: {
    locations: (state) => {
      return state.locations;
    },
  },
};

export default locations;
