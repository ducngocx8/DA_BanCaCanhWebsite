const express = require("express");
const { getAllCart } = require("../../controllers/Admin/admin.cart.controller");
const adminCartRoute = express.Router();
adminCartRoute.get("/", getAllCart);

module.exports = adminCartRoute;