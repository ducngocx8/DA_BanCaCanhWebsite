const express = require("express");
const {
  getOrderByUser,
  orderUserUpdate,
  getOrderBetweenDate,
  getOrderUserStatistics,
} = require("../../controllers/Customer/customer.order.controller");
const {
  checkOrderStatusUser,
  checkDateOrder,
} = require("../../middlewares/validations/order.validation");
const customerOrderRoute = express.Router();

customerOrderRoute.get("/user", getOrderByUser);
customerOrderRoute.post("/user", checkOrderStatusUser, orderUserUpdate);
customerOrderRoute.post("/userOrderDate", checkDateOrder, getOrderBetweenDate);
customerOrderRoute.get("/userOrderStatistics", getOrderUserStatistics);

module.exports = customerOrderRoute;
