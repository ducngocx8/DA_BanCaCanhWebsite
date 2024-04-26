const {
  adminGetAllCouponService,
  adminAddCouponService,
  adminDeleteCouponService,
  adminUpdateCouponService,
} = require("../../services/Admin/admin.coupon.service");

const adminGetAllCoupon = async (req, res) => {
  const result = await adminGetAllCouponService();
  res.status(200).send(result);
};

const adminAddCoupon = async (req, res) => {
  let couponBody = req.body;
  const result = await adminAddCouponService(couponBody);
  res.status(201).send(result);
};

const adminDeleteCoupon = async (req, res) => {
  const coupon_id = req.params.id;
  const result = await adminDeleteCouponService(coupon_id);
  res.status(201).send(result);
};

const adminUpdateCoupon = async (req, res) => {
  const coupon_id = req.params.id;
  const couponBody = req.body;
  const result = await adminUpdateCouponService(coupon_id, couponBody);
  res.status(201).send(result);
};

module.exports = {
  adminGetAllCoupon,
  adminDeleteCoupon,
  adminAddCoupon,
  adminUpdateCoupon,
};
