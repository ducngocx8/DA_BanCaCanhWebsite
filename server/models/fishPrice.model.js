const { DataTypes } = require("Sequelize");

const createFishPriceModel = (sequelize) => {
  return sequelize.define(
    "Fish_Price",
    {
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      fish_remain: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "fish_price",
    }
  );
};

module.exports = { createFishPriceModel };
