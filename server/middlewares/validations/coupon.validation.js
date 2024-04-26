const moment = require("moment");
const couponIDAdminValidation = (req, res, next) => {
  const coupon_id = req.params.id;
  if (!Number.isInteger(Number(coupon_id))) {
    res.status(201).send({
      status: false,
      message: "Coupon_id phải là số nguyên",
    });
  } else {
    next();
  }
};

const addCouponAdminValidation = (req, res, next) => {
  let {
    coupon_code,
    coupon_name,
    discount,
    min_order,
    save_money_max,
    coupon_expired,
  } = req.body;

  if (
    !coupon_code ||
    !coupon_name ||
    (!discount && Number(discount) !== 0) ||
    (!min_order && Number(min_order) !== 0) ||
    (!save_money_max && Number(save_money_max) !== 0) ||
    !coupon_expired
  ) {
    res.status(201).send({
      status: false,
      message:
        "Thiếu thông tin coupon_code/ mô tả/ phần trăm giảm giá/ đơn hàng tối thiểu/ giảm tối đa/ thời hạn",
    });
  } else {
    if (
      !Number.isInteger(Number(discount)) ||
      Number(discount) < 0 ||
      Number(discount) > 100
    ) {
      res.status(201).send({
        status: false,
        message: "Discount (phần trăm giảm giá) phải là số nguyên từ 0 -> 100",
      });
    } else if (!Number.isInteger(Number(min_order))) {
      res.status(201).send({
        status: false,
        message: "Giá đơn hàng tối thiểu phải là số nguyên",
      });
    } else if (
      !Number.isInteger(Number(save_money_max)) ||
      Number(save_money_max) < 0
    ) {
      res.status(201).send({
        status: false,
        message: "Số tiền giảm tối đa phải là số nguyên và >= 0",
      });
    } else if (coupon_code.trim().length < 3 || coupon_code.trim().length > 10) {
      res.status(201).send({
        status: false,
        message: "Mã code phải từ 3 ký tụ trở lên",
      });
    } else if (coupon_name.trim().length < 5 || coupon_name.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Vui lòng nhập mô tả coupon ít nhất 5 ký tự",
      });
    } else if (!moment(coupon_expired, "YYYY-MM-DD", true).isValid()) {
      res.status(201).send({
        status: false,
        message: "Ngày hết hạn không hợp lệ",
      });
    } else {
      next();
    }
  }
};

module.exports = {
  couponIDAdminValidation,
  addCouponAdminValidation,
};
