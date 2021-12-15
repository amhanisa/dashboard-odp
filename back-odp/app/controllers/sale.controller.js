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
  let sales = await Sale.findAll({
    where: { userId: res.locals.userId },
    order: [["createdAt", "DESC"]],
  });

  console.log(sales);

  res.status(200).send(sales);
};

exports.deleteUserSale = async (req, res) => {
  const sale = await Sale.findOne({ where: { id: req.body.id } });

  try {
    await sale.destroy();
    res.status(200).send("Deleted");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getTotalSales = async (req, res) => {
  let total = await Sale.sum("quantity");

  res.status(200).send({ total: total });
};

exports.getAllSales = async (req, res) => {
  let sales = await Sale.findAndCountAll({
    include: [{ model: User }],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).send(sales);
};

exports.getCummulativeSales = async (req, res) => {
  let cummulative = await db.sequelize.query(
    `
    SELECT *, SUM(grouped.sum) OVER(ORDER BY createdAt) AS cummulative_sum
    FROM (
      SELECT * , sum(quantity) as sum FROM sales group by date(createdAt), ( 4 * HOUR( createdAt ) + FLOOR( MINUTE( createdAt ) / 15 ))
    ) grouped
    `,
    { type: db.sequelize.QueryTypes.SELECT }
  );

  res.status(200).send(cummulative);
};
