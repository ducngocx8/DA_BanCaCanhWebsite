const { sequelize, UserRole, User, Role } = require("../../models");
const { Op } = require("Sequelize");
const getAll = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role_list = await Role.findAll({
        order: [["role_id", "ASC"]],
      });
      return role_list;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetALLRoleService = async (user_id) => {
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

const checkRoleCodeExist = async (role_code, status, role_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      role_code: role_code,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [{ role_code: role_code }, { role_id: { [Op.not]: role_id } }],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const role = await Role.findOne(
        { where: whereObject },
        { transaction: t }
      );
      return role;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkRoleExist = async (role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role = Role.findOne({
        where: {
          role_id,
        },
      });
      return role;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkRoleUserUsed = async (role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user_role = UserRole.findOne({
        where: {
          role_id,
        },
      });
      return user_role;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const addRole = async (roleBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role = await Role.create(
        {
          role_code: roleBody.role_code.trim(),
          role_name: roleBody.role_name.trim(),
        },
        { transaction: t }
      );
      return role;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminAddRoleService = async (roleBody) => {
  const role_code = roleBody.role_code.trim();
  const check_role_code = await checkRoleCodeExist(role_code, 1, -1);
  if (check_role_code === null) {
    const add_result = await addRole(roleBody);
    if (add_result) {
      const roles = await getAll();
      return {
        status: true,
        data: roles,
        message: "Thêm quyền hạn mới thành công",
      };
    } else {
      return {
        status: false,
        message: "Thêm quyền hạn mới thất bại",
      };
    }
  } else if (check_role_code === false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
    };
  } else {
    return {
      status: false,
      message: "Mã Role đã tồn tại trên hệ thống.",
    };
  }
};

const deleteRole = async (role_id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const role = await Role.destroy(
        {
          where: {
            role_id,
          },
        },
        { transaction: t }
      );
      return role;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminDeleteRoleService = async (role_id) => {
  const list_check = [
    Promise.resolve(checkRoleExist(role_id)),
    Promise.resolve(checkRoleUserUsed(role_id)),
  ];
  const check_result = await Promise.all(list_check);
  if (check_result[0] === null) {
    return {
      status: false,
      message: "Quyền hạn đã xóa trước đó hoặc không tồn tại",
    };
  } else if (check_result[1] !== null) {
    return {
      status: false,
      message: "Đã có người dùng đang nắm quyền hạn này, không thể xóa",
    };
  }
  if (check_result[0] === false || check_result[1] === false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    };
  }

  const delete_result = await deleteRole(role_id);
  if (delete_result) {
    const role_list = await getAll();
    return {
      status: true,
      data: role_list,
      message: "Xóa quyền hạn thành công",
    };
  } else {
    return {
      status: false,
      message: "Xóa quyền hạn thất bại",
    };
  }
};

const updateRole = async (role_id, roleBody) => {
      try {
    const result = await sequelize.transaction(async (t) => {
      const role = await Role.update(
        {
          role_code: roleBody.role_code.trim(),
          role_name: roleBody.role_name.trim(),
        },
        {
          where: {
            role_id,
          },
        },
        { transaction: t }
      );
      return role;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const adminUpdateRoleService = async (role_id, roleBody) => {
  const role_code = roleBody.role_code.trim();
  const list_check = [
    Promise.resolve(checkRoleExist(role_id)),
    Promise.resolve(checkRoleCodeExist(role_code, 2, role_id)),
  ];
  const check_result = await Promise.all(list_check);
  if (check_result[0] === null) {
    return {
      status: false,
      message: "Quyền hạn đã xóa trước đó hoặc không tồn tại",
    };
  } else if (check_result[1] !== null) {
    return {
      status: false,
      message: "Mã quyền hạn đã tồn tại trên hệ thống",
    };
  }
  if (check_result[0] === false || check_result[1] === false) {
    return {
      status: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
    };
  }

  const update_result = await updateRole(role_id, roleBody);
  if (update_result) {
    const role_list = await getAll();
    return {
      status: true,
      data: role_list,
      message: "Cập nhật quyền hạn thành công",
    };
  } else {
    return {
      status: false,
      message: "Cập nhật quyền hạn thất bại",
    };
  }
};

module.exports = {
  adminGetALLRoleService,
  adminAddRoleService,
  adminDeleteRoleService,
  adminUpdateRoleService,
};
