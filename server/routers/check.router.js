const express = require("express");
const { Sequelize } = require("Sequelize");
const {
  verifyToken,
  checkUserToken,
} = require("../middlewares/validations/account.validation");
const {
  admin_employee_Permission,
  adminPermission,
  customerPermission,
  employeePermission,
  allPermission,
  deliveryPermission,
} = require("../middlewares/permission");
const { Fish, Fish_Size, sequelize } = require("../models");
const checkRoute = express.Router();

checkRoute.get(
  "/admin-employee",
  verifyToken,
  checkUserToken,
  admin_employee_Permission,
  (req, res) => {
    const { roles, username } = req.userLogin;
    res.status(200).send({ status: true, roles: roles, username });
  }
);

checkRoute.get(
  "/admin",
  verifyToken,
  checkUserToken,
  adminPermission,
  (req, res) => {
    const { username } = req.userLogin;
    res.status(200).send({ status: true, username });
  }
);

checkRoute.get(
  "/customer",
  verifyToken,
  checkUserToken,
  customerPermission,
  (req, res) => {
    const { username } = req.userLogin;
    res.status(200).send({ status: true, username });
  }
);

checkRoute.get(
  "/employee",
  verifyToken,
  checkUserToken,
  employeePermission,
  (req, res) => {
    const { username } = req.userLogin;
    res.status(200).send({ status: true, username });
  }
);

checkRoute.get(
  "/all",
  verifyToken,
  checkUserToken,
  allPermission,
  (req, res) => {
    const { username } = req.userLogin;
    res.status(200).send({ status: true, username });
  }
);

checkRoute.get(
  "/delivery",
  verifyToken,
  checkUserToken,
  deliveryPermission,
  (req, res) => {
    const { roles, username } = req.userLogin;
    res.status(200).send({ status: true, roles: roles, username });
  }
);

const changeAmount = async (fish_amount) => {
  try {
    const { fish_id, size_id, amount } = fish_amount;
    const result = await sequelize.transaction(async (t) => {
      const price = await Fish_Size.update(
        {
          fish_remain: Sequelize.literal(`fish_remain + ${amount}`),
        },
        {
          where: {
            fish_id,
            size_id,
          },
        },
        { transaction: t }
      );
      return price;
    });
    return result;
  } catch (error) {
    return false;
  }
};

module.exports = checkRoute;
