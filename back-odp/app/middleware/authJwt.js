const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.status(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    res.locals.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  console.log(res.locals.userId);
  User.findByPk(res.locals.userId).then((user) => {
    if (user.role === "ROLE_ADMIN") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
