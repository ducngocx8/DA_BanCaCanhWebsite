const { DataTypes } = require("Sequelize");
const createRateModel = (sequelize) => {
  return sequelize.define(
    "Rates",
    {
      rate_point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rate_comment: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
      },
      rate_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "rates",
    }
  );
};

module.exports = { createRateModel };
