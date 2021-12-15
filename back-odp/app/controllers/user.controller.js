const db = require("../models");
const { user: User, location: Location } = db;

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

exports.editUser = async (req, res) => {
  console.log(req.body);
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

exports.adminAccess = (req, res) => {
  res.status(200).send("Admin Content");
};
exports.userAccess = (req, res) => {
  res.status(200).send("User Content");
};
