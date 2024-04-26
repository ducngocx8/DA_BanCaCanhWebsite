const {
  adminGetAllUserService,
  adminAddUserService,
  adminUpdateUserService,
} = require("../../services/Admin/admin.user.service");

const adminGetAllUser = async (req, res) => {
  const fish_id = req.params.id;
  const result = await adminGetAllUserService(fish_id);
  res.status(200).send(result);
};

const adminAddUser = async (req, res) => {
  let userBody = req.body;
  const result = await adminAddUserService(userBody);
  res.status(201).send(result);
};


const adminUpdateUser = async (req, res) => {
  const user_id = req.params.id;
  const userBody = req.body;
  const result = await adminUpdateUserService(user_id, userBody);
  res.status(201).send(result);
};


module.exports = {
  adminGetAllUser,
  adminAddUser,
  adminUpdateUser,
};
