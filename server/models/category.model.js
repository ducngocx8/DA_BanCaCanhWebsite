const { DataTypes } = require("Sequelize");
// const { Categories } = require(".");

const createCategoryModel = (sequelize) => {
  return sequelize.define(
    "Categories",
    {
      category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      tableName: "categories",
    }
  );
};

module.exports = { createCategoryModel };