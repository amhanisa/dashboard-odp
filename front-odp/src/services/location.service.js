import api from "./api";

class LocationService {
  getAllLocations() {
    return api.get("location/all");
  }

  addLocation({ name }) {
    return api.post("location/add", { name });
  }

  deleteLocation({ id }) {
    return api.post("location/delete", { id });
  }

  editLocation({ id, name }) {
    return api.post("location/edit", { id: id, name: name });
  }
}

export default new LocationService();
