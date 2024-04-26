const {
  customer_code,
  employee_code,
  admin_code,
  delivery_code,
} = require("../Utils");

const customerPermission = (req, res, next) => {
  const { userLogin } = req;
  const roles = userLogin.roles;
  if (roles.includes(customer_code)) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message: "Chỉ có Khách Hàng mới có quyền sử dụng tính năng này!",
      must: "permission",
    });
  }
};

const employeePermission = (req, res, next) => {
  const { userLogin } = req;
  const roles = userLogin.roles;
  if (roles.includes(employee_code)) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message: "Chỉ có Nhân Viên mới có quyền sử dụng tính năng này!",
      must: "permission",
    });
  }
};

const adminPermission = (req, res, next) => {
  const { userLogin } = req;
  const roles = userLogin.roles;
  if (roles.includes(admin_code)) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message: "Chỉ có Admin mới có quyền sử dụng tính năng này!",
      must: "permission",
    });
  }
};

const admin_employee_Permission = (req, res, next) => {
  const { userLogin } = req;
  console.log(userLogin);
  const roles = userLogin.roles;
  if (roles.includes(admin_code) || roles.includes(employee_code)) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message: "Chỉ có Admin và Nhân Viên mới có quyền sử dụng tính năng này!",
      must: "permission",
    });
  }
};

const admin_customer_Permission = (req, res, next) => {
  const { userLogin } = req;
  const roles = userLogin.roles;
  if (roles.includes(admin_code) || roles.includes(customer_code)) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message: "Chỉ có Khách Hàng và Admin mới có quyền sử dụng tính năng này!",
      must: "permission",
    });
  }
};

const allPermission = (req, res, next) => {
  const { userLogin } = req;
  const roles = userLogin.roles;
  if (
    roles.includes(admin_code) ||
    roles.includes(customer_code) ||
    roles.includes(employee_code) ||
    roles.includes(delivery_code)
  ) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message:
        "Chỉ có người dùng đăng nhập có quyền mới được sử dụng tính năng này!",
      must: "permission",
    });
  }
};

const deliveryPermission = (req, res, next) => {
  const { userLogin } = req;
  const roles = userLogin.roles;
  if (roles.includes(delivery_code)) {
    next();
  } else {
    res.status(200).send({
      status: false,
      message:
        "Chỉ có người giao hàng có quyền mới được sử dụng tính năng này!",
      must: "permission",
    });
  }
};

module.exports = {
  customerPermission,
  adminPermission,
  employeePermission,
  admin_employee_Permission,
  admin_customer_Permission,
  allPermission,
  deliveryPermission,
};
