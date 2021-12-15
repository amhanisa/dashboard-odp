const db = require("../models");
const { user: User, location: Location } = db;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Location }] });

    res.status(200).send(users);
  } catch (err) {
    (err) => res.status(500).send({ message: err.message });
  }
};
exports.adminAccess = (req, res) => {
  res.status(200).send("Admin Content");
};
exports.userAccess = (req, res) => {
  res.status(200).send("User Content");
};
