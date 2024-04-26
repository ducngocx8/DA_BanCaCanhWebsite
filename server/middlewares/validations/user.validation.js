const { regexUsername, regexEmail, regexPhone } = require("../../Utils");

const userIDAdminValidation = (req, res, next) => {
  const user_id = req.params.id;
  if (!Number.isInteger(Number(user_id))) {
    res.status(201).send({
      status: false,
      message: "User_id phải là số nguyên",
    });
  } else {
    next();
  }
};

const addUserAdminValidation = (req, res, next) => {
  let { username, password, email, phonenumber, user_status, User_Roles } =
    req.body;
  console.log(username, password, email, phonenumber, user_status, User_Roles);
  if (!username || !password || !email || !user_status || !User_Roles) {
    res.status(201).send({
      status: false,
      message:
        "Thiếu 1 trong các thông tin username, password, email, status, quyền hạn",
    });
  } else {
    if (!regexUsername.test(username) || username.trim().length > 20) {
      res.status(201).send({
        status: false,
        message: "Username không hợp lệ",
      });
    } else if (!regexEmail.test(email) || email.trim().length > 50) {
      res.status(201).send({
        status: false,
        message: "Email không hợp lệ",
      });
    } else if (!Array.isArray(User_Roles)) {
      res.status(201).send({
        status: false,
        message: "Thông tin quyền hạn không hợp lệ []",
      });
    } else if (User_Roles.length < 1) {
      res.status(201).send({
        status: false,
        message: "User mới cần có ít nhất 1 quyền (Role)",
      });
    } else if (
      !Number.isInteger(Number(user_status)) ||
      Number(user_status) > 3 ||
      Number(user_status) < 1
    ) {
      console.log("ABCCC");
      res.status(201).send({
        status: false,
        message: "Trạng thái người dùng là số nguyên từ 1 đến 3",
      });
    } else if (password.trim().length < 3 || password.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Mật khẩu cần từ 3 ký tự trở lên",
      });
    } else if (phonenumber) {
      if (!regexPhone.test(phonenumber)) {
        res.status(201).send({
          status: false,
          message: "Số điện thoại không hợp lệ",
        });
      }
    }
    next();
  }
};

const updateUserAdminValidation = (req, res, next) => {
  let { username, password, email, phonenumber, user_status } = req.body;
  if (
    !username ||
    !password ||
    !email ||
    (!user_status && user_status.length === 0)
  ) {
    res.status(201).send({
      status: false,
      message: "Thiếu 1 trong các thông tin username, password, email, status",
    });
  } else {
    if (!regexUsername.test(username) || username.trim().length > 20) {
      res.status(201).send({
        status: false,
        message: "Username không hợp lệ",
      });
    } else if (!regexEmail.test(email) || email.trim().length > 50) {
      res.status(201).send({
        status: false,
        message: "Email không hợp lệ",
      });
    } else if (
      !Number.isInteger(Number(user_status)) ||
      Number(user_status) > 3 ||
      Number(user_status) < 1
    ) {
      res.status(201).send({
        status: false,
        message: "Trạng thái người dùng là số nguyên từ 1 đến 3",
      });
    } else if (password.trim().length < 3 || password.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Mật khẩu cần từ 3 ký tự trở lên",
      });
    } else if (phonenumber) {
      if (!regexPhone.test(phonenumber)) {
        res.status(201).send({
          status: false,
          message: "Số điện thoại không hợp lệ",
        });
      }
    }
    next();
  }
};

module.exports = {
  userIDAdminValidation,
  addUserAdminValidation,
  updateUserAdminValidation,
};
