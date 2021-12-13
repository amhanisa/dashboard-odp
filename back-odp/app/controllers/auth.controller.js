const db = require("../models");
const config = require("../config/auth.config");
const { user: User, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log(req.body);
  //   res.send(req.body.username);
  User.create({
    fullname: req.body.fullname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 12),
  })
    .then((user) => {
      res.send({ message: "User created" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.signin = (req, res) => {
  console.log(res.body);
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: "Invalid Password" });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      res.status(200).send({
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        role: user.role,
        accessToken: token,
        refreshToken: refreshToken,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).send({ message: "Refresh token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    console.log(refreshToken);

    if (!refreshToken) {
      res.status(403).send({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res
        .status(403)
        .send({
          message:
            "Refresh token was expired. Please make a new signin request",
        });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res
      .status(200)
      .send({ accessToken: newAccessToken, refreshToken: refreshToken.token });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
