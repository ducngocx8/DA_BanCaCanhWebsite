const express = require("express");
const {
  adminGetAllOrder,
  adminUpdateOrder,
  adminGetOrderByDate,
  adminGetOrderByStatus,
} = require("../../controllers/Admin/admin.order.controller");
const {
  adminCheckOrderDetail, checkDateOrder, adminCheckOrderStatus,
} = require("../../middlewares/validations/order.validation");

const adminOrderRoute = express.Router();

adminOrderRoute.get("/", adminGetAllOrder);
adminOrderRoute.get(
  "/status/:order_status",
  adminCheckOrderStatus,
  adminGetOrderByStatus
);
adminOrderRoute.put("/:id", adminCheckOrderDetail, adminUpdateOrder);
adminOrderRoute.post("/getByDate", checkDateOrder, adminGetOrderByDate);

module.exports = adminOrderRoute;
