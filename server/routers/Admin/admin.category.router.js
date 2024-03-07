const express = require("express");
const {
  adminGetAllCategory,
  adminDeleteCategory,
  adminAddCategory,
  adminUpdateCategory,
} = require("../../controllers/Admin/admin.category.controller");
const {
  categoryNameAdminValidation,
  categoryIDAdminValidation,
} = require("../../middlewares/validations/category.validation");

const adminCategoryRoute = express.Router();

adminCategoryRoute.get("/", adminGetAllCategory);
adminCategoryRoute.post("/", categoryNameAdminValidation, adminAddCategory);
adminCategoryRoute.delete(
  "/:id",
  categoryIDAdminValidation,
  adminDeleteCategory
);
adminCategoryRoute.put(
  "/:id",
  categoryIDAdminValidation,
  categoryNameAdminValidation,
  adminUpdateCategory
);

module.exports = adminCategoryRoute;
