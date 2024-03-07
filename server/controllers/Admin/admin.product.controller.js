const {
  adminGetAllProductService,
  adminAddProductService,
  adminDeleteProductService,
  adminUpdateProductService,
} = require("../../services/Admin/admin.product.service");

const adminGetAllProduct = async (req, res) => {
  const result = await adminGetAllProductService();
  res.status(200).send(result);
};

const adminAddProduct = async (req, res) => {
  let productBody = req.body;
  const result = await adminAddProductService(productBody);
  res.status(201).send(result);
};

const adminDeleteProduct = async (req, res) => {
  const product_id = req.params.id;
  const result = await adminDeleteProductService(product_id);
  res.status(201).send(result);
};

const adminUpdateProduct = async (req, res) => {
  const product_id = req.params.id;
  let productBody  = req.body;
  const result = await adminUpdateProductService(product_id, productBody);
  res.status(201).send(result);
};

module.exports = {
  adminGetAllProduct,
  adminDeleteProduct,
  adminAddProduct,
  adminUpdateProduct,
};
