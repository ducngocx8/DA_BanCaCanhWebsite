const { DataTypes } = require("Sequelize");

const createOrderDetailModel = (sequelize) => {
  return sequelize.define(
    "OrderDetails",
    {
      fish_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "fish",
          key: "fish_id",
        },
      },

      size_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "size",
          key: "size_id",
        },
      },

      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "orders",
          key: "order_id",
        },
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      exchange: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "order_details",
    }
  );
};

module.exports = { createOrderDetailModel };
