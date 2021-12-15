const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model")(sequelize, Sequelize);
db.location = require("../models/location.model")(sequelize, Sequelize);
db.sale = require("../models/sale.model")(sequelize, Sequelize);

db.refreshToken.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});

db.user.hasOne(db.refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

db.user.belongsToMany(db.location, {
  through: "User_Location",
  foreignKey: "userId",
});

db.location.belongsToMany(db.user, {
  through: "User_Location",
  foreignKey: "locationId",
});

db.sale.belongsTo(db.location, {
  foreignKey: "locationId",
  targetKey: "id",
});

db.location.hasMany(db.sale, {
  foreignKey: "locationId",
  targetKey: "id",
});

db.user.hasMany(db.sale, {
  foreignKey: "userId",
  targetKey: "id",
});

db.sale.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});

db.ROLES = ["ROLE_USER", "ROLE_ADMIN"];

module.exports = db;
