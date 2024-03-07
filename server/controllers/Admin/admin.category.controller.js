const {
  adminGetAllCategoryService,
  adminAddCategoryService,
  adminDeleteCategoryService,
  adminUpdateCategoryService,
} = require("../../services/Admin/admin.category.service");

const adminGetAllCategory = async (req, res) => {
  const result = await adminGetAllCategoryService();
  res.status(200).send(result);
};

const adminAddCategory = async (req, res) => {
  let { category_name } = req.body;
  category_name = String(category_name).trim();
  const result = await adminAddCategoryService(category_name);
  res.status(201).send(result);
};

const adminDeleteCategory = async (req, res) => {
  const category_id = req.params.id;
  const result = await adminDeleteCategoryService(category_id);
  res.status(201).send(result);
};

const adminUpdateCategory = async (req, res) => {
  const category_id = req.params.id;
  let { category_name } = req.body;
  category_name = String(category_name).trim();
  const result = await adminUpdateCategoryService(category_id, category_name);
  res.status(201).send(result);
};

module.exports = {
  adminGetAllCategory,
  adminDeleteCategory,
  adminAddCategory,
  adminUpdateCategory,
};
