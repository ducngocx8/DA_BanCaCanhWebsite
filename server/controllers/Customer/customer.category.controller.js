const {
  getAll,
  getDetail,
} = require("../../services/Customer/customer.category.service");

const getAllCategory = async (req, res) => {
  const resutl = await getAll();
  if (resutl) {
    res.status(200).send({
      status: true,
      data: resutl,
    });
  } else {
    res.status(200).send({
      status: false,
      message: "Lấy danh sách thể loại thất bại...",
    });
  }
};

const getProductByCategoryId = async (req, res) => {
  const category_id = req.params.id
  const resutl = await getDetail(category_id);
  if (resutl) {
    res.status(200).send({
      status: true,
      data: resutl,
    });
  } else {
    res.status(200).send({
      status: false,
      message: "Lấy danh sách thể loại thất bại...",
    });
  }
};

module.exports = { getAllCategory, getProductByCategoryId };
