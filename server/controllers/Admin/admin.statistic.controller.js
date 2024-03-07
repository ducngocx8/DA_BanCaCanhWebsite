const {
  adminGetUserAmountService,
  adminGetOrderSuccessAmountService,
  adminGetRevenueOfYearService,
} = require("../../services/Admin/admin.statistic.service");

const adminGetUserAmount = async (req, res) => {
  const result = await adminGetUserAmountService();
  res.status(200).send(result);
};

const adminGetOrderSuccessAmount = async (req, res) => {
  const result = await adminGetOrderSuccessAmountService();
  res.status(200).send(result);
};

const adminGetRevenueOfYear = async (req, res) => {
  const year = req.params.year;
  const result = await adminGetRevenueOfYearService(year);
  res.status(200).send(result);
};

module.exports = {
  adminGetUserAmount,
  adminGetOrderSuccessAmount,
  adminGetRevenueOfYear,
};


