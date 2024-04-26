const {
  getAll,
  getOneBuy,
  getDetail,
  getResultSearch,
  getTopBuyProductService,
  getProductsByCategoryService,
  getRandomProductService,
} = require("../../services/Customer/customer.product.service");

const getAllProduct = async (req, res) => {
  const resutl = await getAll();
  if (resutl) {
    res.status(200).send({
      status: true,
      data: resutl,
    });
  } else {
    res.status(404).send({
      status: false,
      message: "Lấy danh sách thất bại...",
    });
  }
};

const getProductDetail = async (req, res) => {
  const fish_id = req.params.id;
  const resutl = await getDetail(fish_id);
  if (resutl) {
    res.status(200).send({
      status: true,
      data: resutl,
    });
  } else {
    res.status(200).send({
      status: false,
      message: "Không tìm thấy sản phẩm tìm kiếm.",
    });
  }
};

const getOneProductBuy = async (req, res) => {
  const resutl = await getOneBuy();
  if (resutl) {
    res.status(200).send({
      status: true,
      data: resutl,
    });
  } else {
    res.status(404).send({
      status: false,
      message: "Lấy danh sách sản phẩm thất bại.",
    });
  }
};

const getProductSearch = async (req, res) => {
  const { keyword } = req.body;
  const resutl = await getResultSearch(keyword);
  if (resutl) {
    res.status(200).send({
      status: true,
      data: resutl,
    });
  } else {
    res.status(404).send({
      status: false,
      message: "Không tìm thấy sản phẩm tìm kiếm.",
    });
  }
};

const getTopBuyProduct = async (req, res) => {
  const result = await getTopBuyProductService();
  res.status(200).send(result);
};

const getRandomProduct = async (req, res) => {
  const result = await getRandomProductService();
  res.status(200).send(result);
};

const getProductsByCategory = async (req, res) => {
  const category_id = req.params.id
  const result = await getProductsByCategoryService(category_id);
  res.status(200).send(result);
};

module.exports = {
  getAllProduct,
  getOneProductBuy,
  getProductDetail,
  getProductSearch,
  getTopBuyProduct,
  getProductsByCategory,
  getRandomProduct,
};
