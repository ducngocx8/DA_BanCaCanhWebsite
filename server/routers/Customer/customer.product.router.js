const express = require("express");
const {
  getAllProduct,
  getProductDetail,
  getProductSearch,
  getTopBuyProduct,
  getProductsByCategory,
  getRandomProduct,
} = require("../../controllers/Customer/customer.product.controller");
const customerProductRoute = express.Router();

customerProductRoute.get("/", getAllProduct);
customerProductRoute.get("/:id", getProductDetail);
customerProductRoute.post("/top/search", getProductSearch);
customerProductRoute.get("/topbuy/fish", getTopBuyProduct);
customerProductRoute.get("/random/fish", getRandomProduct);
customerProductRoute.get("/search/productCategory/:id", getProductsByCategory);

module.exports = customerProductRoute;