const { DataTypes } = require("Sequelize");
const createCouponModel = (sequelize) => {
  return sequelize.define(
    "Coupons",
    {
      coupon_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coupon_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      coupon_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      min_order: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      save_money_max: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 100000,
      },
      coupon_expired: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "coupons",
    }
  );
};

module.exports = { createCouponModel };
