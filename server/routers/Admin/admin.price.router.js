const express = require("express");
const {
  adminGetPriceByProductID,
  adminDeletePrice,
  adminAddPrice,
  adminUpdatePrice,
} = require("../../controllers/Admin/admin.price.controller");
const {
  fishIDAdminValidation,
  addSizeAdminValidation,
  sizeIDAdminValidation,
} = require("../../middlewares/validations/price.validation");

const adminPriceRoute = express.Router();

adminPriceRoute.get("/:id", fishIDAdminValidation, adminGetPriceByProductID);
adminPriceRoute.post("/:id", addSizeAdminValidation, adminAddPrice);
adminPriceRoute.delete(
  "/:id",
  fishIDAdminValidation,
  sizeIDAdminValidation,
  adminDeletePrice
);
adminPriceRoute.put("/:id", addSizeAdminValidation, adminUpdatePrice);

module.exports = adminPriceRoute;
