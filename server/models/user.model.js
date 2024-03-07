const { DataTypes } = require("Sequelize");
const createUserModel = (sequelize) => {
  return sequelize.define(
    "Users",
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      firstname: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "",
      },
      lastname: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "",
      },
      phonenumber: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: "",
      },
      user_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1: inActive, 2: Active, 3: Block
      },
    },
    {
      timestamps: false,
      tableName: "users",
    }
  );
};

module.exports = { createUserModel };
