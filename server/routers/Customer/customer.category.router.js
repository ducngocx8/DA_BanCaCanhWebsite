const express = require("express");
const {
  getAllCategory,
  getProductByCategoryId,
} = require("../../controllers/Customer/customer.category.controller");
const customerCategoryRoute = express.Router();

customerCategoryRoute.get("/", getAllCategory);
customerCategoryRoute.get("/:id", getProductByCategoryId);

module.exports = customerCategoryRoute;
