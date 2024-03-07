const { DataTypes } = require("Sequelize");
const createOrderModel = (sequelize) => {
  return sequelize.define(
    "Orders",
    {
      order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      save_money: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      order_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      order_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "orders",
    }
  );
};

module.exports = { createOrderModel };
