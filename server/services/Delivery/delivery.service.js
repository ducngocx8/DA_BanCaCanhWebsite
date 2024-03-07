const {
  sequelize,
  Order,
  OrderDetail,
  ImageProduct,
  Categories,
  Size,
  User,
  Fish,
} = require("../../models");
const { QueryTypes, Op } = require("Sequelize");

const countOrderDeliverySerive = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const count = await sequelize.query(
        "SELECT COUNT (ORDER_ID) FROM ORDERS WHERE ORDER_STATUS = 3",
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

const getOrderDeliverySerive = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderDetail,
            include: [
              {
                model: Fish,
                include: [{ model: ImageProduct }, { model: Categories }],
              },
              {
                model: Size,
              },
            ],
          },
          { model: User, attributes: { exclude: ["password"] } },
        ],
        where: {
          order_status: 3,
        },
        order: [["order_id", "DESC"]],
      });
      return orders;
    });
    return {
      status: true,
      data: result,
    };
  } catch (error) {
    return {
      status: false,
      message: "Lỗi server...",
    };
  }
};

const checkCurrentOrder = async (order_id, order_status) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const order = await Order.findOne({
        where: {
          order_id,
          order_status: order_status,
        },
      });
      return order;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const handleChangeStatus = async (
  order_id,
  note,
  order_status_current,
  new_order_status
) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const order_update = await Order.update(
        {
          note: note.trim(),
          order_status: new_order_status,
        },
        {
          where: {
            order_id,
            order_status: order_status_current,
          },
        },
        { transaction: t }
      );
      return order_update;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// oldStatus = 3 and newStatus = 7
const exchangeOrderAllSerive = async (order_id, note) => {
  const check_order = await checkCurrentOrder(order_id, 3);
  if (check_order) {
    const update = await handleChangeStatus(order_id, note, 3, 7);
    if (update) {
      const delivery_orders = await getOrderDeliverySerive();
      return {
        status: true,
        message:
          "Yêu cầu trả toàn bộ đơn hàng ID " +
          order_id +
          " của khách hàng " +
          check_order.fullname +
          " thành công.",
        data: delivery_orders.data,
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống, vui lòng thử lại sau.",
      };
    }
  } else if (check_order === false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
    };
  } else {
    return {
      status: false,
      message:
        "Không tìm thấy thông tin đơn hàng hoặc đơn hàng không ở trạng thái đang vận chuyển.",
    };
  }
};

const getByDate = async (startDate, endDate) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const orders = await Order.findAll({
        where: {
          order_status: 3,
          order_time: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
        include: [
          {
            model: OrderDetail,
            include: [
              {
                model: Fish,
                include: [{ model: ImageProduct }, { model: Categories }],
              },
              {
                model: Size,
              },
            ],
          },
        ],
      });
      return orders;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getOrderDeliveryByDateService = async (startDate, endDate) => {
  const result = await getByDate(startDate, endDate);
  if (result) {
    return {
      status: true,
      data: result,
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống",
    };
  }
};

// oldStatus = 3, newStatus: 5
const deliveryOrderSuccessService = async (order_id) => {
  const check_order = await checkCurrentOrder(order_id, 3);
  if (check_order) {
    const update = await handleChangeStatus(order_id, "", 3, 5);
    if (update) {
      const delivery_orders = await getOrderDeliverySerive();
      return {
        status: true,
        message:
          "Cập nhật trạng thái giao hàng thành công đơn hàng " +
          order_id +
          " của khách hàng " +
          check_order.fullname +
          " thành công.",
        data: delivery_orders.data,
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống, vui lòng thử lại sau.",
      };
    }
  } else if (check_order === false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
    };
  } else {
    return {
      status: false,
      message:
        "Không tìm thấy thông tin đơn hàng hoặc đơn hàng không ở trạng thái đang vận chuyển.",
    };
  }
};

module.exports = {
  countOrderDeliverySerive,
  getOrderDeliverySerive,
  exchangeOrderAllSerive,
  getOrderDeliveryByDateService,
  deliveryOrderSuccessService,
};
