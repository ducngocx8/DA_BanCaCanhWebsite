const express = require("express");
const {
  adminGetRoleUserByUserID,
  adminDeleteRoleUser,
  adminAddRoleUser,
} = require("../../controllers/Admin/admin.roleuser.controller");
const {
  userIDAdminValidation,
  addRoleUserAdminValidation,
} = require("../../middlewares/validations/roleuser.validation");

const adminRoleUserRoute = express.Router();

adminRoleUserRoute.get("/:id", userIDAdminValidation, adminGetRoleUserByUserID);
adminRoleUserRoute.post("/:id", addRoleUserAdminValidation, adminAddRoleUser);
adminRoleUserRoute.delete(
  "/:id",
  addRoleUserAdminValidation,
  adminDeleteRoleUser
);

module.exports = adminRoleUserRoute;
