const { getAllCartService } = require("../../services/Admin/admin.cart.service");

const getAllCart = async (req, res) => {
  const result = await getAllCartService();
  res.status(200).send(result);
};
module.exports = {
    getAllCart
}