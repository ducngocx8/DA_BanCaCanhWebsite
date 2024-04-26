const express = require("express");
const {
  getAllOTP,
  deleteAllOTP,
} = require("../../controllers/Admin/admin.otp.controller");
const adminOTPRoute = express.Router();

adminOTPRoute.get("/", getAllOTP);
adminOTPRoute.delete("/", deleteAllOTP);

module.exports = adminOTPRoute;
