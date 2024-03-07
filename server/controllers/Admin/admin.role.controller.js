const {
  adminGetALLRoleService,
  adminAddRoleService,
  adminDeleteRoleService,
  adminUpdateRoleService,
} = require("../../services/Admin/admin.role.service");

const adminGetALLRole = async (req, res) => {
  const result = await adminGetALLRoleService();
  res.status(200).send(result);
};

const adminAddRole = async (req, res) => {
  const roleBody = req.body;
  const result = await adminAddRoleService(roleBody);
  res.status(201).send(result);
};

const adminDeleteRole = async (req, res) => {
  const role_id = req.params.id;
  const result = await adminDeleteRoleService(Number(role_id));
  res.status(201).send(result);
};

const adminUpdateRole = async (req, res) => {
  const role_id = req.params.id;
  const roleBody = req.body;
  const result = await adminUpdateRoleService(Number(role_id), roleBody);
  res.status(201).send(result);
};

module.exports = {
  adminGetALLRole,
  adminDeleteRole,
  adminAddRole,
  adminUpdateRole,
};
