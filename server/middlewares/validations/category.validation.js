const categoryNameAdminValidation = (req, res, next) => {
  let { category_name } = req.body;
  if (!category_name) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin tên danh mục",
    });
  } else {
    if (category_name.trim() === "") {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin tên danh mục",
      });
    } else if (category_name.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Tên danh mục vượt quá 255 ký tự",
      });
    } else {
      next();
    }
  }
};

const categoryIDAdminValidation = (req, res, next) => {
  const category_id = req.params.id;
  if (!Number.isInteger(Number(category_id))) {
    res.status(201).send({
      status: false,
      message: "Category_id phải là số nguyên",
    });
  } else {
    next();
  }
};

module.exports = { categoryNameAdminValidation, categoryIDAdminValidation };
