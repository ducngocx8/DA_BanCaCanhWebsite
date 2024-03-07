const express = require("express");
const {
  addToCart,
  removeFromCart,
  updateCart,
  getCartByUser,
  addOrder,
  checkCoupon,
} = require("../../controllers/Customer/customer.cart.controller");
const {
  checkEmptyhasAmount,
  checkEmptyNoAmount,
  checkINTCarthasAmount,
  checkINTCartNoAmount,
} = require("../../middlewares/validations/cart.validation");
const {
  checkBodyOrderDetail,
} = require("../../middlewares/validations/order.validation");
const {
  verifyToken,
} = require("../../middlewares/validations/account.validation");

const customerCartRoute = express.Router();
customerCartRoute.post(
  "/addToCart",
  checkEmptyhasAmount,
  checkINTCarthasAmount,
  addToCart
);
customerCartRoute.delete(
  "/removeFromCart",
  checkEmptyNoAmount,
  checkINTCartNoAmount,
  removeFromCart
);
customerCartRoute.post(
  "/updateCart",
  verifyToken,
  checkEmptyhasAmount,
  checkINTCarthasAmount,
  updateCart
);
customerCartRoute.get("/user", getCartByUser);
customerCartRoute.post("/addOrder", checkBodyOrderDetail, addOrder);
customerCartRoute.post("/checkCoupon", checkCoupon);

module.exports = customerCartRoute;
