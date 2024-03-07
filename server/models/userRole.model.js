const { DataTypes } = require("Sequelize");
const createUserRoleModel = (sequelize) => {
  return sequelize.define(
    "User_Roles",
    {},
    {
      timestamps: false,
      tableName: "user_roles",
    }
  );
};

module.exports = { createUserRoleModel };
