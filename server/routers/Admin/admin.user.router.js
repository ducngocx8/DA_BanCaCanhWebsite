const express = require("express");
const {
  adminGetAllUser,
  adminAddUser,
  adminUpdateUser,
} = require("../../controllers/Admin/admin.user.controller");
const {
  addUserAdminValidation,
  userIDAdminValidation,
  updateUserAdminValidation,
} = require("../../middlewares/validations/user.validation");

const adminUserRoute = express.Router();

adminUserRoute.get("/", adminGetAllUser);
adminUserRoute.post("/", addUserAdminValidation, adminAddUser);
adminUserRoute.put("/:id", userIDAdminValidation, updateUserAdminValidation, adminUpdateUser);

module.exports = adminUserRoute;
