const express = require("express");
const { Op } = require("Sequelize");
const { sequelize, Coupon } = require("../models");
const couponRouter = express.Router();

const getAllCouponActiveService = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const coupons = await Coupon.findAll({
        where: {
          coupon_expired: {
            [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000), // Hết hạn vào 23h59p59s ngày set
          },
        },
      });
      return coupons;
    });
    return result;
  } catch (error) {
    return false;
  }
};

couponRouter.get("/", async (req, res) => {
  const result = await getAllCouponActiveService();
  res.status(200).send({
    status: true,
    data: result,
  });
});
module.exports = couponRouter;
