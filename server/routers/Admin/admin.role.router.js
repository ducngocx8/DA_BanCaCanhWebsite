const express = require("express");
const {
  adminGetALLRole,
  adminDeleteRole,
  adminAddRole,
  adminUpdateRole,
} = require("../../controllers/Admin/admin.role.controller");
const {
  userIDAdminValidation,
  addRoleAdminValidation,
  roleIDAdminValidation,
} = require("../../middlewares/validations/role.validation");

const adminRoleRoute = express.Router();

adminRoleRoute.get("/", adminGetALLRole);
adminRoleRoute.post("/", addRoleAdminValidation, adminAddRole);
adminRoleRoute.delete("/:id", roleIDAdminValidation, adminDeleteRole);
adminRoleRoute.put("/:id", roleIDAdminValidation, addRoleAdminValidation, adminUpdateRole);

module.exports = adminRoleRoute;
