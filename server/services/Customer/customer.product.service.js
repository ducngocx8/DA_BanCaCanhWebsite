const { Op, QueryTypes } = require("Sequelize");

const {
  Fish,
  Categories,
  ImageProduct,
  Fish_Size,
  Size,
  User,
  Rate,
  sequelize,
} = require("../../models");

const getAll = async () => {
  const product = await Fish.findAll({
    include: [
      { model: Categories },
      { model: ImageProduct },
      { model: Size },
      {
        model: Fish_Size,
      },
    ],
    order: [["fish_id", "DESC"]],
  });
  return product;
};

async function getOneBuy() {}
const getDetail = async (fish_id) => {
  const product = await Fish.findOne({
    include: [
      { model: Categories },
      { model: ImageProduct },
      { model: Size },
      { model: Rate, include: [{ model: User }] },
    ],
    where: { fish_id: fish_id },
  });
  return product;
};

const getResultSearch = async (keyword) => {
  keyword = keyword.toLowerCase().trim();
   try {
     const result = await sequelize.transaction(async (t) => {
       const fish = await sequelize.query(
         "SELECT FISH.fish_id, FISH.fish_name, FISH.fish_status, (SELECT url_image FROM IMAGE WHERE FISH.fish_id = IMAGE.fish_id LIMIT 1), (SELECT category_name FROM CATEGORIES WHERE CATEGORIES.category_id = FISH.category_id), (SELECT FISH_PRICE.price FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1), (SELECT FISH_PRICE.size_id FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1)  FROM FISH WHERE LOWER(fish_name) LIKE '%" +
           keyword +
           "%' OR LOWER(ph) LIKE '%" +
           keyword +
           "%' OR LOWER(temperature) LIKE '%" +
           keyword +
           "%' OR LOWER(food) LIKE '%" +
           keyword +
           "%' OR LOWER(behavior) LIKE '%" +
           keyword +
           "%' OR LOWER(origin) LIKE '%" +
           keyword +
           "%' or LOWER(fish_description) LIKE '%" +
           keyword +
           "%'",
         {
           type: QueryTypes.SELECT,
         }
       );
     return fish;
     });
     return result;
   } catch (error) {
     return false;
   }
};

const getTopBuyProductService = async () => {
  const t = await sequelize.transaction();
  try {
    const result = await sequelize.query(
      "SELECT FISH.fish_id, FISH.fish_name, TOPBUY.amount, (SELECT url_image FROM IMAGE WHERE FISH.fish_id = IMAGE.fish_id LIMIT 1), (SELECT category_name FROM CATEGORIES WHERE CATEGORIES.category_id = FISH.category_id), (SELECT FISH_PRICE.price FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1) FROM FISH  INNER JOIN ( SELECT ORDER_DETAILS.fish_id, SUM(ORDER_DETAILS.amount) AS amount FROM ORDERS INNER JOIN ORDER_DETAILS ON ORDERS.order_id = ORDER_DETAILS.order_id WHERE EXTRACT(YEAR FROM ORDERS.order_time) = 2023 GROUP BY fish_id) AS TOPBUY ON FISH.fish_id = TOPBUY.fish_id WHERE FISH.fish_status = TRUE ORDER BY amount DESC LIMIT 4",
      {
        type: QueryTypes.SELECT,
      }
    );
    await t.commit();
    console.log(result);
    if (result) {
      return { status: true, data: result };
    } else {
      return { status: false, message: "Lấy danh sách TopBuy thất bại" };
    }
  } catch (error) {
    await t.rollback();
    return { status: false, message: "Lỗi Server" };
  }
};
const getProductsByCategoryService = async (category_id) => {
  const t = await sequelize.transaction();
  try {
    const result = await sequelize.query(
      "SELECT FISH.fish_id, FISH.fish_name, FISH.fish_status, (SELECT url_image FROM IMAGE WHERE FISH.fish_id = IMAGE.fish_id LIMIT 1), (SELECT category_name FROM CATEGORIES WHERE CATEGORIES.category_id = FISH.category_id), (SELECT FISH_PRICE.price FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1), (SELECT FISH_PRICE.size_id FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1) FROM FISH WHERE FISH.category_id = " +
        category_id +
        " ORDER BY FISH.fish_id ASC LIMIT 4",
      {
        type: QueryTypes.SELECT,
      }
    );
    await t.commit();
    return {
      status: true,
      data: result,
    };
  } catch (error) {
    await t.rollback();
    return { status: false, message: "Lỗi Server" };
  }
};

const getRandomProductService = async () => {
  const t = await sequelize.transaction();
  try {
    const result = await sequelize.query(
      "SELECT FISH.fish_id, FISH.fish_name, (SELECT url_image FROM IMAGE WHERE FISH.fish_id = IMAGE.fish_id LIMIT 1), (SELECT category_name FROM CATEGORIES WHERE CATEGORIES.category_id = FISH.category_id), (SELECT FISH_PRICE.price FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1), (SELECT FISH_PRICE.size_id FROM FISH_PRICE WHERE FISH.fish_id = FISH_PRICE.fish_id ORDER BY FISH_PRICE.price LIMIT 1) FROM FISH WHERE FISH.fish_status = TRUE ORDER BY RANDOM() LIMIT 4",
      {
        type: QueryTypes.SELECT,
      }
    );
    await t.commit();
    return {
      status: true,
      data: result,
    };
  } catch (error) {
    await t.rollback();
    return { status: false, message: "Lỗi Server" };
  }
};

module.exports = {
  getAll,
  getOneBuy,
  getDetail,
  getResultSearch,
  getTopBuyProductService,
  getProductsByCategoryService,
  getRandomProductService,
};
