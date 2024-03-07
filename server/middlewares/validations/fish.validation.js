const checkEmpty = (req, res, next) => {
  const { fish_name, category_id } = req.body;
  let check = true;
  let message = "";
  if (!fish_name) {
    check = false;
    message += "fish_name, ";
  }

  if (!category_id) {
    check = false;
    message += "category_id, ";
  }

  if (message) {
    message = message.substr(0, message.length - 2) + " cannot be empty";
  }

  if (check === false) {
    res.status(400).send({ status: false, message });
  } else {
    next();
  }
};

const checkValueAddProductEmpty = (req, res, next) => {
  const { fish_name, category_id, fish_status, imageList, FishPrices } =
    req.body;
  console.log(req.body);
  let check = true;
  let message = "";
  if (!fish_name) {
    check = false;
    message += "Tên cá, ";
  } else {
    if (fish_name.trim() === "") {
      check = false;
      message += "Tên cá, ";
    }
  }

  if (!category_id) {
    check = false;
    message += "Danh mục, ";
  }

  if (!imageList) {
    check = false;
    message += "imageList, ";
  }

  if (!FishPrices) {
    check = false;
    message += "FishPrices, ";
  }

  if (!fish_status) {
    check = false;
    message += "Trạng thái, ";
  }

  if (message) {
    message =
      message.substr(0, message.length - 2) + " không được thiếu hoặc trống";
  }

  if (check === false) {
    res.status(201).send({ status: false, message });
  } else {
    next();
  }
};

const checkValueAddProductValid = (req, res, next) => {
  const { fish_name, category_id, fish_status, imageList, FishPrices } =
    req.body;
  let check = true;
  let message = "";

  if (fish_name.trim().length < 3 || fish_name.trim().length > 255) {
    check = false;
    message += "Tên sản phẩm dưới 3 ký tự, ";
  }

  if (!Number.isInteger(Number(category_id))) {
    check = false;
    message += "Danh mục không hợp lệ, ";
  }

  if (!Array.isArray(imageList)) {
    check = false;
    message += "imageList cần phải là một list hình ảnh, ";
  } else if (imageList.length < 1) {
    check = false;
    message += "Vui lòng chọn ít nhất 1 hình ảnh, ";
  }

  if (!Array.isArray(FishPrices)) {
    check = false;
    message += "FishPrices cần phải là một list size + giá, ";
  } else if (FishPrices.length < 1) {
    check = false;
    message += "Vui lòng chọn ít nhất 1 Size và nhập giá, ";
  }

  if (typeof fish_status !== "boolean") {
    check = false;
    message += "Trạng thái không hợp lệ (true/false), ";
  }

  if (message) {
    message = message.substr(0, message.length - 2);
  }

  if (check === false) {
    res.status(201).send({ status: false, message });
  } else {
    next();
  }
};

const checkValueUpdateProductEmpty = (req, res, next) => {
  const { fish_name, category_id, fish_status } = req.body;
  console.log(req.body);
  let check = true;
  let message = "";
  if (!fish_name) {
    check = false;
    message += "Tên cá, ";
  } else {
    if (fish_name.trim() === "") {
      check = false;
      message += "Tên cá, ";
    }
  }

  if (!category_id) {
    check = false;
    message += "Danh mục, ";
  }

  if (!fish_status && fish_status.length === 0) {
    check = false;
    message += "Trạng thái, ";
  }

  if (message) {
    message =
      message.substr(0, message.length - 2) + " không được thiếu hoặc trống";
  }

  if (check === false) {
    res.status(201).send({ status: false, message });
  } else {
    next();
  }
};

const checkValueUpdateProductValid = (req, res, next) => {
  const { fish_name, category_id, fish_status } = req.body;
  let check = true;
  let message = "";

  if (fish_name.trim().length < 3 || fish_name.trim().length > 255) {
    check = false;
    message += "Tên sản phẩm dưới 3 ký tự, ";
  }

  if (!Number.isInteger(Number(category_id))) {
    check = false;
    message += "Danh mục không hợp lệ, ";
  }

  if (typeof fish_status !== "boolean") {
    check = false;
    message += "Trạng thái không hợp lệ (true/false), ";
  }

  if (message) {
    message = message.substr(0, message.length - 2);
  }

  if (check === false) {
    res.status(201).send({ status: false, message });
  } else {
    next();
  }
};

module.exports = {
  checkEmpty,
  checkValueAddProductEmpty,
  checkValueAddProductValid,
  checkValueUpdateProductEmpty,
  checkValueUpdateProductValid,
};
