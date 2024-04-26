const express = require("express");
const {
  adminGetAllProduct,
  adminDeleteProduct,
  adminAddProduct,
  adminUpdateProduct,
} = require("../../controllers/Admin/admin.product.controller");
const {
  categoryIDAdminValidation,
} = require("../../middlewares/validations/category.validation");
const { checkValueAddProductEmpty, checkValueAddProductValid, checkValueUpdateProductEmpty, checkValueUpdateProductValid } = require("../../middlewares/validations/fish.validation");

const adminProductRoute = express.Router();

adminProductRoute.get("/", adminGetAllProduct);
adminProductRoute.post("/", checkValueAddProductEmpty, checkValueAddProductValid, adminAddProduct);
adminProductRoute.delete(
  "/:id",
  categoryIDAdminValidation,
  adminDeleteProduct
);
adminProductRoute.put(
  "/:id",
  checkValueUpdateProductEmpty,
  checkValueUpdateProductValid,
  adminUpdateProduct
);

module.exports = adminProductRoute;
