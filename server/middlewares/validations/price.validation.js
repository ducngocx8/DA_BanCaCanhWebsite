const fishIDAdminValidation = (req, res, next) => {
  const fish_id = req.params.id;
  if (!Number.isInteger(Number(fish_id))) {
    res.status(201).send({
      status: false,
      message: "Fish_id phải là số nguyên",
    });
  } else {
    next();
  }
};

const sizeIDAdminValidation = (req, res, next) => {
  let { size_id } = req.body;
  if (!size_id) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin size_id",
    });
  } else {
    if (!Number.isInteger(Number(size_id))) {
      res.status(201).send({
        status: false,
        message: "Size_id phải là số nguyên",
      });
    } else {
      next();
    }
  }
};

const addSizeAdminValidation = (req, res, next) => {
  let { size_id, price, fish_remain } = req.body;
  const fish_id = req.params.id;
  if (!Number.isInteger(Number(fish_id))) {
    res.status(201).send({
      status: false,
      message: "Fish_id phải là số nguyên",
    });
  } else if ((!price && Number(price) !== 0) || (!fish_remain  && Number(fish_remain) !== 0) || !size_id) {
    res.status(201).send({
      status: false,
      message: "Thiếu thông tin giá/số lượng/size sản phẩm",
    });
  } else {
    if (!Number.isInteger(Number(size_id))) {
      res.status(201).send({
        status: false,
        message: "Size_id phải là số nguyên",
      });
    } else if (!Number.isInteger(Number(price)) || Number(price) < 0) {
      res.status(201).send({
        status: false,
        message: "Giá sản phẩm cần >= 0 và là số nguyên",
      });
    } else if (
      !Number.isInteger(Number(fish_remain)) ||
      Number(fish_remain) < 0
    ) {
      res.status(201).send({
        status: false,
        message: "Số lượng sản phẩm cần >= 0 và là số nguyên",
      });
    } else {
      next();
    }
  }
};

module.exports = {
  fishIDAdminValidation,
  sizeIDAdminValidation,
  addSizeAdminValidation,
};
