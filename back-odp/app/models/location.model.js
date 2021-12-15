module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define("locations", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return Location;
};
