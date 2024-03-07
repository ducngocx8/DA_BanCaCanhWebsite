const { DataTypes } = require("sequelize");

const createSizeModel = (sequelize) => {
  return sequelize.define(
    "Size",
    {
      size_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      size_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "size",
    }
  );
};

module.exports = { createSizeModel };
