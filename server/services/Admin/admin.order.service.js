const {
  Order,
  sequelize,
  OrderDetail,
  ImageProduct,
  Categories,
  Fish,
  Size,
  User,
  Fish_Size,
} = require("../../models");
const { Op, QueryTypes } = require("Sequelize");
const getAll = async () => {
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
        order: [["order_id", "DESC"]],
      });
      return orders;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetAllOrderService = async () => {
  const result = await getAll();
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

const checkOrderID = async (order_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const order = await Order.findOne({
        where: {
          order_id,
        },
      });
      return order;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const updateRemainProduct = async (order_id, order_status) => {};

const updateOrder = async (order_id, orderInfo) => {
  try {
    let { address, fullname, phonenumber, email, order_status, note } =
      orderInfo;
    address = String(address).trim();
    fullname = String(fullname).trim();
    note = String(note).trim();
    const result = await sequelize.transaction(async (t) => {
      let order = await Order.update(
        {
          address,
          fullname,
          phonenumber,
          order_status,
          email,
          note,
        },
        {
          where: {
            order_id: order_id,
          },
        },
        { transaction: t }
      );
      if (orderInfo.order_status === 6) {
        order = await updateRemainProduct(order_id, orderInfo.order_status);
      }
      return order;
    });

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getOrderDetailByCartID = async (order_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const items = await OrderDetail.findAll({
        where: {
          order_id,
        },
      });
      return items;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const updateQuantyOrder = async (item, status) => {
  //1: ADD, 2:SUB
  const { fish_id, size_id, amount } = item;
  let query = "";
  if (status === 1) {
    query = sequelize.literal(`fish_remain + ${amount}`);
  } else {
    query = sequelize.literal(`fish_remain - ${amount}`);
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const price = await Fish_Size.update(
        {
          fish_remain: query,
        },
        {
          where: {
            fish_id,
            size_id,
          },
        },
        { transaction: t }
      );
      return price;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const checkQuantyOrderDetailBeforeUpdate = async (items) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const fish_sizes = await Fish_Size.findAll({
        include: [
          {
            model: Fish,
          },
          {
            model: Size,
          },
        ],
      });
      let check = true;
      let message = "";
      for (let i = 0; i < fish_sizes.length; i++) {
        for (let j = 0; j < items.length; j++) {
          if (
            fish_sizes[i].fish_id === items[j].fish_id &&
            fish_sizes[i].size_id === items[j].size_id
          ) {
            if (fish_sizes[i].fish_remain < items[j].amount) {
              message +=
                "Sản phẩm " +
                fish_sizes[i].Fish.fish_name +
                ", size " +
                fish_sizes[i].Size.size_name +
                " không đủ số lượng tồn, còn lại là " +
                fish_sizes[i].fish_remain +
                ".\n";
              check = false;
            }
          }
        }
      }
      const order_list = await getAll();
      return {
        status: check,
        message: message,
        data: order_list,
      };
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminUpdateOrderService = async (order_id, orderInfo) => {
  const check_order_id = await checkOrderID(order_id);
  if (check_order_id) {
    const items = await getOrderDetailByCartID(order_id);
    console.log("items", items);
    if (
      (Number(check_order_id.order_status) === 6 ||
        Number(check_order_id.order_status) === 8) &&
      Number(orderInfo.order_status) !== 6 &&
      Number(orderInfo.order_status) !== 8
    ) {
      const check_quanty = await checkQuantyOrderDetailBeforeUpdate(items);
      if (check_quanty.status === false) {
        return check_quanty;
      }
    }
    const update_result = await updateOrder(order_id, orderInfo);
    if (update_result) {
      if (
        Number(check_order_id.order_status) !== 6 &&
        Number(check_order_id.order_status) !== 8 &&
        (Number(orderInfo.order_status) === 6 ||
          Number(orderInfo.order_status) === 8)
      ) {
        const update_quanty = await Promise.all(
          items.map((item) => Promise.resolve(updateQuantyOrder(item, 1)))
        );
        if (update_quanty) {
          console.log("update_quanty", update_quanty);
          console.log("CẬP NHẬT QUANTY + thành công.");
        }
      } else if (
        (Number(check_order_id.order_status) === 6 ||
          Number(check_order_id.order_status) === 8) &&
        Number(orderInfo.order_status) !== 6 &&
        Number(orderInfo.order_status) !== 8
      ) {
        const update_quanty = await Promise.all(
          items.map((item) => Promise.resolve(updateQuantyOrder(item, 2)))
        );
        if (update_quanty) {
          console.log("update_quanty", update_quanty);
          console.log("CẬP NHẬT QUANTY - thành công.");
        }
      }
      const order_list = await getAll();
      return {
        status: true,
        data: order_list,
        message: "Cập nhật đơn hàng thành công",
      };
    } else {
      return {
        status: false,
        message: "Cập nhật đơn hàng thất bại",
      };
    }
  } else if (check_order_id === null) {
    return {
      status: false,
      message: "Đơn hàng không tồn tại trên hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const getByDate = async (startDate, endDate) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const orders = await Order.findAll({
        where: {
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
    return false;
  }
};

const adminGetOrderByDateService = async (startDate, endDate) => {
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

const adminGetOrderByStatusService = async (order_status) => {
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
          order_status: order_status,
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

module.exports = {
  adminGetAllOrderService,
  adminUpdateOrderService,
  adminGetOrderByDateService,
  adminGetOrderByStatusService,
};
