const db = require("../models");
const { user: User, location: Location } = db;

exports.getAllLocation = async (req, res) => {
  try {
    const location = await Location.findAll();
    res.status(200).send(location);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.addLocation = async (req, res) => {
  try {
    const location = await Location.create({
      name: req.body.name,
    });
    res.status(200).send(location);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ where: { id: req.body.id } });

    location.destroy();
    res.status(200).send({ message: "Location deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.editLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ where: { id: req.body.id } });
    location.name = req.body.name;

    await location.save();

    res.status(200).send(location);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
