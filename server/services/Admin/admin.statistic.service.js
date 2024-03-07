const { sequelize } = require("../../models");
const { QueryTypes } = require("Sequelize");

const adminGetUserAmountService = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const count = await sequelize.query("SELECT COUNT(user_id) FROM USERS", {
        type: QueryTypes.SELECT,
      });
      return count;
    });
    return {
      status: true,
      data: result[0].count,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Lỗi server...",
    };
  }
};

const adminGetOrderSuccessAmountService = async () => {
  const currentYear = new Date().getFullYear();
  try {
    const result = await sequelize.transaction(async (t) => {
      const count = await sequelize.query(
        "SELECT COUNT(order_id) FROM ORDERS WHERE ORDERS.order_status = 5 AND EXTRACT(YEAR FROM ORDERS.order_time) = " +
          currentYear,
        {
          type: QueryTypes.SELECT,
        }
      );
      return count;
    });
    return {
      status: true,
      data: result[0].count,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Lỗi server...",
    };
  }
};

const adminGetRevenueOfYearService = async (year) => {
    try {
      const result = await sequelize.transaction(async (t) => {
        const orders = await sequelize.query(
          "SELECT ABC.order_id, ABC.order_time, ABC.NO_COUPON - ABC.save_money AS TOTAL FROM (SELECT ORDERS.order_id, ORDERS.save_money, ORDERS.order_time, SUM(ORDER_DETAILS.price * ORDER_DETAILS.amount) AS NO_COUPON FROM ORDERS INNER JOIN ORDER_DETAILS ON ORDERS.order_id = ORDER_DETAILS.order_id WHERE ORDERS.order_status = 5 AND EXTRACT(YEAR FROM ORDERS.order_time) = "+ year +" GROUP BY ORDERS.order_id, ORDERS.save_money,  ORDERS.order_time) AS ABC",
          {
            type: QueryTypes.SELECT,
          }
        );
        return orders;
      });
      return {
        status: true,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Lỗi server...",
      };
    }
}


module.exports = {
  adminGetUserAmountService,
  adminGetOrderSuccessAmountService,
  adminGetRevenueOfYearService,
};
