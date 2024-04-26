const express = require("express");
const {
  adminGetAllSize,
  adminDeleteSize,
  adminAddSize,
  adminUpdateSize,
} = require("../../controllers/Admin/admin.size.controller");
const {
  sizeNameAdminValidation,
  sizeIDAdminValidation,
} = require("../../middlewares/validations/size.validation");

const adminSizeRoute = express.Router();

adminSizeRoute.get("/", adminGetAllSize);
adminSizeRoute.post("/", sizeNameAdminValidation, adminAddSize);
adminSizeRoute.delete(
  "/:id",
  sizeIDAdminValidation,
  adminDeleteSize
);
adminSizeRoute.put(
  "/:id",
  sizeIDAdminValidation,
  sizeNameAdminValidation,
  adminUpdateSize
);

module.exports = adminSizeRoute;
