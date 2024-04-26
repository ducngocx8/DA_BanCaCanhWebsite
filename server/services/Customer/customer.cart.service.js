const { Op, Sequelize, QueryTypes } = require("Sequelize");
const {
  User,
  Order,
  OrderDetail,
  Fish_Size,
  Cart,
  Fish,
  sequelize,
  Coupon,
} = require("../../models");
const { sendEmailOrderService } = require("../mail.service");

const checkItemCart = async (user_id, fish_id, size_id) => {
  const cart = await Cart.findOne({
    where: {
      [Op.and]: [
        { user_id: user_id },
        { fish_id: fish_id },
        { size_id: size_id },
      ],
    },
  });
  return cart;
};

// Cập nhật chi tiết đơn hàng
const updateCart = (user_id, fishDetail, status) => {
  // Status = 1: Add, status = 2: Update
  const { fish_id, size_id, amount } = fishDetail;
  let amountObj;
  if (status === 1) {
    amountObj = {
      amount: Sequelize.literal(`amount + ${amount}`),
    };
  } else if (status == 2) {
    amountObj = {
      amount: amount,
    };
  }
  const update_cart_result = Cart.update(amountObj, {
    where: {
      [Op.and]: [
        { user_id: user_id },
        { fish_id: fish_id },
        { size_id: size_id },
      ],
    },
  });
  return update_cart_result;
};

// Check người dùng có sở hữu Cart đó không (Có tồn tại Cart (fish, size, user) của người dùng ABC?)
const checkCartOfUser = async (user_id, fishDetail) => {
  const { fish_id, size_id } = fishDetail;
  const cart_item = await Cart.findOne({
    where: {
      [Op.and]: [
        { fish_id: fish_id },
        { size_id: size_id },
        { user_id: user_id },
      ],
    },
  });
  return cart_item;
};

// Xóa chi tiết đơn hàng
const deleteCartItem = async (user_id, fishDetail) => {
  const { fish_id, size_id } = fishDetail;
  const delete_item_result = Cart.destroy({
    where: {
      [Op.and]: [
        { user_id: user_id },
        { fish_id: fish_id },
        { size_id: size_id },
      ],
    },
  });
  return delete_item_result; // destroy return number 1 or 0
};

// checkFishSize có hợp không
const checkFishSize = async (fishDetail) => {
  const { fish_id, size_id } = fishDetail;
  const checkExist = await Fish_Size.findOne({
    where: {
      [Op.and]: [{ fish_id: fish_id }, { size_id: size_id }],
    },
  });
  return checkExist;
};

// Kiểm tra tồn kho
const checkInventoryInsert = async (user_id, fishDetail, status) => {
  //status = 1: ADD, status = 2: UPDATE
  console.log("ST", status);
  const { fish_id, size_id, amount } = fishDetail;
  const checkCartExist = await checkItemCart(user_id, fish_id, size_id);
  let quanty = 0;
  if (checkCartExist) {
    if (status === 1) {
      quanty += Number(checkCartExist.amount); // Số lượng đã đặt trước đó
    }
  }

  console.log(quanty);
  const fish = await Fish_Size.findOne({
    where: {
      [Op.and]: [{ fish_id: fish_id }, { size_id: size_id }], // Lấy số lượng còn lại
    },
  });

  if (fish) {
    if (quanty + amount > Number(fish.fish_remain)) {
      if (quanty === 0) {
        return {
          status: false,
          message: "Số lượng tồn không đủ, còn lại là: " + fish.fish_remain,
        };
      } else {
        return {
          status: false,
          message:
            "Số lượng tồn không đủ, còn lại là: " +
            fish.fish_remain +
            ", giỏ hàng có " +
            quanty,
        };
      }
    }
  }
  return { status: true };
};

// Thêm Sản phẩm vào giỏ hoặc cập nhật amount
async function insertItem(user_id, fishDetail) {
  const { fish_id, size_id, amount } = fishDetail;
  const checkItem = await checkItemCart(user_id, fish_id, size_id);
  let cart_result;
  if (checkItem) {
    cart_result = await updateCart(user_id, fishDetail, 1);
  } else {
    const cart_default = {
      user_id,
      fish_id,
      size_id,
      amount,
    };
    cart_result = await Cart.create(cart_default);
  }
  return cart_result;
}

const addToCartService = async (user_id, fishDetail) => {
  const result = await insertItem(user_id, fishDetail);
  const new_cart = await getCartByUserService(user_id);
  if (result)
    return {
      status: true,
      data: new_cart,
      message: "Thêm sản phẩm vào giỏ hàng thành công",
    };
  else {
    return {
      status: false,
      message: "Thêm sản phẩm vào giỏ hàng thất bại",
    };
  }
};

