const { Categories, sequelize, Fish } = require("../../models");
const { Op } = require("Sequelize");
const getAll = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const categories = await Categories.findAll({
        order: [["category_id", "ASC"]],
      });
      return categories;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminGetAllCategoryService = async () => {
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

const checkCategoryName = async (category_name, status, category_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      category_name: category_name,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [
        { category_name: category_name },
        { category_id: { [Op.not]: category_id } },
      ],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Categories.findOne({
        where: whereObject,
      });
      return category;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addCategory = async (category_name) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const categories = await Categories.create(
        {
          category_name: category_name,
        },
        { transaction: t }
      );
      return categories;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminAddCategoryService = async (category_name) => {
  category_name = category_name.trim();
  const check_category = await checkCategoryName(category_name, 1, -1);
  if (check_category === null) {
    const add_result = await addCategory(category_name);
    if (add_result) {
      const category_list = await getAll();
      return {
        status: true,
        data: category_list,
        message: "Thêm danh mục thành công",
      };
    } else {
      return {
        status: false,
        message: "Thêm danh mục thất bại",
      };
    }
  } else if (check_category !== null) {
    return {
      status: false,
      message: "Tên danh mục đã tồn tại trên hệ thống",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const checkCategoryID = async (category_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Categories.findOne({
        where: {
          category_id,
        },
      });
      return category;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkCategoryHasProduct = async (category_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const fish = await Fish.findOne({
        where: {
          category_id,
        },
      });
      return fish;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const deleteCategory = async (category_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Categories.destroy(
        {
          where: {
            category_id: Number(category_id),
          },
        },
        { transaction: t }
      );
      return category;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminDeleteCategoryService = async (category_id) => {
  const check_category_id = await checkCategoryID(category_id);
  if (check_category_id) {
    const check_category_product = await checkCategoryHasProduct(category_id);
    if (check_category_product === null) {
      const delete_result = await deleteCategory(category_id);
      if (delete_result) {
        const category_list = await getAll();
        return {
          status: true,
          data: category_list,
          message: "Xóa danh mục thành công",
        };
      } else {
        return {
          status: false,
          message: "Xóa danh mục thất bại",
        };
      }
    } else if (check_category_product !== null) {
      return {
        status: false,
        message: "Đang có sản phẩm trong danh mục. Không thể xóa",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_category_id === null) {
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

const updateCategory = async (category_id, category_name) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Categories.update(
        {
          category_name,
        },
        {
          where: {
            [Op.and]: [{ category_id }],
          },
        },
        { transaction: t }
      );
      return category;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminUpdateCategoryService = async (category_id, category_name) => {
  const check_category_id = await checkCategoryID(category_id);
  if (check_category_id) {
    const check_name = await checkCategoryName(category_name, 2, category_id);
    if (check_name === null) {
      const update_result = await updateCategory(category_id, category_name);
      if (update_result) {
        const category_list = await getAll();
        return {
          status: true,
          data: category_list,
          message: "Cập nhật thông tin danh mục thành công",
        };
      } else {
        return {
          status: false,
          message: "Cập nhật thông tin danh mục thất bại",
        };
      }
    } else if (check_name !== null) {
      return {
        status: false,
        message: "Tên danh mục đã tồn tại trên hệ thống.",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_category_id === null) {
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
  adminGetAllCategoryService,
  adminAddCategoryService,
  adminDeleteCategoryService,
  adminUpdateCategoryService,
};
