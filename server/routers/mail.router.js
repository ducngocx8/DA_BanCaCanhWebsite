const express = require("express");
const { checkUserNameAndEmail, checkEmailValid } = require("../middlewares/validations/mail.validation");
const { sendOTPPassword, reSendEmailVerify } = require("../controllers/mail.controller");
const mailRouter = express.Router();


mailRouter.post("/forgot-password", checkUserNameAndEmail, sendOTPPassword);
mailRouter.post("/resend-email", checkEmailValid, reSendEmailVerify);
module.exports = mailRouter;
