const { Op } = require("Sequelize");
const {
  sequelize,
  Fish,
  OrderDetail,
  Order,
  Rate,
  User,
} = require("../../models");

const getRateByFishIDService = (fish_id) => {
  const rates = Rate.findAll({
    where: {
      fish_id: fish_id,
    },
    include: [{ model: User, attributes: ["user_id", "username"] }],
  });
  return rates;
};
const checkFishExist = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const fish = Fish.findOne(
        {
          where: {
            fish_id: Number(fish_id),
          },
        },
        { transaction: t }
      );
      return fish;
    });
    return result;
  } catch (error) {}
};

const checkBuy = async (fish_id, user_id) => {
  const orderDetail = OrderDetail.findOne({
    where: {
      fish_id: fish_id,
      "$Order.user_id$": user_id,
      "$Order.order_status$": 5,
    },
    include: [{ model: Order }],
  });
  return orderDetail;
};

const createRate = async (rate_point, rate_comment, fish_id, user_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const rateObject = {
        rate_comment: rate_comment,
        fish_id: fish_id,
        rate_point: Number(rate_point),
        rate_time: Date.now(),
        user_id: user_id,
      };
      const rate = Rate.create(rateObject, { transaction: t });
      return rate;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const updateRate = async (rate_point, rate_comment, fish_id, user_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const rateObject = {
        rate_comment: rate_comment,
        rate_point: Number(rate_point),
        rate_time: Date.now(),
      };
      const rate = Rate.update(
        rateObject,
        {
          where: {
            [Op.and]: [{ user_id: user_id }, { fish_id: fish_id }],
          },
        },
        { transaction: t }
      );
      return rate;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const deleteRate = async (fish_id, user_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const rate = Rate.destroy(
        {
          where: {
            [Op.and]: [{ user_id: user_id }, { fish_id: fish_id }],
          },
        },
        { transaction: t }
      );
      return rate;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkRateExist = (fish_id, user_id) => {
  const rate = Rate.findOne({
    where: {
      [Op.and]: [{ fish_id: fish_id }, { user_id: user_id }],
    },
  });
  return rate;
};

const addRateUserService = async (rate, user_id) => {
  const { rate_point, rate_comment, fish_id } = rate;
  const check_exist_fish = await checkFishExist(fish_id);
  if (check_exist_fish) {
    const check_buy = await checkBuy(fish_id, user_id);
    if (check_buy) {
      const check_rate_exist = await checkRateExist(fish_id, user_id);
      if (check_rate_exist) {
        const update_result = await updateRate(
          rate_point,
          rate_comment,
          fish_id,
          user_id
        );
        if (update_result) {
          const rates_fish = await getRateByFishIDService(fish_id);
          return {
            status: true,
            data: rates_fish,
            message: "Cập nhật đánh giá thành công!",
          };
        } else {
          return {
            status: false,
            message: "Cập nhật đánh giá thất bại!",
          };
        }
      } else {
        const add_result = await createRate(
          rate_point,
          rate_comment,
          fish_id,
          user_id
        );
        if (add_result) {
          const rates_fish = await getRateByFishIDService(fish_id);
          return {
            status: true,
            data: rates_fish,
            message: "Đánh giá sản phẩm thành công!",
          };
        } else {
          return {
            status: false,
            message: "Đánh giá sản phẩm thất bại!",
          };
        }
      }
    } else {
      return {
        status: false,
        message: "Bạn chưa mua hàng thành công, không thể đánh giá sản phẩm.",
      };
    }
  } else {
    return {
      status: false,
      message: "Không tìm thấy sản phẩm đang đánh giá.",
    };
  }
};

const deleteRateByFishIDService = async (fish_id, user_id) => {
  const check_rate_exist = await checkRateExist(fish_id, user_id);
  if (check_rate_exist) {
    const delete_result = await deleteRate(fish_id, user_id);
    if (delete_result) {
      const rates_fish = await getRateByFishIDService(fish_id);
      return {
        status: true,
        data: rates_fish,
        message: "Xóa đánh giá thành công.",
      };
    } else {
      return { status: false, message: "Xóa đánh giá thất bại." };
    }
  } else {
    return { status: false, message: "Bạn chưa đánh giá sản phẩm này." };
  }
};


module.exports = {
  addRateUserService,
  getRateByFishIDService,
  deleteRateByFishIDService,
};
