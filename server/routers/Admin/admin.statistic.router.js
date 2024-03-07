const express = require("express");
const {
  adminGetUserAmount,
  adminGetOrderSuccessAmount,
  adminGetRevenueOfYear,
} = require("../../controllers/Admin/admin.statistic.controller");
const { yearValidation } = require("../../middlewares/validations/statistic.validation");

const adminStatisticRoute = express.Router();

adminStatisticRoute.get("/userAmount", adminGetUserAmount);
adminStatisticRoute.get("/orderSucessAmount", adminGetOrderSuccessAmount);
adminStatisticRoute.get("/getRevenueOfYear/:year", yearValidation, adminGetRevenueOfYear);

module.exports = adminStatisticRoute;
