const {
  adminGetImageByProductIDService,
  adminAddImageService,
  adminDeleteImageService,
  adminUpdateImageService,
} = require("../../services/Admin/admin.image.service");

const adminGetImageByProductID = async (req, res) => {
  const fish_id = req.params.id;
  const result = await adminGetImageByProductIDService(fish_id);
  res.status(200).send(result);
};

const adminAddImage = async (req, res) => {
  const fish_id = req.params.id;
  let { url_image } = req.body;
  url_image = String(url_image).trim();
  const result = await adminAddImageService(fish_id, url_image);
  res.status(201).send(result);
};

const adminDeleteImage = async (req, res) => {
  const fish_id = req.params.id;
  const { image_id } = req.body;
  const result = await adminDeleteImageService(fish_id, image_id);
  res.status(201).send(result);
};

const adminUpdateImage = async (req, res) => {
  const fish_id = req.params.id;
  const imageBody = req.body;
  const result = await adminUpdateImageService(fish_id, imageBody);
  res.status(201).send(result);
};

module.exports = {
  adminGetImageByProductID,
  adminDeleteImage,
  adminAddImage,
  adminUpdateImage,
};
