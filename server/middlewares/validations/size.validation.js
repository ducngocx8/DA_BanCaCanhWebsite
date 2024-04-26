const sizeNameAdminValidation = (req, res, next) => {
  let { size_name } = req.body;
  if (!size_name) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin tên size",
    });
  } else {
    if (size_name.trim() === "") {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin tên size",
      });
    }
    else if (size_name.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Tên size cần dưới 255 ký tự",
      });
    } else {
      next();
    }
  }
};

const sizeIDAdminValidation = (req, res, next) => {
  const size_id = req.params.id;
  if (!Number.isInteger(Number(size_id))) {
    res.status(201).send({
      status: false,
      message: "Size_id phải là số nguyên",
    });
  } else {
    next();
  }
};

module.exports = { sizeNameAdminValidation, sizeIDAdminValidation };
