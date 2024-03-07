const { regexRoleCode } = require("../../Utils");

const roleIDAdminValidation = (req, res, next) => {
  const role_id = req.params.id;
  if (!Number.isInteger(Number(role_id))) {
    res.status(201).send({
      status: false,
      message: "Role_ID phải là số nguyên",
    });
  } else {
    next();
  }
};

const addRoleAdminValidation = (req, res, next) => {
  let { role_code, role_name } = req.body;
  if (!role_code) {
    res.status(201).send({
      status: false,
      message: "Thiếu thông tin role_code. Ví dụ ROLE_ADMIN",
    });
  } else if (!role_name) {
    res.status(201).send({
      status: false,
      message: "Thiếu thông tin role_name (Mô tả quyền hạn)",
    });
  } else if (
    role_code.trim().length < 2 ||
    !regexRoleCode.test(role_code) ||
    role_code.trim().length > 30
  ) {
    res.status(201).send({
      status: false,
      message: "Mã quyền hạn cần ít nhất 2 ký tự và viết liền, không dấu",
    });
  } else if (role_name.trim().length < 2 || role_name.trim().length > 50) {
    res.status(201).send({
      status: false,
      message: "Mô tả quyền hạn cần có ít nhất 2 ký tự trở lên",
    });
  } else {
    next();
  }
};

module.exports = {
  roleIDAdminValidation,
  addRoleAdminValidation,
};
