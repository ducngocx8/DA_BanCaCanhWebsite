const userIDAdminValidation = (req, res, next) => {
  const user_id = req.params.id;
  if (!Number.isInteger(Number(user_id))) {
    res.status(201).send({
      status: false,
      message: "User_ID phải là số nguyên",
    });
  } else {
    next();
  }
};

const roleIDAdminValidation = (req, res, next) => {
  let { role_id } = req.body;
  if (!role_id) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin role_id",
    });
  } else {
    if (!Number.isInteger(Number(role_id))) {
      res.status(201).send({
        status: false,
        message: "Role_ID phải là số nguyên",
      });
    } else {
      next();
    }
  }
};

const addRoleUserAdminValidation = (req, res, next) => {
  let { role_id } = req.body;
  const user_id = req.params.id;
  if (!Number.isInteger(Number(user_id))) {
    res.status(201).send({
      status: false,
      message: "User_ID phải là số nguyên",
    });
  } else if (!role_id) {
    res.status(201).send({
      status: false,
      message: "Thiếu thông tin role_id (Mã quyền hạn)",
    });
  } else {
    if (!Number.isInteger(Number(role_id))) {
      res.status(201).send({
        status: false,
        message: "Role_ID phải là số nguyên",
      });
    } else {
      next();
    }
  }
};

module.exports = {
  userIDAdminValidation,
  roleIDAdminValidation,
  addRoleUserAdminValidation,
};
