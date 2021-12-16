module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sales", {
    quantity: {
      type: Sequelize.DOUBLE,
    },
    editedQuantity: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Sale;
};
