const { Size, sequelize, Fish, Fish_Size } = require("../../models");
const { Op } = require("Sequelize");
const getAll = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const sizes = await Size.findAll({
        order: [["size_id", "ASC"]],
      });
      return sizes;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminGetAllSizeService = async () => {
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

const checkSizeName = async (size_name, status, size_id) => {
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
        { size_id: { [Op.not]: size_id } },
      ],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Size.findOne({
        where: whereObject,
      });
      return category;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addSize = async (size_name) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const sizes = await Size.create(
        {
          size_name: size_name,
        },
        { transaction: t }
      );
      return sizes;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminAddSizeService = async (size_name) => {
  size_name = size_name.trim();
  const check_category = await checkSizeName(size_name, 1, -1);
  if (check_category === null) {
    const add_result = await addSize(size_name);
    if (add_result) {
      const category_list = await getAll();
      return {
        status: true,
        data: category_list,
        message: "Thêm size thành công",
      };
    } else {
      return {
        status: true,
        message: "Thêm size thất bại",
      };
    }
  } else if (check_category !== null) {
    return {
      status: false,
      message: "Tên size đã tồn tại trên hệ thống",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const checkSizeID = async (size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Size.findOne({
        where: {
          size_id,
        },
      });
      return category;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkSizeHasProduct = async (size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const fish = await Fish_Size.findOne({
        where: {
          size_id,
        },
      });
      return fish;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const deleteSize = async (size_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Size.destroy(
        {
          where: {
            size_id: Number(size_id),
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

const adminDeleteSizeService = async (size_id) => {
  const check_size_id = await checkSizeID(size_id);
  if (check_size_id) {
    const check_category_product = await checkSizeHasProduct(size_id);
    if (check_category_product === null) {
      const delete_result = await deleteSize(size_id);
      if (delete_result) {
        const category_list = await getAll();
        return {
          status: true,
          data: category_list,
          message: "Xóa size thành công",
        };
      } else {
        return {
          status: false,
          message: "Xóa size thất bại",
        };
      }
    } else if (check_category_product !== null) {
      return {
        status: false,
        message: "Size đang có sản phẩm. Không thể xóa",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_size_id === null) {
    return {
      status: false,
      message: "Size không tồn tại trên hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const updateSize = async (size_id, size_name) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await Size.update(
        {
          size_name,
        },
        {
          where: {
            [Op.and]: [{ size_id }],
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

const adminUpdateSizeService = async (size_id, size_name) => {
  const check_size_id = await checkSizeID(size_id);
  if (check_size_id) {
    const check_name = await checkSizeName(size_name, 2, size_id);
    if (check_name === null) {
      const update_result = await updateSize(size_id, size_name);
      if (update_result) {
        const category_list = await getAll();
        return {
          status: true,
          data: category_list,
          message: "Cập nhật thông tin size thành công",
        };
      } else {
        return {
          status: false,
          message: "Cập nhật thông tin size thất bại",
        };
      }
    } else if (check_name !== null) {
      return {
        status: false,
        message: "Tên size đã tồn tại trên hệ thống.",
      };
    } else {
      return {
        status: false,
        message: "Lỗi hệ thống.",
      };
    }
  } else if (check_size_id === null) {
    return {
      status: false,
      message: "Size không tồn tại trên hệ thống.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

module.exports = {
  adminGetAllSizeService,
  adminAddSizeService,
  adminDeleteSizeService,
  adminUpdateSizeService,
};
