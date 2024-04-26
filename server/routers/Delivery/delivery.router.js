const express = require("express");
const {
  countOrderDelivery,
  getOrderDelivery,
  exchangeOrderAll,
  getOrderDeliveryByDate,
  deliveryOrderSuccess,
} = require("../../controllers/Delivery/delivery.controller");
const {
  orderIDDeliveryValidation,
  noteOrderDeliveryValidation,
} = require("../../middlewares/validations/delivery.validation");
const { checkDateOrder } = require("../../middlewares/validations/order.validation");
const deliveryRouter = express.Router();

deliveryRouter.get("/count/orderDelivery", countOrderDelivery);
deliveryRouter.get("/orderDelivery", getOrderDelivery);
deliveryRouter.post(
  "/exchangeOrderAll/:order_id",
  orderIDDeliveryValidation,
  noteOrderDeliveryValidation,
  exchangeOrderAll
);
deliveryRouter.post("/getByDate", checkDateOrder, getOrderDeliveryByDate);
deliveryRouter.post(
  "/orderSuccess/:order_id",
  orderIDDeliveryValidation,
  deliveryOrderSuccess
);
module.exports = deliveryRouter;
