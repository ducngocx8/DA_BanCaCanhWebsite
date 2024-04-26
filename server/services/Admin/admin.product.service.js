const {
  Fish,
  sequelize,
  Categories,
  ImageProduct,
  Size,
  Fish_Size,
} = require("../../models");
const { Op } = require("Sequelize");
const getAll = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const products = await Fish.findAll({
        include: [
          { model: Categories },
          { model: ImageProduct },
          { model: Size },
          {
            model: Fish_Size,
          },
        ],
        order: [["fish_id", "ASC"]],
      });
      return products;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetAllProductService = async () => {
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

const checkProductName = async (fish_name, status, fish_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      fish_name: fish_name,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [{ fish_name: fish_name }, { fish_id: { [Op.not]: fish_id } }],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await Fish.findOne({
        where: whereObject,
      });
      return product;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addProduct = async (fishBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let {
        fish_name,
        fish_description,
        fish_status,
        ph,
        temperature,
        food,
        behavior,
        origin,
        category_id,
        imageList,
        FishPrices,
      } = fishBody;

      fish_name = fish_name.trim();
      fish_description
        ? (fish_description = fish_description.trim())
        : (fish_description = "Đang cập nhật");
      ph ? (ph = ph.trim()) : (ph = "Đang cập nhật");
      temperature ? (temperature = temperature.trim()) : "";
      food ? (food = food.trim()) : (food = "Đang cập nhật");
      behavior ? (behavior = behavior.trim()) : (behavior = "Đang cập nhật");
      origin ? (origin = origin.trim()) : (origin = "Đang cập nhật");
      const product = await Fish.create(
        {
          fish_name: fish_name,
          fish_name,
          fish_description,
          fish_status,
          ph,
          temperature,
          food,
          behavior,
          origin,
          category_id,
          Images: imageList,
          Fish_Prices: FishPrices,
        },
        {
          include: [{ model: ImageProduct }, { model: Fish_Size }],
        },
        { transaction: t }
      );
      return product;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminAddProductService = async (ProductBody) => {
  let { fish_name } = ProductBody;
  fish_name = fish_name.trim();
  const check_product_name = await checkProductName(fish_name, 1, -1);
  if (check_product_name === null) {
    const add_result = await addProduct(ProductBody);
    if (add_result) {
      const product_list = await getAll();
      return {
        status: true,
        data: product_list,
        message: "Thêm sản phẩm thành công",
      };
    } else {
      return {
        status: false,
        message: "Thêm sản phẩm thất bại",
      };
    }
  } else if (check_product_name !== null) {
    return {
      status: false,
      message: "Tên sản phẩm đã tồn tại trên hệ thống",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const checkProductID = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await Fish.findOne({
        where: {
          fish_id,
        },
      });
      return product;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkProductHasProduct = async (fish_id) => {
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
    return false;
  }
};

const deleteProduct = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await Fish.destroy(
        {
          where: {
            fish_id: Number(fish_id),
          },
        },
        { transaction: t }
      );
      return product;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminDeleteProductService = async (fish_id) => {
  const check_fish_id = await checkProductID(fish_id);
  if (check_fish_id) {
    const check_product_product = await checkProductHasProduct(fish_id);
    if (check_product_product === null) {
      const delete_result = await deleteProduct(fish_id);
      if (delete_result) {
        const product_list = await getAll();
        return {
          status: true,
          data: product_list,
          message: "Xóa sản phẩm thành công",
        };
      } else {
        return {
          status: false,
          message: "Xóa sản phẩm thất bại",
        };
      }
    } else if (check_product_product !== null) {
      return {
        status: false,
        message: "Đang có sản phẩm trong sản phẩm. Không thể xóa",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_fish_id === null) {
    return {
      status: false,
      message: "Danh mục không tồn tại trên hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const updateProduct = async (fish_id, productBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let {
        fish_name,
        fish_description,
        fish_status,
        ph,
        temperature,
        food,
        behavior,
        origin,
        category_id
      } = productBody;

      fish_name = fish_name.trim();
      fish_description
        ? (fish_description = fish_description.trim())
        : (fish_description = "Đang cập nhật");
      ph ? (ph = ph.trim()) : (ph = "Đang cập nhật");
      temperature ? (temperature = temperature.trim()) : "";
      food ? (food = food.trim()) : (food = "Đang cập nhật");
      behavior ? (behavior = behavior.trim()) : (behavior = "Đang cập nhật");
      origin ? (origin = origin.trim()) : (origin = "Đang cập nhật");
      const product = await Fish.update(
        {
          fish_name: fish_name,
          fish_name,
          fish_description,
          fish_status,
          ph,
          temperature,
          food,
          behavior,
          origin,
          fish_id,
          category_id,
        },
        {
          where: {
            fish_id,
          },
        },
        { transaction: t }
      );
      return product;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminUpdateProductService = async (fish_id, productBody) => {
  const check_fish_id = await checkProductID(fish_id);
  if (check_fish_id) {
    const product_name = productBody.fish_name.trim();
    const check_name = await checkProductName(product_name, 2, fish_id);
    if (check_name === null) {
      const update_result = await updateProduct(fish_id, productBody);
      if (update_result) {
        const product_list = await getAll();
        return {
          status: true,
          data: product_list,
          message: "Cập nhật thông tin sản phẩm thành công",
        };
      } else {
        return {
          status: false,
          message: "Cập nhật thông tin sản phẩm thất bại",
        };
      }
    } else if (check_name !== null) {
      return {
        status: false,
        message: "Tên sản phẩm đã tồn tại trên hệ thống.",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_fish_id === null) {
    return {
      status: false,
      message: "Danh mục không tồn tại trên hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

module.exports = {
  adminGetAllProductService,
  adminAddProductService,
  adminDeleteProductService,
  adminUpdateProductService,
};
