const {
  sequelize,
  PriceProduct,
  Fish,
  Fish_Size,
  Size,
  Cart,
  OrderDetail,
} = require("../../models");
const { Op } = require("Sequelize");
const getAll = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const prices = await Fish_Size.findAll({
        where: {
          fish_id: fish_id,
        }, include: [{model: Size}]
      });
      return prices;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetPriceByProductIDService = async (fish_id) => {
  const check_exist = await checkFishIDExist(fish_id);
  if (check_exist === null) {
    return {
      status: false,
      message: "Sản phẩm không tồn tại trên hệ thống",
    };
  } else if (check_exist === false) {
    return {
      status: false,
      message: "Lỗi hệ thống",
    };
  }
  const result = await getAll(fish_id);
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

const checkPriceName = async (size_name, status, image_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      size_name: size_name,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [
        { size_name: size_name },
        { image_id: { [Op.not]: image_id } },
      ],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Price.findOne({
        where: whereObject,
      });
      return category;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkFishIDExist = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await Fish.findOne(
        { where: { fish_id } },
        { transaction: t }
      );
      return product;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkSizeIDExist = async (size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const size = await Size.findOne(
        { where: { size_id } },
        { transaction: t }
      );
      return size;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkFishSizeExist = async (fish_id, size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const fish_size = Fish_Size.findOne({
        where: {
          [Op.and]: [{ fish_id }, { size_id }],
        },
      });
      return fish_size;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addPrice = async (fish_id, sizeBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const price = await Fish_Size.create(
        {
          fish_id,
          size_id: sizeBody.size_id,
          fish_remain: Number(sizeBody.fish_remain),
          price: Number(sizeBody.price),
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

const adminAddPriceService = async (fish_id, sizeBody) => {
  const check_fish = await checkFishIDExist(fish_id);
  if (check_fish !== null) {
    const check_size = await checkSizeIDExist(sizeBody.size_id);
    if (check_size !== null) {
      const check_fish_size = await checkFishSizeExist(
        fish_id,
        sizeBody.size_id
      );
      if (check_fish_size === null) {
        const add_result = await addPrice(fish_id, sizeBody);
        if (add_result) {
          const size_list = await getAll(fish_id);
          return {
            status: true,
            data: size_list,
            message: "Thêm size sản phẩm thành công",
          };
        } else {
          return {
            status: false,
            message: "Thêm size sản phẩm thất bại",
          };
        }
      } else if (check_fish_size !== null) {
        return {
          status: false,
          message: "Sản phẩm và Size đã tồn tại trên sản phẩm",
        };
      } else {
        return {
          status: false,
          message: "Lỗi hệ thống.",
        };
      }
    } else if (check_size === null) {
      return {
        status: false,
        message: "Size_ID không tồn tại trên hệ thống",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_fish === null) {
    return {
      status: false,
      message: "Sản phẩm không tồn tại trên hệ thống",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const deletePrice = async (fish_id, size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const price = await Fish_Size.destroy(
        {
          where: {
            [Op.and]: [{ fish_id }, { size_id }],
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

const checkFishSizeInCart = async (fish_id, size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const cart = await Cart.findOne(
        {
          where: {
            [Op.and]: [{ fish_id }, { size_id }],
          },
        },
        { transaction: t }
      );
      return cart;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const checkFishSizeInOrder = async (fish_id, size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const order_detail = await OrderDetail.findOne(
        {
          where: {
            [Op.and]: [{ fish_id }, { size_id }],
          },
        },
        { transaction: t }
      );
      return order_detail;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminDeletePriceService = async (fish_id, size_id) => {
  const check_fish_size = await checkFishSizeExist(fish_id, size_id);
  if (check_fish_size) {
    const check_sizein_cart = await checkFishSizeInCart(fish_id, size_id);
    if (check_sizein_cart === null) {
      const check_sizein_order = await checkFishSizeInOrder(fish_id, size_id);
      if (check_sizein_order === null) {
        const delete_result = await deletePrice(fish_id, size_id);
        if (delete_result) {
          const price_list = await getAll(fish_id);
          return {
            status: true,
            data: price_list,
            message: "Xóa size sản phẩm thành công",
          };
        } else {
          return {
            status: false,
            message: "Xóa size sản phẩm thất bại",
          };
        }
      } else if (check_sizein_order === false) {
        return {
          status: false,
          message: "Lỗi hệ thống.",
        };
      } else {
        return {
          status: false,
          message:
            "Size và sản phẩm đã nằm trong ít nhất 1 đơn hàng, không thể xóa.",
        };
      }
    } else if (check_sizein_cart === false) {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    } else {
      return {
        status: false,
        message:
          "Size và sản phẩm đã nằm trong ít nhất 1 giỏ hàng, không thể xóa.",
      };
    }
  } else if (check_fish_size === null) {
    return {
      status: false,
      message: "Size không tồn tại hoặc đã xóa trên sản phẩm này.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const updatePrice = async (fish_id, priceBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let { price, fish_remain, size_id } = priceBody;
      const price_update = await Fish_Size.update(
        {
          fish_remain: Number(fish_remain),
          price: Number(price),
        },
        {
          where: {
            [Op.and]: [{ fish_id }, { size_id }],
          },
        },
        { transaction: t }
      );
      return price_update;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminUpdatePriceService = async (fish_id, priceBody) => {
  const check_fish = await checkFishIDExist(fish_id);
  const check_size = await checkSizeIDExist(priceBody.size_id);
  if (check_fish) {
    if (check_size) {
            const check_fish_size = await checkFishSizeExist(
              fish_id,
              priceBody.size_id
            );
            if (check_fish_size) {
              const update_result = await updatePrice(fish_id, priceBody);
              if (update_result) {
                const price_list = await getAll(fish_id);
                return {
                  status: true,
                  data: price_list,
                  message: "Cập nhật thông tin size sản phẩm thành công",
                };
              } else {
                return {
                  status: false,
                  message: "Cập nhật thông tin size sản phẩm thất bại",
                };
              }
            } else if (check_fish_size === false) {
              return {
                status: false,
                message: "Lỗi hệ thống.",
              };
            } else {
              return {
                status: false,
                message: "Thông tin Size không tồn tại trong sản phẩm này.",
              };
            }
    } else if (check_size === false) {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    } else {
      return {
        status: false,
        message: "Size không tồn tại trên hệ thống",
      };
    }
  } else if (check_fish === false) {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Sản phẩm không tồn tại trên hệ thống",
    };
  }
};

module.exports = {
  adminGetPriceByProductIDService,
  adminAddPriceService,
  adminDeletePriceService,
  adminUpdatePriceService,
};
