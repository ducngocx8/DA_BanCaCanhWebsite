const { regexUsername, regexEmail } = require("../../Utils");

const checkUserNameAndEmail = (req, res, next) => {
  let { username, email } = req.body;
  if (!username) {
    res.status(201).send({
      status: false,
      message: "Thiếu trường Username",
    });
  } else if (!email) {
    res.status(201).send({
      status: false,
      message: "Thiếu trường Email",
    });
  } else if (!regexUsername.test(username.trim())) {
    res.status(201).send({
      status: false,
      message: "Username không hợp lệ",
    });
  } else if (!regexEmail.test(email.trim())) {
    res.status(201).send({
      status: false,
      message: "Email không hợp lệ",
    });
  } else {
    next();
  }
};

const checkEmailValid = (req, res, next) => {
  let { email } = req.body;
  if (!email) {
    res.status(201).send({
      status: false,
      message: "Thiếu trường Email",
    });
  } else if (!regexEmail.test(email.trim())) {
    res.status(201).send({
      status: false,
      message: "Email không hợp lệ",
    });
  } else {
    next();
  }
};

module.exports = {
  checkUserNameAndEmail,
  checkEmailValid,
};
