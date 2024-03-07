const { sequelize, UserRole, User, Role } = require("../../models");
const { Op } = require("Sequelize");
const getAll = async (user_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role_user_list = await UserRole.findAll({
        where: {
          user_id: user_id,
        },
        include: [
          {
            model: Role,
          },
        ],
        order: [["role_id", "ASC"]],
      });
      return role_user_list;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetRoleUserByUserIDService = async (user_id) => {
  const check_exist = await checkUserIDExist(user_id);
  if (check_exist === null) {
    return {
      status: false,
      message: "User không tồn tại trên hệ thống",
    };
  } else if (check_exist === false) {
    return {
      status: false,
      message: "Lỗi hệ thống",
    };
  }
  const result = await getAll(user_id);
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

const checkUserIDExist = async (user_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await User.findOne(
        { where: { user_id } },
        { transaction: t }
      );
      return product;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkRoleIDExist = async (role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const size = await Role.findOne(
        { where: { role_id } },
        { transaction: t }
      );
      return size;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkUserRoleExist = async (user_id, role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user_role = UserRole.findOne({
        where: {
          [Op.and]: [{ user_id }, { role_id }],
        },
      });
      return user_role;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addRoleUser = async (user_id, role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role_user = await UserRole.create(
        {
          user_id,
          role_id,
        },
        { transaction: t }
      );
      return role_user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminAddRoleUserService = async (user_id, role_id) => {
  const list_check = [
    Promise.resolve(checkUserIDExist(user_id)),
    Promise.resolve(checkRoleIDExist(role_id)),
    Promise.resolve(checkUserRoleExist(user_id, role_id)),
  ];

  const check_result = await Promise.all(list_check);
  if (check_result[0] === null) {
    return {
      status: false,
      message: "User không tồn tại trên hệ thống",
    };
  } else if (check_result[1] === null) {
    return {
      status: false,
      message: "Quyền hạn không tồn tại trên hệ thống",
    };
  } else if (check_result[2] !== null) {
    return {
      status: false,
      message: "Bạn đã thêm quyền hạn này cho user trước đó (Đã tồn tại)",
    };
  }

  if (
    check_result[0] === false ||
    check_result[1] === false ||
    check_result[2] === false
  ) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    };
  }

  const add_result = await addRoleUser(user_id, role_id);
  if (add_result) {
    const user_role_list = await getAll(user_id);
    return {
      status: true,
      data: user_role_list,
      message: "Thêm quyền hạn cho user thành công",
    };
  } else {
    return {
      status: false,
      message: "Thêm quyền hạn cho user thất bại",
    };
  }
};

const deleteRoleUser = async (user_id, role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role_user = await UserRole.destroy(
        {
          where: {
            [Op.and]: [{ user_id }, { role_id }],
          },
        },
        { transaction: t }
      );
      return role_user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminDeleteRoleUserService = async (user_id, role_id) => {
  const check_user_role = await checkUserRoleExist(user_id, role_id);
  if (check_user_role) {
    const delete_result = await deleteRoleUser(user_id, role_id);
    if (delete_result) {
      const role_user_list = await getAll(user_id);
      return {
        status: true,
        data: role_user_list,
        message: "Xóa quyền hạn người dùng thành công",
      };
    } else {
      return {
        status: false,
        message: "Xóa quyền hạn người dùng thất bại",
      };
    }
  } else if (check_user_role === false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    };
  } else {
    return {
      status: false,
      message:
        "Quyền hạn đã xóa trước đó hoặc không tồn tại với người dùng này",
    };
  }
};

module.exports = {
  adminGetRoleUserByUserIDService,
  adminAddRoleUserService,
  adminDeleteRoleUserService,
};
