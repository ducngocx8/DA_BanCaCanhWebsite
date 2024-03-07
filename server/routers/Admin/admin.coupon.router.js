const express = require("express");
const {
  adminGetAllCoupon,
  adminDeleteCoupon,
  adminAddCoupon,
  adminUpdateCoupon,
} = require("../../controllers/Admin/admin.coupon.controller");
const {
  addCouponAdminValidation,
  couponIDAdminValidation,
} = require("../../middlewares/validations/coupon.validation");

const adminCouponRoute = express.Router();

adminCouponRoute.get("/", adminGetAllCoupon);
adminCouponRoute.post("/", addCouponAdminValidation, adminAddCoupon);
adminCouponRoute.delete("/:id", couponIDAdminValidation, adminDeleteCoupon);
adminCouponRoute.put(
  "/:id",
  couponIDAdminValidation,
  addCouponAdminValidation,
  adminUpdateCoupon
);

module.exports = adminCouponRoute;
