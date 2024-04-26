const { DataTypes } = require("Sequelize");

const createImageModel = (sequelize) => {
  return sequelize.define(
    "Image",
    {
      image_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      url_image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "image",
    }
  );
};

module.exports = { createImageModel };
