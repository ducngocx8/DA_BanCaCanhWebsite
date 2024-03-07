const nodemailer = require("nodemailer"); // Require the Nodemailer package
const { EMAIL_CONFIG } = require("../configs/mail.config");
const { User, sequelize, Otp } = require("../models");
const { createToken, FRONTEND_BASE } = require("../Utils");
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

const findUser = async (username, email) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: {
          username,
          email,
        },
      });
      return user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const findUserEmailOnly = async (email) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      return user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createOTP = async (otp_code, email, otp_type) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const otp = await Otp.create(
        {
          email,
          otp_code,
          time_send: Date.now(),
          status: false,
          otp_type,
        },
        { transaction: t }
      );
      return otp;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const sendOTPPasswordService = async (username, email) => {
  email = email.trim();
  username = username.trim();
  try {
    const find_user = await findUser(username, email);
    if (find_user) {
      if (Number(find_user.user_status) === 1) {
        return {
          status: false,
          message:
            "Tài khoản của bạn chưa xác thực. Không thể lấy mật khẩu mới",
          must: "login",
        };
      } else if (Number(find_user.user_status) === 3) {
        return {
          status: false,
          message: "Tài khoản của bạn đã bị khóa. Không thể lấy mật khẩu mới.",
          must: "login",
        };
      }
      const otp_code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
      await transporter.sendMail({
        from: '"Đức Ngọc FISH SHOP" <ducngoc233@gmail.com>',
        to: email,
        subject: "Yêu cầu lấy mật khẩu mới tài khoản " + username,
        text: "Chúng tui nhận được yêu cầu cấp lại mật khẩu đăng nhập của bạn.",
        html: `Mã xác thực OTP cua bạn là <strong style='color: red'>${otp_code}</strong>. <br>Quý khách vui lòng nhập mã OTP này để xác nhận tài khoản tại FISH SHOP.<br> Mã OTP chỉ có giá trị trong vòng 180 giây và chỉ có giá trị một lần. <br> Xin vui lòng không chia sẻ mã xác thực cho bất kỳ ai vì tính bảo mật thông tin của Quý khách. <br>Nếu không phải bạn thực hiện sự thay đổi trên, vui lòng liên hệ với chúng tôi tại hotline 0378544081 (24/7). <br>Xin cảm ơn!`,
      });
      const otp = await createOTP(otp_code, email, 1);
      if (otp) {
        return {
          status: true,
          message: "Gửi OTP thành công, vui lòng kiểm tra Email.",
        };
      } else {
        return {
          status: false,
          message: "Tạo mã OTP thất bại. Vui lòng thử lại sau.",
        };
      }
    } else {
      return {
        status: false,
        message: "Không tìm thấy thông tin user.",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Lỗi hệ thống Email, vui lòng thử lại sau.",
    };
  }
};

const sendOTPVerifyEmailService = async (email) => {
  email = email.trim();
  try {
    const find_user = await findUserEmailOnly(email);
    if (find_user) {
      if (find_user.user_status !== 1) {
        return {
          status: false,
          message:
            "Tài khoản Email của bạn đã được kích hoạt thành công trước đó.",
        };
      }
      const token = createToken();
      await transporter.sendMail({
        from: '"Đức Ngọc FISH SHOP" <ducngoc233@gmail.com>',
        to: email,
        subject: "Kích hoạt tài khoản FISH SHOP VN ",
        html: `<p style="color:#000000"><p><strong>Chào bạn!</strong></p>
            <p style="font-size: 13px">Chào mừng đến với cộng đồng mua sắm cá cảnh, nơi bạn có thể lựa chọn và mua sắm những loại cá cảnh mà bạn muốn! Chúng tôi rất vui được chào đón bạn tham gia.&nbsp;</p>
            <p style="color:#000000">Vui lòng nhấp vào nút bên dưới để xác thực email của bạn!&nbsp;</p>
            </p>
            <button align="center" valign="middle" style="font-family:Arial;font-size:15px;padding:10px;background: #28a745;outline: none;border: none;">
                <a title="Xác thực Email" href=${FRONTEND_BASE}/account/verify/email/${email}/${token} style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff" target="_blank">Xác thực Email</a>
             </button>. <p>Cảm ơn bạn!</p>`,
      });
      const otp = await createOTP(token, email, 2);
      if (otp) {
        return {
          status: true,
          message: "Gửi link xác thực thành công, vui lòng kiểm tra Email.",
        };
      } else {
        return {
          status: false,
          message: "Tạo link xác thực thất bại. Vui lòng thử lại sau.",
        };
      }
    } else {
      return {
        status: false,
        message: "Email không tồn tại trên hệ thống. Vui lòng kiểm tra lại!",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Lỗi hệ thống Email, vui lòng thử lại sau.",
    };
  }
};

const findEmail = async (user_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: {
          user_id,
        },
      });
      return user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const sendEmailOrderService = async (user_id) => {
  try {
    const user = await findEmail(user_id);
    if (user) {
      const email = user.email;
      await transporter.sendMail({
        from: '"Đức Ngọc FISH SHOP" <ducngoc233@gmail.com>',
        to: email,
        subject: "Thông báo đặt hàng thành công!",
        html: `<p>Cảm ơn bạn đã đặt hàng tại hệ thống chúng tôi!</p>`,
      });
      return {
        status: true,
        message: "Gửi Email đặt hàng thành công.",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Lỗi hệ thống Email, vui lòng thử lại sau.",
    };
  }
};

module.exports = {
  sendOTPPasswordService,
  sendOTPVerifyEmailService,
  sendEmailOrderService,
};
