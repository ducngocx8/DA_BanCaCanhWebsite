const express = require("express");
const {
  deleteRateAdmin,
  getAllRateAdmin,
} = require("../../controllers/Admin/admin.rate.controller");
const { admin_employee_Permission } = require("../../middlewares/permission");
const { verifyToken } = require("../../middlewares/validations/account.validation");
const { rateAdminDeleteValidation } = require("../../middlewares/validations/rate.validation");
const adminRateRoute = express.Router();

// adminRateRoute.delete("/", verifyToken, admin_employee_Permission, rateAdminDeleteValidation, deleteRateAdmin);
adminRateRoute.delete("/:id", rateAdminDeleteValidation, deleteRateAdmin);
adminRateRoute.get("/", getAllRateAdmin);

module.exports = adminRateRoute;
