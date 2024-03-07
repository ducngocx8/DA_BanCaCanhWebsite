const { DataTypes } = require("Sequelize");

const createCartModel = (sequelize) => {
  return sequelize.define(
    "Carts",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
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
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "carts",
    }
  );
};

module.exports = { createCartModel };
