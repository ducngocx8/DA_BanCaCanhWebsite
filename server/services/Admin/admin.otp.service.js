const { Otp, sequelize } = require("../../models");

const getAllOTPService = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const otps = await Otp.findAll({
        order: [["id", "DESC"]],
      });
      return otps;
    });
    return {
      status: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
    };
  }
};

const updateOTPService = async (email, otp_code, otp_type) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let otp = await Otp.update(
        {
          status: true,
        },
        {
          where: {
            email,
            otp_code,
            otp_type,
          },
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

const deleteAllOTPService = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await Otp.destroy({ where: {} }, { transaction: t });
      const otps = await getAllOTPService(); 
      return {
        status: true,
        message: "Xóa tất cả dữ liệu OTP thành công.",
        data: otps.data,
      };
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { getAllOTPService, updateOTPService, deleteAllOTPService };
