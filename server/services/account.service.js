const { Op } = require("Sequelize");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { User, UserRole, Role, sequelize, Otp } = require("../models");
const { decodePassword, encodePassword } = require("../Utils");
const { sendOTPVerifyEmailService } = require("./mail.service");
const { updateOTPService } = require("./Admin/admin.otp.service");
const checkExistUser = async (account, status) => {
  // Status = 1 check (username, email) -- Signup
  // Status = 2 check (username, email, phone) -- Add
  // Status = 3 check (username, user_id) -- Exist or Delete
  let username, email, arrCompare, phonenumber, typeCompare, user_id;
  if (status === 1) {
    username = account.username;
    email = account.email;
    arrCompare = [{ username: username }, { email: email }];
    typeCompare = {
      [Op.or]: arrCompare,
    };
  } else if (status === 2) {
    username = account.username;
    email = account.email;
    phonenumber = account.phonenumber;
    arrCompare = [
      { username: username },
      { email: email },
      { phonenumber: phonenumber },
    ];
    typeCompare = {
      [Op.or]: arrCompare,
    };
  } else if (status === 3) {
    username = account.username;
    user_id = account.user_id;
    arrCompare = [{ user_id: user_id }, { username: username }];
    typeCompare = {
      [Op.and]: arrCompare,
    };
  }
  const user = await User.findOne({
    where: typeCompare,
  });
  return user;
};

const checkAccountLogin = async (account) => {
  const { username, password } = account;
  const user = await User.findOne({
    where: {
      username,
    },
    include: [
      {
        model: Role,
      },
    ],
  });
  if (user) {
    const password_user = user.password;
    const password_decode = CryptoJS.AES.decrypt(
      password_user,
      "duc_ngoc_123"
    ).toString(CryptoJS.enc.Utf8);
    if (password_decode === password) {
      if (Number(user.user_status) === 1) {
        return {
          status: false,
          message:
            "Tài khoản của bạn chưa xác thực Email. Vui lòng xác thực và đăng nhập lại.",
        };
      } else if (Number(user.user_status) === 3) {
        return {
          status: false,
          message:
            "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin để được hỗ trợ.",
        };
      }
      const roles = user.Roles.map((role) => role.role_code);
      const userLogin = {
        user_id: user.user_id,
        username: user.username,
        roles: roles,
      };
      console.log(userLogin);
      const token = jwt.sign(
        {
          data: userLogin,
        },
        "ducngocx8_token",
        { expiresIn: 60 * 60 * 24 }
      );

      return {
        status: true,
        userLogin: userLogin,
        message: "Đăng nhập thành công.",
        token: token,
      };
    }
    return {
      status: false,
      message: "Tài khoản hoặc mật khẩu không chính xác.",
    };
  }
  return {
    status: false,
    message: "Username không tồn tại trên hệ thống",
  };
};

const loginService = async (account) => {
  const check_acount = await checkAccountLogin(account);
  return check_acount;
};

const addUser = async (account, status) => {
  // Status 1: Đăng ký, 2: Thêm user
  const {
    username,
    email,
    password,
    address,
    firstname,
    lastname,
    phonenumber,
    user_status,
    role_id,
  } = account;
  const password_encode = encodePassword(password);
  let user_default;
  if (status === 1) {
    user_default = {
      username,
      password: password_encode,
      email,
      User_Roles: [
        {
          role_id: 3, // Khách hàng
        },
      ],
    };
  } else if (status === 2) {
    user_default = {
      username,
      password,
      email,
      address,
      firstname,
      lastname,
      phonenumber,
      user_status,
      User_Roles: [
        {
          role_id,
        },
      ],
    };
  }

  const result = await User.create(user_default, {
    include: [{ model: UserRole }],
  });
  const send_email_verify = await sendOTPVerifyEmailService(email);
  if (result && send_email_verify.status) return true;
  else if (result && !send_email_verify.status) return null;
  else if (!result && send_email_verify.status) return false;
};