const removeFromCartService = async (user_id, fishDetail) => {
  const cart_user = await checkCartOfUser(user_id, fishDetail);
  if (cart_user) {
    const result = await deleteCartItem(user_id, fishDetail);
    const new_cart = await getCartByUserService(user_id);
    if (result) {
      return {
        status: true,
        data: new_cart,
        message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
      };
    }
    return {
      status: false,
      message: "Xóa sản phẩm khỏi giỏ hàng thất bại!",
    };
  } else {
    return {
      status: false,
      message: "Không tìm thấy sản phẩm hoặc đã xóa",
    }; // Không tồn tại mặt hàng trên trong giỏ hàng của người dùng
  }
};

const updateCartService = async (user_id, fishDetail) => {
  const check_fish = await checkFishService(fishDetail.fish_id);
  if (check_fish) {
    if (check_fish.fish_status === false) {
      return {
        status: false,
        message: "Rất tiếc, sản phẩm đã ngừng kinh doanh.",
      };
    }
  }
  const cart_user = await checkCartOfUser(user_id, fishDetail);
  if (cart_user) {
    const check_inventory = await checkInventoryInsert(user_id, fishDetail, 2);
    if (check_inventory.status) {
      const update_cart = await updateCart(user_id, fishDetail, 2);
      if (update_cart) {
        const new_cart = await getCartByUserService(user_id);
        return {
          status: true,
          data: new_cart,
          message: "Cập nhật số lượng sản phẩm thành công.",
        };
      } else {
        return {
          status: true,
          message: "Cập nhật số lượng sản phẩm thất bại.",
        };
      }
    }
    return check_inventory;
  } else {
    return {
      status: false,
      message: "Sản phẩm không thấy trong giỏ hàng, có thể đã bị xóa.",
    }; // Không tồn tại mặt hàng trên trong giỏ hàng của người dùng
  }
};

const getCartByUserService = async (user_id) => {
  const result = await sequelize.query(
    "SELECT CARTS.fish_id, FISH.fish_name, CARTS.user_id, CARTS.size_id, FISH_PRICE.price, CARTS.amount, SIZE.size_name, (SELECT IMAGE.url_image FROM IMAGE WHERE CARTS.fish_id = IMAGE.fish_id LIMIT 1) FROM CARTS INNER JOIN FISH_PRICE ON CARTS.fish_id = FISH_PRICE.fish_id AND CARTS.size_id = FISH_PRICE.size_id INNER JOIN SIZE ON CARTS.size_id = SIZE.size_id INNER JOIN FISH ON CARTS.fish_id = FISH.fish_id WHERE CARTS.user_id = " +
      user_id +
      " ORDER BY CARTS.fish_id ASC,  CARTS.size_id ASC",
    {
      type: QueryTypes.SELECT,
    }
  );
  return result;
};

const checkCouponService = async (coupon_code, user_id) => {
  const coupon = await Coupon.findOne({
    where: {
      [Op.and]: [
        {
          coupon_code: String(coupon_code),
        },
        {
          coupon_expired: {
            [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000), // Hết hạn vào 23h59p59s ngày set
          },
        },
      ],
    },
  });

  if (coupon) {
    const cart_order = await sequelize.query(
      "SELECT FP.fish_id, FI.fish_name, FP.size_id, FP.fish_remain, CT.amount, FP.price FROM FISH AS FI INNER JOIN (SELECT * FROM FISH_PRICE) AS FP ON FI.fish_id = FP.fish_id INNER JOIN (SELECT * FROM CARTS) AS CT ON CT.fish_id = FP.fish_id AND CT.size_id = FP.size_id WHERE user_id = " +
        user_id,
      {
        type: QueryTypes.SELECT,
      }
    );

    let save_money = 0;
    let require_message = "";
    const { discount, min_order, save_money_max, coupon_name, coupon_expired } =
      coupon;
    const sumPrice = sumMoney(cart_order);
    if (sumPrice >= min_order) {
      save_money = (sumPrice * discount) / 100;
      if (save_money > save_money_max) {
        save_money = save_money_max;
      }
      require_message =
        "Áp dụng mã thành công, bạn được giảm " +
        save_money +
        "đ. Cần thanh toán: " +
        (sumPrice - save_money) +
        "đ";
    } else {
      require_message =
        "Chỉ áp dụng cho đơn hàng tối thiểu là " + coupon.min_order + "đ";
    }

    const data = {
      require_message,
      coupon_name,
      discount,
      min_order,
      save_money_max,
      coupon_expired,
    };
    return data;
  } else {
    return false;
  }
};

const createOrder = async (order_orderdetail) => {
  const result = await Order.create(order_orderdetail, {
    include: [{ model: OrderDetail }],
  });
  if (result) {
    return true;
  }
  return false;
};

