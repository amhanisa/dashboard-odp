const db = require("../models");
const config = require("../config/auth.config");
const { user: User, sale: Sale, location: Location } = db;

exports.addSale = (req, res) => {
  // global.socketIo.emit("news", { hello: "world" });
  console.log(req.body);
  Sale.create({
    userId: res.locals.userId,
    quantity: req.body.quantity,
    locationId: req.body.selectedLocation.id,
  })
    .then((user) => {
      res.send({ message: "Sale created" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.getUserSales = async (req, res) => {
  let sales = await Sale.findAll({
    where: { userId: res.locals.userId },
    include: [{ model: Location }],
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

exports.updateSaleValue = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: { id: req.body.sale.id },
      include: [{ model: Location }],
    });
    sale.editedQuantity = req.body.sale.editedQuantity;

    sale.locationId = req.body.sale.selectedLocation.id;
    sale.userId = req.body.sale.selectedUser.id;

    if (sale.status === false) {
      global.socketIo.emit("sale", sale);
    }

    sale.status = true;
    await sale.save();
    res.status(200).send("Updated");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getTotalSales = async (req, res) => {
  let total = await Sale.sum("editedQuantity");

  res.status(200).send({ total: total });
};

exports.getAllSales = async (req, res) => {
  let sales = await Sale.findAndCountAll({
    include: [{ model: User }, { model: Location }],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).send(sales);
};

//FOR DASHBOARD HEHEHE IF YOU KNOW, YOU KNOW

exports.getAllSalesForDashboard = async (req, res) => {
  try {
    let sales = await Sale.findAndCountAll({
      where: { status: true },
      include: [{ model: User }, { model: Location }],
      order: [["createdAt", "DESC"]],
    });

    let sum = await Sale.sum("editedQuantity", {
      where: { status: true },
    });

    res.status(200).send({ ...sales, sum });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getCummulativeSalesForDashboard = async (req, res) => {
  let cummulative = await db.sequelize.query(
    `
    SELECT *, SUM(grouped.sum) OVER(ORDER BY createdAt) AS cummulative_sum
    FROM (
      SELECT * , sum(editedQuantity) as sum
      FROM sales
      WHERE status=1
      GROUP BY date(createdAt), ( 4 * HOUR( createdAt ) + FLOOR( MINUTE( createdAt ) / 15 ))
    ) grouped
    `,
    { type: db.sequelize.QueryTypes.SELECT }
  );

  res.status(200).send(cummulative);
};