const signupService = async (account) => {
  const check_exist_user = await checkExistUser(account, 1);
  console.log(check_exist_user);
  if (check_exist_user) {
    if (check_exist_user.email === account.email) {
      return { status: false, message: "Email đã tồn tại trên hệ thống" };
    }
    return { status: false, message: "Username đã tồn tại trên hệ thống" };
  }
  const result = addUser(account, 1);
  if (result) {
    return {
      status: true,
      message:
        "Tạo tài khoản mới thành công. Vui lòng kiểm tra email và kích hoạt tài khoản.",
    };
  } else if (result === null) {
    return {
      status: false,
      message:
        "Tạo tài khoản mới thành công. Vui lòng gửi lại yêu cầu kích hoạt tài khoản.",
    };
  } else if (result === false) {
    return {
      status: false,
      message:
        "Tạo tài khoản mới thất bại do lỗi hệ thống. Vui lòng thử lại sau.",
    };
  }
};

const getUserInfoService = async (userLogin) => {
  const check_exist_user = await checkExistUser(userLogin, 3);
  return check_exist_user;
};

const updateInfo = async (userLogin, bodyUser, status) => {
  // status = 1: Update Info, status = 2: Update: password
  let new_info;
  if (status === 1) {
    new_info = {
      address: bodyUser.address.trim(),
      firstname: bodyUser.firstname.trim(),
      lastname: bodyUser.lastname.trim(),
      phonenumber: bodyUser.phonenumber.trim(),
    };
  } else if (status === 2) {
    const password_encode = encodePassword(bodyUser.newpassword);
    new_info = {
      password: password_encode,
    };
  }
  const update_result = await User.update(new_info, {
    where: {
      [Op.and]: [
        { user_id: userLogin.user_id },
        { username: userLogin.username },
      ],
    },
  });
  return update_result;
};

const updateUserInfoService = async (userLogin, bodyUser, status) => {
  const update_result = await updateInfo(userLogin, bodyUser, status);
  console.log(update_result);
  if (update_result) {
    const user = await getUserInfoService(userLogin);
    const password_decode = decodePassword(user.password);
    user.password = password_decode;
    return {
      status: true,
      data: user,
      message: "Cập nhật thông tin user thành công",
    };
  } else {
    return {
      status: false,
      message: "Cập nhật thông tin user thất bại",
    };
  }
};

const checkPasswordCorrect = async (userLogin, bodyUser) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [
        { user_id: userLogin.user_id },
        { username: userLogin.username },
      ],
    },
  });
  if (user) {
    const decoded_password = decodePassword(user.password);
    if (bodyUser.oldpassword === decoded_password) {
      return true;
    }
  }
  return false;
};

const updatePasswordService = async (userLogin, bodyUser, status) => {
  const checkPassword = await checkPasswordCorrect(userLogin, bodyUser);
  if (checkPassword) {
    const update_result = await updateInfo(userLogin, bodyUser, status);
    console.log(update_result);
    if (update_result) {
      const user = await getUserInfoService(userLogin);
      const password_decode = decodePassword(user.password);
      user.password = password_decode;
      return {
        status: true,
        data: user,
        message: "Cập nhật mật khẩu mới thành công",
      };
    } else {
      return {
        status: false,
        message: "Cập nhật mật khẩu mới thất bại",
      };
    }
  } else {
    return {
      status: false,
      message: "Mật khẩu cũ không chính xác",
    };
  }
};

