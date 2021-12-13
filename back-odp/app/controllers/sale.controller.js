const db = require("../models");
const config = require("../config/auth.config");
const { user: User, sale: Sale } = db;

exports.addSale = (req, res) => {
  console.log(res.locals.userId);
  console.log(req.body.quantity);

  Sale.create({ userId: res.locals.userId, quantity: req.body.quantity })
    .then((user) => {
      res.send({ message: "User created" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.getUserSales = async (req, res) => {
  let sales = await Sale.findAll({ where: { userId: res.locals.userId } });

  console.log(sales);

  res.status(200).send(sales);
};
