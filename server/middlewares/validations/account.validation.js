var jwt = require("jsonwebtoken");
const { User, Role } = require("../../models");
var regexUsername = /^[a-zA-Z0-9]+$/;
var regexEmail = /^[a-z0-9]+@gmail.com+$/;
const regexPhone = /(0[3|5|7|8|9])+([0-9]{8})\b/;
const checkInputSignup = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res
      .status(201)
      .send({ status: false, message: "Vui lòng điền đủ thông tin đăng ký" });
  } else if (!regexUsername.test(username) || username.length < 3 || username.length > 20) {
    res.status(201).send({
      status: false,
      message: "Username không hợp lệ hoặc đang dưới từ 3 ký tự",
    });
  } else if (!regexEmail.test(email) || email.length > 50) {
    res.status(201).send({
      status: false,
      message: "Email không hợp lệ",
    });
  } else if (password.length < 3 || password.length > 255) {
    res.status(201).send({
      status: false,
      message: "Mật khẩu cần từ 3 ký tự trở lên",
    });
  }
  next();
};

const checkPhoneNumber = (req, res, next) => {
  const { phonenumber } = req.body;
  if (regexPhone.test(phonenumber) || phonenumber.length === 0) {
    return next();
  } else {
    res.status(201).send({
      status: false,
      message: "Số điện thoại không hợp lệ.",
    });
  }
};

const checkInputLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(201)
      .send({ status: false, message: "Vui lòng điền đủ thông tin đăng nhập" });
  } else if (!regexUsername.test(username) || username.length < 3) {
    res.status(201).send({
      status: false,
      message: "Username không hợp lệ hoặc đang dưới từ 3 ký tự",
    });
  }
  next();
};

const checkUserToken = async (req, res, next) => {
  const { userLogin } = req;
  const { user_id, username } = userLogin;
  const user = await User.findOne({
    where: {
      user_id: user_id,
      username: username,
      user_status: 2,
    },
    include: [{ model: Role }],
  });

  if (user) {
    const roles_new = user.Roles.map((role) => role.role_code);
    const userLogin_new = {
      user_id: user.user_id,
      username: user.username,
      roles: roles_new,
    };
    req.userLogin = userLogin_new;
    next();
  } else {
    console.log("TOKE KHÔNG KHỚP");
    res.cookie("access_token", "", {
      maxAge: 24 * 60 * 60,
      httpOnly: true,
    });
    return res.status(200).send({
      status: false,
      must: "login",
      message: "Tài khoản của bạn không tồn tại hoặc đã bị khóa/chưa xác thực",
    });
  }
};

const verifyToken = (req, res, next) => {
  const token_bearer = req.cookies.access_token;
  if (token_bearer) {
    const token = token_bearer.split(" ")[1];
    if (token) {
      jwt.verify(token, "ducngocx8_token", function (err, decoded) {
        if (!decoded) {
          console.log("Invalid token");
          return res.status(200).send({
            status: false,
            message: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại",
            must: "login",
          });
        } else {
          console.log(decoded.data); //Token { user_id: 13, username: 'ducngoc124', roles: [ 'ROLE_CUSTOMER' ] }
          req.userLogin = decoded.data;
          return next();
        }
      });
    } else {
      return res.status(200).send({
        status: false,
        message: "Vui lòng đăng đăng nhập",
        must: "login"
      });
    }
  } else {
    console.log("ĐĂNG NHẬP L2");
    return res.status(200).send({
      status: false,
      message: "Vui lòng đăng đăng nhập",
      must: "login",
    });
  }
};

const passwordUpdateValidation = (req, res, next) => {
  const bodyUser = req.body;
  if (bodyUser) {
    const { oldpassword, newpassword } = bodyUser;
    if (!oldpassword || !newpassword) {
      return res.status(201).send({
        status: false,
        message: "Thiếu các trường dữ liệu cần thiết.",
      });
    }else if (newpassword.trim().length < 3 || newpassword.trim().length > 255) {
      return res.status(201).send({
        status: false,
        message: "Mật khẩu mới cần từ 3 ký tự trở lên.",
      });
    }
    next()
  } else {
    return res.status(201).send({
      status: false,
      message: "Thiếu các trường dữ liệu cần thiết.",
    });
  }
};


const checkVerifyForgotPassword = (req, res, next) => {
   const { email, otp_code, password } = req.body;
   if (!email) {
     return res.status(201).send({
       status: false,
       message: "Thiếu trường dữ liệu email.",
     });
   } else if (!otp_code) {
     return res.status(201).send({
       status: false,
       message: "Thiếu trường dữ liệu otp_code.",
     });
   } else if (!password) {
     return res.status(201).send({
       status: false,
       message: "Thiếu trường dữ liệu password.",
     });
   }else {
    if (!regexEmail.test(email)) {
      return res.status(201).send({
        status: false,
        message: "Địa chỉ Email không hợp lệ.",
      });
    } else if (
      String(password).trim().length < 3 ||
      String(password).trim().length > 255
    ) {
      return res.status(201).send({
        status: false,
        message: "Mật khẩu cần từ 3 ký tự trở lên.",
      });
    }
   }
   next();
}

module.exports = {
  checkInputSignup,
  checkInputLogin,
  verifyToken,
  checkUserToken,
  checkPhoneNumber,
  passwordUpdateValidation,
  checkVerifyForgotPassword,
};