const checkEmailToken = async (email, token, otp_type) => {
  let option_where = "";
  if (otp_type === 1) {
    option_where = {
      email,
      otp_code: String(token),
      status: false,
      otp_type,
      time_send: {
        [Op.gt]: new Date(new Date() - 3 * 60 * 1000),
      },
    };
  } else {
    option_where = {
      email,
      otp_code: String(token),
      status: false,
      otp_type,
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const otp = await Otp.findOne({
        where: option_where,
      });
      return otp;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const checkAccount = async (email) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const account = await User.findOne({
        where: {
          email,
        },
      });
      return account;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateVerifyUser = async (email) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let user = await User.update(
        {
          user_status: 2,
        },
        {
          where: {
            email,
          },
        },
        { transaction: t }
      );
      return user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const verifyAccountService = async (email, token) => {
  const check_email_token = await checkEmailToken(email, token, 2);
  if (check_email_token) {
    const check_account = await checkAccount(email);
    if (check_account !== null) {
      if (Number(check_account.user_status) === 2) {
        return {
          status: false,
          message: "Tài khoản của bạn xác thực trước đó.",
          must: "login",
        };
      } else if (Number(check_account.user_status) === 3) {
        return {
          status: false,
          message: "Tài khoản của bạn đã bị khóa. Không thể xác thực.",
          must: "login",
        };
      } else {
        const update_otp_status = await updateOTPService(email, token, 2);
        const verify = await updateVerifyUser(email);
        if (verify) {
          return {
            status: true,
            message: "Chúc mừng. Bạn đã xác thực tài khoản thành công.",
          };
        } else {
          return {
            status: false,
            message: "Lỗi hệ thống. Vui lòng xác thực lại sau.",
          };
        }
      }
    } else if (check_account === false) {
      return {
        status: false,
        message: "Lỗi hệ thống, vui lòng thử lại sau.",
      };
    } else {
      return {
        status: false,
        message: "Không tìm thấy thông tin người dùng từ Email này.",
      };
    }
  } else if (check_email_token == false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
    };
  } else {
    return {
      status: false,
      message:
        "Đường link xác thực không tồn tại hoặc đã hết hạn. Vui lòng gửi yêu cầu mới!",
    };
  }
};

const updatePasswordVerifyService = async (email, password) => {
  try {
    const password_encode = encodePassword(String(password).trim());
    const result = await sequelize.transaction(async (t) => {
      let user = await User.update(
        {
          password: password_encode,
        },
        {
          where: {
            email,
            user_status: 2,
          },
        },
        { transaction: t }
      );
      return user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const verifyForgotPasswordService = async (email, otp_code, password) => {
  const check_email_token = await checkEmailToken(email, otp_code, 1);
  if (check_email_token) {
    const check_account = await checkAccount(email);
    if (check_account !== null) {
      if (Number(check_account.user_status) === 1) {
        return {
          status: false,
          message:
            "Tài khoản của chưa xác thực. Vui lòng xác thực trước khi lấy mật khẩu mới.",
          must: "login",
        };
      } else if (Number(check_account.user_status) === 3) {
        return {
          status: false,
          message: "Tài khoản của bạn đã bị khóa. Không thể lấy mật khẩu mới.",
          must: "login",
        };
      } else {
        const update_otp_status = await updateOTPService(email, otp_code, 1);
        const update_password = await updatePasswordVerifyService(
          email,
          password
        );
        if (update_password) {
          return {
            status: true,
            message: "Chúc mừng. Bạn đã thay đổi mật khẩu thành công.",
          };
        } else {
          return {
            status: false,
            message: "Lỗi hệ thống. Vui lòng lấy lại mật khẩu sau.",
          };
        }
      }
    } else if (check_account === false) {
      return {
        status: false,
        message: "Lỗi hệ thống, vui lòng thử lại sau.",
      };
    } else {
      return {
        status: false,
        message: "Không tìm thấy thông tin người dùng từ Email này.",
      };
    }
  } else if (check_email_token == false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
    };
  } else {
    return {
      status: false,
      message: "Mã OTP không đúng hoặc đã hết hạn. Vui lòng gửi yêu cầu mới!",
    };
  }
};

module.exports = {
  loginService,
  signupService,
  getUserInfoService,
  checkExistUser,
  updateUserInfoService,
  updatePasswordService,
  verifyAccountService,
  verifyForgotPasswordService,
};
