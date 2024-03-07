const { encodePassword, decodePassword } = require("../../Utils");
const {
  sequelize,
  Fish,
  Fish_Size,
  Size,
  User,
  Role,
  UserRole,
} = require("../../models");
const { Op } = require("Sequelize");
const getAll = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const users = await User.findAll({
        include: [{ model: Role }, { model: UserRole }],
        order: [["user_id", "ASC"]],
      });
      users_update = users.map(user => {
        const password_decode = decodePassword(user.dataValues.password);
        return {
          ...user.dataValues,
          password: password_decode,
        };
      })
      return users_update;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminGetAllUserService = async () => {
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

const checkUserName = async (username, status, user_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      username: username,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [
        { username: username },
        { user_id: { [Op.not]: Number(user_id) } },
      ],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: whereObject,
      });
      return user;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkPhoneNumber = async (phonenumber, status, user_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      phonenumber: phonenumber,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [
        { phonenumber: phonenumber },
        { user_id: { [Op.not]: Number(user_id) } },
      ],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: whereObject,
      });
      return user;
    });
    return result;
  } catch (error) {
    return false;
  }
};

const checkEmail = async (email, status, user_id) => {
  // status 1: Add (không yêu cầu id), status 2: Update (yêu cầu id)
  let whereObject = {};
  if (status === 1) {
    whereObject = {
      email: email,
    };
  } else if (status === 2) {
    whereObject = {
      [Op.and]: [{ email: email }, { user_id: { [Op.not]: Number(user_id) } }],
    };
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await User.findOne({
        where: whereObject,
      });
      return user;
    });
    return result;
  } catch (error) {
    return false;
  }
};


const addUser = async (userBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const {
        username,
        password,
        email,
        address,
        firstname,
        lastname,
        phonenumber,
        user_status,
        User_Roles,
      } = userBody;
      const password_encode = encodePassword(password.trim());
      const user = await User.create(
        {
          username,
          email,
          password: password_encode,
          address: address ? address : "",
          firstname: firstname ? firstname.trim() : "",
          lastname: lastname ? lastname.trim() : "",
          phonenumber: phonenumber ? phonenumber : "",
          user_status: Number(user_status),
          User_Roles,
        },
        {
          include: [{ model: UserRole }],
        },
        { transaction: t }
      );
      return user;
    });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const adminAddUserService = async (userBody) => {
  const username = userBody.username.trim();
  const email = userBody.email.trim();
  const phonenumber = userBody.phonenumber ? userBody.phonenumber : null;

  const list_check = phonenumber
    ? [
        Promise.resolve(checkUserName(username, 1, -1)),
        Promise.resolve(checkEmail(email, 1, -1)),
        Promise.resolve(checkPhoneNumber(phonenumber, 1, -1)),
      ]
    : [
        Promise.resolve(checkUserName(username, 1, -1)),
        Promise.resolve(checkEmail(email, 1, -1)),
      ];
  const values = await Promise.all(list_check);
  if (values[0] !== null) {
    // username
    return {
      status: false,
      message: "Username đã tồn tại trên hệ thống",
    };
  } else if (values[1] !== null) {
    // email
    return {
      status: false,
      message: "Email đã tồn tại trên hệ thống",
    };
  } else if (phonenumber) {
    // phonenumber
    if (values[2] !== null) {
      return {
        status: false,
        message: "Số điện thoại đã tồn tại trên hệ thống",
      };
    }
  }

  if (phonenumber) {
    if (values[0] === false || values[1] === false || values[2] === false) {
      return {
        status: false,
        message: "Lỗi server, vui lòng thử lại",
      };
    }
  } else {
    if (values[0] === false || values[1] === false) {
      return {
        status: false,
        message: "Lỗi server, vui lòng thử lại",
      };
    }
  }

  const add_result = await addUser(userBody);
  if (add_result) {
    const user_list = await getAll();
    return {
      status: true,
      data: user_list,
      message: "Thêm user mới thành công",
    };
  } else {
    return {
      status: false,
      message: "Thêm user mới thất bại",
    };
  }
};

const updateUser = async (user_id, userBody) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const {
        username,
        password,
        email,
        address,
        firstname,
        lastname,
        phonenumber,
        user_status,
      } = userBody;
      const password_encode = encodePassword(password.trim());
      const price_update = await User.update(
        {
          username,
          email,
          password: password_encode,
          address: address ? address : "",
          firstname: firstname ? firstname.trim() : "",
          lastname: lastname ? lastname.trim() : "",
          phonenumber: phonenumber ? phonenumber : "",
          user_status: Number(user_status),
        },
        {
          where: {
            user_id,
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

const adminUpdateUserService = async (user_id, userBody) => {
  const username = userBody.username.trim();
  const email = userBody.email.trim();
  const phonenumber = userBody.phonenumber ? userBody.phonenumber : null;

  const list_check = phonenumber
    ? [
        Promise.resolve(checkUserName(username, 2, user_id)),
        Promise.resolve(checkEmail(email, 2, user_id)),
        Promise.resolve(checkPhoneNumber(phonenumber, 2, user_id)),
      ]
    : [
        Promise.resolve(checkUserName(username, 2, user_id)),
        Promise.resolve(checkEmail(email, 2, user_id)),
      ];
  const values = await Promise.all(list_check);
  if (values[0] !== null) {
    // username
    return {
      status: false,
      message: "Username đã tồn tại trên hệ thống",
    };
  } else if (values[1] !== null) {
    // email
    return {
      status: false,
      message: "Email đã tồn tại trên hệ thống",
    };
  } else if (phonenumber) {
    // phonenumber
    if (values[2] !== null) {
      return {
        status: false,
        message: "Số điện thoại đã tồn tại trên hệ thống",
      };
    }
  }

  if (phonenumber) {
    if (values[0] === false || values[1] === false || values[2] === false) {
      return {
        status: false,
        message: "Lỗi server, vui lòng thử lại",
      };
    }
  } else {
    if (values[0] === false || values[1] === false) {
      return {
        status: false,
        message: "Lỗi server, vui lòng thử lại",
      };
    }
  }
  const update_result = await updateUser(user_id, userBody);
  if (update_result) {
    const user_list = await getAll();
    return {
      status: true,
      data: user_list,
      message: "Cập nhật thông tin user thành công",
    };
  } else {
    return {
      status: false,
      message: "Cập nhật thông tin user thất bại",
    };
  }
};

module.exports = {
  adminGetAllUserService,
  adminAddUserService,
  adminUpdateUserService,
};
