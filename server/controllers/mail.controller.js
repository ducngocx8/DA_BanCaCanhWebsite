const { regexEmail } = require("../Utils");
const {
  sendOTPPasswordService,
  sendOTPVerifyEmailService,
} = require("../services/mail.service");

const sendOTPPassword = async (req, res) => {
  const { username, email } = req.body;
  const result = await sendOTPPasswordService(username, email);
  res.status(201).send(result);
};

const reSendEmailVerify = async (req, res) => {
  const { email } = req.body;
  const result = await sendOTPVerifyEmailService(String(email.trim()));
  res.status(201).send(result);
};
module.exports = {
  sendOTPPassword,
  reSendEmailVerify,
};
