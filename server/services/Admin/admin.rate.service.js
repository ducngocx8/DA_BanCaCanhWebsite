const { Op, QueryTypes } = require("Sequelize");
const { Rate, sequelize, Fish } = require("../../models");

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

const getAllRate = async () => {
  const rates = await sequelize.query(
    "SELECT RATES.user_id, RATES.fish_id, FISH.fish_name, RATES.rate_point, RATES.rate_comment, RATES.rate_time, amount FROM RATES INNER JOIN (SELECT fish_id, COUNT (fish_id) AS amount FROM RATES AS R1 GROUP BY fish_id) AS R1 ON R1.fish_id = RATES.fish_id INNER JOIN FISH ON FISH.fish_id = RATES.fish_id ORDER BY RATES.rate_time DESC",
    {
      type: QueryTypes.SELECT,
    })
  return rates;
};

const deleteRateAdminService = async (fish_id, user_id) => {
  const check_rate_exist = await checkRateExist(fish_id, user_id);
  if (check_rate_exist) {
    const delete_result = await deleteRate(fish_id, user_id);
    if (delete_result) {
      const rates_fish = await getAllRate();
      return {
        status: true,
        data: rates_fish,
        message: "Xóa đánh giá thành công.",
      };
    } else {
      return { status: false, message: "Xóa đánh giá thất bại." };
    }
  } else {
    return {
      status: false,
      message: "Không tìm thấy thông tin đánh giá cần xóa.",
    };
  }
};

const getAllRateAdminService = async () => {
  const rates_fish = await getAllRate();
  if (rates_fish) {
    return {
      status: true,
      data: rates_fish,
    };
  } else {
    return {
      status: false,
      message: "Lỗi server. Vui lòng thử lại",
    };
  }
};
module.exports = {
  deleteRateAdminService,
  getAllRateAdminService,
};
