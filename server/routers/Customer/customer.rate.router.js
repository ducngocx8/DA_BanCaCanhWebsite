const express = require("express");
const { validationRate } = require("../../middlewares/validations/rate.validation");
const {
  addRateUser,
  getRateByFishID,
  deleteRateByFishID,
} = require("../../controllers/Customer/customer.rate.controller");
const { verifyToken, checkUserToken } = require("../../middlewares/validations/account.validation");
const { customerPermission } = require("../../middlewares/permission");
const customerRateRoute = express.Router();

customerRateRoute.post("/", verifyToken, checkUserToken, customerPermission, validationRate, addRateUser);
customerRateRoute.get("/:id", getRateByFishID);
customerRateRoute.delete("/:id", verifyToken, checkUserToken, customerPermission, deleteRateByFishID);

module.exports = customerRateRoute;
