const { DataTypes } = require("Sequelize");

const createFishModel = (sequelize) => {
  return sequelize.define(
    "Fish",
    {
      fish_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fish_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fish_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },
      fish_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ph: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      temperature: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      food: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      behavior: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      timestamps: false,
      tableName: "fish",
    }
  );
};

module.exports = { createFishModel };