const checkQuantyOrder = async (user_id) => {
  const cart_order = await sequelize.query(
    "SELECT FP.fish_id, FI.fish_name, FI.fish_status, FP.size_id, FP.fish_remain, CT.amount, FP.price FROM FISH AS FI INNER JOIN (SELECT * FROM FISH_PRICE) AS FP ON FI.fish_id = FP.fish_id INNER JOIN (SELECT * FROM CARTS) AS CT ON CT.fish_id = FP.fish_id AND CT.size_id = FP.size_id WHERE user_id = " +
      user_id,
    {
      type: QueryTypes.SELECT,
    }
  );
  if (cart_order.length !== 0) {
    let message = "";
    let check = true;
    cart_order.forEach((item) => {
      if (!item.fish_status) {
        message += "\n Sản phẩm " + item.fish_name + " đã ngừng kinh doanh.";
        check = false;
      } else if (item.fish_remain < item.amount) {
        message +=
          "\n Số lượng sản phẩm " +
          item.fish_name +
          " không đủ, còn lại " +
          item.fish_remain +
          ".";
        check = false;
      }
    });
    if (check) {
      return { status: true, data: cart_order };
    } else {
      return {
        status: false,
        message: message,
      };
    }
  }
  return {
    status: false,
    message: "Giỏ hàng đang trống, vui lòng kiểm tra lại",
  };
};

const sumMoney = (order_item_list) => {
  let sum = 0;
  order_item_list.forEach((item) => {
    sum += Number(item.amount) * Number(item.price);
  });
  return sum;
};

const deleteAllCartUserService = async (user_id) => {
  const result = await Cart.destroy({
    where: {
      user_id: user_id,
    },
  });
  if (result) {
    return true;
  } else {
    return false;
  }
};

const updateQuantyOrder = async (item) => {
  try {
    const { fish_id, size_id, amount } = item;
    const result = await sequelize.transaction(async (t) => {
      const price = await Fish_Size.update(
        {
          fish_remain: Sequelize.literal(`fish_remain - ${amount}`),
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
    return false;
  }
};

const addOrderService = async (user_id, bodyOrder) => {
  // Lấy danh sách item trong giỏ hàng
  const checkQuanty = await checkQuantyOrder(user_id);
  if (checkQuanty.status) {
    const order_item_list = checkQuanty.data.map((item) => {
      return {
        fish_id: item.fish_id,
        size_id: item.size_id,
        amount: Number(item.amount),
        price: Number(item.price),
      };
    });
    const { address, phonenumber, fullname, coupon_code, note } = bodyOrder;
    // Check mã giảm giá => Tính tiền....
    let save_money = 0;
    const checkCoupon = await checkCouponService(coupon_code, user_id);
    if (checkCoupon) {
      const { discount, min_order, save_money_max } = checkCoupon;
      const sumPrice = sumMoney(order_item_list);
      if (Number(sumPrice) >= Number(min_order)) {
        save_money = (sumPrice * discount) / 100;
        if (save_money > save_money_max) {
          save_money = save_money_max;
        }
      }
    }

    const newOrder = {
      address,
      phonenumber,
      fullname,
      save_money,
      note,
      order_time: Date.now(),
      order_status: 1,
      user_id: user_id,
    };
    const order_orderdetail = {
      ...newOrder,
      OrderDetails: order_item_list,
    };
    const result = await createOrder(order_orderdetail);
    if (result) {
      const deleteCart = await deleteAllCartUserService(user_id);
      if (deleteCart) {
        const new_cart = await getCartByUserService(user_id);
        // UPDATE số lượng tồn kho sau khi mua
        const update_result = await Promise.all(
          order_item_list.map((item) =>
            Promise.resolve(updateQuantyOrder(item))
          )
        );
        if (update_result) {
          console.log("UPDATE QUANTY - SUCCESS");
        }
        await sendEmailOrderService(user_id);
        return {
          status: true,
          data: new_cart,
          message: "Đặt hàng thành công. Cảm ơn quý khách!",
        };
      } else {
        return {
          status: false,
          message: "Đặt hàng thất bại. Vui lòng thực hiện lại sau",
        };
      }
    } else {
      return {
        status: false,
        message: "Đặt hàng thất bại. . Vui lòng thực hiện lại sau",
      };
    }
  } else {
    return checkQuanty;
  }
};

const checkFishService = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const fish = await Fish.findOne({
        where: {
          fish_id,
        },
      });
      return fish;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  addToCartService,
  removeFromCartService,
  checkFishSize,
  checkInventoryInsert,
  updateCartService,
  getCartByUserService,
  addOrderService,
  checkCouponService,
  checkFishService,
};
