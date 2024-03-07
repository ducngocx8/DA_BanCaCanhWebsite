const { Cart, Fish, Size, User } = require("../../models");

const getAllCartService = async () => {
  const result = await Cart.findAll({
    include: [{ model: Fish }, { model: Size }, { model: User }],
  });
  return result;
};

module.exports = { getAllCartService };