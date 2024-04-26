const {
  sequelize,
  Fish,
  Fish_Size,
  Size,
  Cart,
  OrderDetail,
  Coupon,
} = require("../../models");
const { Op } = require("Sequelize");
const getAll = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupons = await Coupon.findAll({
        order: [["coupon_id", "ASC"]],
      });
      return coupons;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetAllCouponService = async () => {
  const result = await getAll();
  if (result) {
    return {
      status: true,
      data: result,
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống",
    };
  }
};

const checkCouponCode = async (coupon_code, status, coupon_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      coupon_code: coupon_code,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [
        { coupon_code: coupon_code },
        { coupon_id: { [Op.not]: Number(coupon_id) } },
      ],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupon = await Coupon.findOne({
        where: whereObject,
      });
      return coupon;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkCouponIDExist = async (coupon_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupon = await Coupon.findOne(
        { where: { coupon_id } },
        { transaction: t }
      );
      return coupon;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addCoupon = async (couponBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupon = await Coupon.create(
        {
          coupon_code: couponBody.coupon_code.trim(),
          coupon_name: couponBody.coupon_name.trim(),
          discount: Number(couponBody.discount),
          min_order: Number(couponBody.min_order),
          save_money_max: Number(couponBody.save_money_max),
          coupon_expired: couponBody.coupon_expired,
        },
        { transaction: t }
      );
      return coupon;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminAddCouponService = async (couponBody) => {
  let coupon_code = couponBody.coupon_code.trim();
  const check_coupon_code = await checkCouponCode(coupon_code, 1, -1);
  if (check_coupon_code === null) {
    const add_result = await addCoupon(couponBody);
    if (add_result) {
      const coupon_list = await getAll();
      return {
        status: true,
        data: coupon_list,
        message: "Tạo Coupon mới thành công",
      };
    } else {
      return {
        status: false,
        message: "Tạo Coupon mới thất bại",
      };
    }
  } else if (check_coupon_code === false) {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Mã coupon đã tồn tại trên hệ thống",
    };
  }
};

const deleteCoupon = async (coupon_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupon = await Coupon.destroy(
        {
          where: {
            coupon_id,
          },
        },
        { transaction: t }
      );
      return coupon;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminDeleteCouponService = async (coupon_id) => {
  const check_coupon_exist = await checkCouponIDExist(coupon_id);
  if (check_coupon_exist !== null) {
    const delete_result = await deleteCoupon(coupon_id);
    if (delete_result) {
      const coupon_list = await getAll();
      return {
        status: true,
        data: coupon_list,
        message: "Xóa mã coupon thành công",
      };
    } else {
      return {
        status: false,
        message: "Xóa mã coupon thất bại",
      };
    }
  } else if (check_coupon_exist === false) {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Không tìm thấy thông tin coupon, có thể đã xóa.",
    };
  }
};

const updateCoupon = async (coupon_id, couponBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupon_update = await Coupon.update(
        {
          coupon_code: couponBody.coupon_code.trim(),
          coupon_name: couponBody.coupon_name.trim(),
          discount: Number(couponBody.discount),
          min_order: Number(couponBody.min_order),
          save_money_max: Number(couponBody.save_money_max),
          coupon_expired: couponBody.coupon_expired,
        },
        {
          where: {
            coupon_id,
          },
        },
        { transaction: t }
      );
      return coupon_update;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminUpdateCouponService = async (coupon_id, couponBodyy) => {
  const check_coupon_exist = await checkCouponIDExist(coupon_id);
  if (check_coupon_exist) {
    const coupon_code = couponBodyy.coupon_code.trim();
    const check_code = await checkCouponCode(coupon_code, 2, coupon_id);
    if (check_code === null) {
      const update_result = await updateCoupon(coupon_id, couponBodyy);
      if (update_result) {
        const coupon_list = await getAll();
        return {
          status: true,
          data: coupon_list,
          message: "Cập nhật thông tin Coupon thành công",
        };
      } else {
        return {
          status: false,
          message: "Cập nhật thông tin Coupon thất bại",
        };
      }
    } else if (check_code === false) {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    } else {
      return {
        status: false,
        message: "Mã code đã tồn tại trên hệ thống",
      };
    }
  } else if (check_coupon_exist === false) {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Coupon không tồn tại trên hệ thống",
    };
  }
};

module.exports = {
  adminGetAllCouponService,
  adminAddCouponService,
  adminDeleteCouponService,
  adminUpdateCouponService,
};
