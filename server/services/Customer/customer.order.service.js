const { Op, QueryTypes } = require("Sequelize");
const {
  OrderDetail,
  Order,
  Fish,
  ImageProduct,
  Size,
  Categories,
  sequelize,
} = require("../../models");

const getOrderByUserService = async (user_id) => {
  const result = await Order.findAll({
    where: {
      user_id: user_id,
    },
    order: [["order_id", "DESC"]],
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
  return result;
};
// 1 Đặt hàng, 2: Đã xác nhận (Chuẩn bị), 3: Đang vận chuyển, 4 Yêu Cầu Hủy, 5 Thành công, 6 Hủy hàng
// => 1 tới 4
// 1 => Hiện xác nhận => Xác nhận => Vận chuyển
const checkOrderOfUserExist = async (user_id, order) => {
  const { order_id } = order;
  const order_of_user = await Order.findOne({
    where: {
      [Op.and]: [{ order_id: order_id }, { user_id: user_id }],
    },
  });
  return order_of_user;
};

const updateOrder = async (user_id, order) => {
  const { order_id, phonenumber, fullname, address, order_status, note } =
    order;
  const update_cart_result = await Order.update(
    {
      phonenumber,
      address,
      order_status,
      fullname,
      note
    },
    {
      where: {
        [Op.and]: [{ order_id: order_id }, { user_id: user_id }],
      },
    }
  );
  return update_cart_result;
};

const orderUserUpdateService = async (user_id, order) => {
  const order_of_user = await checkOrderOfUserExist(user_id, order);
  if (order_of_user) {
    if (order_of_user.order_status === 6) {
      return {
        status: false,
        message: "Đơn hàng đã hủy, không thể chỉnh sửa.",
      };
    }
    if (order_of_user.order_status === 4) {
      return {
        status: false,
        message: "Bạn đã yêu cầu hủy trước đó, không thể chỉnh sửa.",
      };
    }
     if (order_of_user.order_status !== 1) {
       return {
         status: false,
         message: "Đơn hàng ở trạng thái đã xác nhận/giao thành công sẽ không thể cập nhật thông tin.",
       };
     }
    const result_update = await updateOrder(user_id, order);
    if (result_update) {
      const new_orderUser = await getOrderByUserService(user_id);
      return {
        status: true,
        data: new_orderUser,
        message: "Cập nhật đơn hàng thành công.",
      };
    }
    return {
      status: false,
      message: "Cập nhật đơn hàng thất bại.",
    };
  } else {
    return {
      status: false,
      message: "Bạn không sở hữu đơn hàng này hoặc đơn hàng không tồn tại.",
    };
  }
};

const getOrderBetweenDateService = async (
  user_id,
  startDate,
  endDate,
  status
) => {
  // status = 1: User, status = 2: Admin
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      [Op.and]: [
        {
          user_id: user_id,
          order_time: {
            [Op.and]: {
              [Op.gte]: startDate, // từ 0h startDate và trước 0h endDate => hết Ngày startDate
              [Op.lte]: endDate,
            },
          },
        },
      ],
    };
  } else if (status === 2) {
    whereObject = {
      order_time: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    };
  }
  const res = await Order.findAll({
    where: whereObject,
    order: [["order_id", "ASC"]],
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
  if (res) {
    return {
      status: true,
      data: res,
    };
  } else {
    return {
      status: false,
      message: "Lấy danh sách đơn hàng thất bại",
    };
  }
};

const getOrderUserStatisticsService = async (user_id) => {
  const result = await sequelize.query(
    "SELECT ORDERS.order_id, ABC.sum_orderdetail, ORDERS.save_money, ABC.sum_money - ABC.save_money AS money_order, ORDERS.order_status FROM ORDERS INNER JOIN (SELECT ORDERS.order_id AS order_id, COUNT (ORDERS.order_id) AS sum_orderdetail, ORDERS.save_money AS save_money, SUM(ORDER_DETAILS.amount * ORDER_DETAILS.price) AS sum_money, ORDERS.order_status as order_status  FROM ORDERS INNER JOIN ORDER_DETAILS ON ORDERS.order_id = ORDER_DETAILS.order_id WHERE (ORDERS.order_status = 1 OR ORDERS.order_status = 5) AND ORDERS.user_id = " +
      user_id +
      " GROUP BY ORDERS.order_id, ORDERS.save_money, ORDERS.order_status) AS ABC ON ORDERS.order_id = ABC.order_id ORDER BY order_id ASC",
    {
      type: QueryTypes.SELECT,
    }
  );
  if (result) {
    return { status: true, data: result };
  } else {
    return { status: false, message: "Lấy danh sách thống kê thất bại" };
  }
};
module.exports = {
  getOrderByUserService,
  orderUserUpdateService,
  getOrderBetweenDateService,
  getOrderUserStatisticsService,
};
