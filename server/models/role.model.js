const { DataTypes } = require("Sequelize");

const createRoleModel = (sequelize) => {
  return sequelize.define(
    "Roles",
    {
      role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      role_code: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "roles",
    }
  );
};

module.exports = { createRoleModel };
