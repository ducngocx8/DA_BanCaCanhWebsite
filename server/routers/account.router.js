const express = require("express");
const acountRouter = express.Router();

const {
  signup,
  login,
  logout,
  getUserInfo,
  updateUserInfo,
  updatePassword,
  verifyAccount,
  verifyForgotPassword,
} = require("../controllers/account.controller");
const {
  checkInputSignup,
  checkInputLogin,
  verifyToken,
  checkUserToken,
  checkPhoneNumber,
  passwordUpdateValidation,
  checkVerifyForgotPassword,
} = require("../middlewares/validations/account.validation");
const { allPermission } = require("../middlewares/permission");
acountRouter.post("/login", checkInputLogin, login);
acountRouter.post("/signup", checkInputSignup, signup);
acountRouter.get(
  "/info",
  verifyToken,
  checkUserToken,
  allPermission,
  getUserInfo
);
acountRouter.post(
  "/info/update_info",
  checkPhoneNumber,
  verifyToken,
  checkUserToken,
  updateUserInfo
);
acountRouter.post(
  "/info/update_password",
  passwordUpdateValidation,
  verifyToken,
  checkUserToken,
  allPermission,
  updatePassword
);
acountRouter.get("/verify/email/:email/:token", verifyAccount);
acountRouter.post(
  "/forgot/password",
  checkVerifyForgotPassword,
  verifyForgotPassword
);
acountRouter.get("/logout", logout);
module.exports = acountRouter;
