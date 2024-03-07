const {
  adminGetRoleUserByUserIDService,
  adminAddRoleUserService,
  adminDeleteRoleUserService,
} = require("../../services/Admin/admin.roleuser.service");

const adminGetRoleUserByUserID = async (req, res) => {
  const user_id = req.params.id;
  const result = await adminGetRoleUserByUserIDService(user_id);
  res.status(200).send(result);
};

const adminAddRoleUser = async (req, res) => {
  const user_id = req.params.id;
  const { role_id } = req.body;
  const result = await adminAddRoleUserService(user_id, role_id);
  res.status(201).send(result);
};

const adminDeleteRoleUser = async (req, res) => {
  const user_id = req.params.id;
  const { role_id } = req.body;
  const result = await adminDeleteRoleUserService(user_id, role_id);
  res.status(201).send(result);
};

module.exports = {
  adminGetRoleUserByUserID,
  adminDeleteRoleUser,
  adminAddRoleUser,
};
