const { sequelize, ImageProduct, Fish } = require("../../models");
const { Op } = require("Sequelize");
const getAll = async (fish_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const images = await ImageProduct.findAll({
        where: {
          fish_id: fish_id,
        },
        order: [["image_id", "ASC"]],
      });
      return images;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetImageByProductIDService = async (fish_id) => {
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

const addImage = async (fish_id, url_image) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const image = await ImageProduct.create(
        {
          fish_id,
          url_image,
        },
        { transaction: t }
      );
      return image;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const adminAddImageService = async (fish_id, url_image) => {
  const check_fish = await checkFishIDExist(fish_id);
  if (check_fish !== null) {
    const add_result = await addImage(fish_id, url_image);
    if (add_result) {
      const fish_list = await getAll(fish_id);
      return {
        status: true,
        data: fish_list,
        message: "Thêm hình ảnh thành công",
      };
    } else {
      return {
        status: false,
        message: "Thêm hình ảnh thất bại",
      };
    }
  } else if (check_category === null) {
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

const checkImageID = async (fish_id, image_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const image = await ImageProduct.findOne({
        where: {
          image_id,
          fish_id,
        },
      });
      return image;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteImage = async (fish_id, image_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const image = await ImageProduct.destroy(
        {
          where: {
            [Op.and]: [{ image_id }, { fish_id }],
          },
        },
        { transaction: t }
      );
      return image;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminDeleteImageService = async (fish_id, image_id) => {
  const check_image_id = await checkImageID(fish_id, image_id);
  if (check_image_id) {
    const delete_result = await deleteImage(fish_id, image_id);
    if (delete_result) {
      const image_list = await getAll(fish_id);
      return {
        status: true,
        data: image_list,
        message: "Xóa hình ảnh sản phẩm thành công",
      };
    } else {
      return {
        status: false,
        message: "Xóa hình ảnh sản phẩm thất bại",
      };
    }
  } else if (check_image_id === null) {
    return {
      status: false,
      message: "Hình ảnh không tồn tại hoặc đã xóa trên sản phẩm này.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

const updateImage = async (fish_id, imageBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      let { url_image, image_id } = imageBody;
      url_image = imageBody.url_image.trim();
      const category = await ImageProduct.update(
        {
          url_image,
        },
        {
          where: {
            [Op.and]: [{ image_id }, { fish_id }],
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

const adminUpdateImageService = async (fish_id, imageBody) => {
  const check_image_id = await checkImageID(fish_id, imageBody.image_id);
  if (check_image_id) {
    const update_result = await updateImage(fish_id, imageBody);
    if (update_result) {
      const category_list = await getAll(fish_id);
      return {
        status: true,
        data: category_list,
        message: "Cập nhật thông tin hình ảnh sản phẩm thành công",
      };
    } else {
      return {
        status: false,
        message: "Cập nhật thông tin hình ảnh sản phẩm thất bại",
      };
    }
  } else if (check_image_id === null) {
    return {
      status: false,
      message: "Hình ảnh không tồn tại trong sản phẩm này.",
    };
  } else {
    return {
      status: false,
      message: "Lỗi hệ thống.",
    };
  }
};

module.exports = {
  adminGetImageByProductIDService,
  adminAddImageService,
  adminDeleteImageService,
  adminUpdateImageService,
};
