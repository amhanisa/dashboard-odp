const db = require("../models");
const { user: User, location: Location } = db;
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.scope("withoutPassword").findAll({
      include: [{ model: Location }],
    });

    res.status(200).send(users);
  } catch (err) {
    (err) => res.status(500).send({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = res.locals.userId;

    const user = await User.scope("withoutPassword").findOne({
      where: { id: userId },
      include: [{ model: Location }],
    });

    return res.status(200).send(user);
  } catch (err) {
    (err) => res.status(500).send({ message: err.message });
  }
};

exports.editUser = async (req, res) => {
  console.log(req.body);
  console.log("IEU YEUH");
  const userValue = req.body.user;
  const locations = req.body.selectedLocations.map((item) => item.id);
  try {
    const user = await User.findOne({ where: { id: userValue.id } });

    user.fullname = userValue.fullname;
    user.username = userValue.username;
    if (userValue.password) {
      user.password = bcrypt.hashSync(userValue.password, 12);
    }

    user.setLocations(locations);

    await user.save();
    res.status(200).send(user);
  } catch (err) {
    (err) => res.status(500).send({ message: err.message });
  }
};
