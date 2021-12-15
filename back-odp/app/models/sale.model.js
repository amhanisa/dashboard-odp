module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sales", {
    quantity: {
      type: Sequelize.DOUBLE,
    },
    editedQuantity: {
      type: Sequelize.DOUBLE,
    },
  });

  return Sale;
};
