const urlImageAdminValidation = (req, res, next) => {
  let { url_image } = req.body;
  if (!url_image) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin đường dẫn ảnh",
    });
  } else {
    if (url_image.trim() === "") {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin đường dẫn ảnh",
      });
    } else if (url_image.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Đường dẫn ảnh cần dưới 255 ký tự",
      });
    } else {
      next();
    }
  }
};

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

const imageIDAdminValidation = (req, res, next) => {
  let { image_id } = req.body;
  if (!image_id) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin image_id",
    });
  } else {
    if (!Number.isInteger(Number(image_id))) {
      res.status(201).send({
        status: false,
        message: "Image_id phải là số nguyên",
      });
    } else {
      next();
    }
  }
};

const imageAdminValidation = (req, res, next) => {
  let { image_id, url_image } = req.body;
  const fish_id = req.params.id;
  if (!Number.isInteger(Number(fish_id))) {
    res.status(201).send({
      status: false,
      message: "Fish_id phải là số nguyên",
    });
  } else if (!image_id || !url_image) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin hình ảnh",
    });
  } else {
    if (!Number.isInteger(Number(image_id))) {
      res.status(201).send({
        status: false,
        message: "Image_id phải là số nguyên",
      });
    } else if (url_image.trim() === "") {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin đường dẫn ảnh",
      });
    } else if (url_image.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Đường dẫn ảnh cần dưới 255 ký tự",
      });
    } else {
      next();
    }
  }
};

module.exports = {
  urlImageAdminValidation,
  fishIDAdminValidation,
  imageIDAdminValidation,
  imageAdminValidation,
};
