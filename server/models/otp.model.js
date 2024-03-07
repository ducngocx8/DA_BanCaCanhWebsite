const { DataTypes } = require("Sequelize");
const createOTPModel = (sequelize) => {
  return sequelize.define(
    "Otps",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      otp_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time_send: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      otp_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "otps",
    }
  );
};

module.exports = { createOTPModel };
