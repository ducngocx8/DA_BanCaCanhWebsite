const {
  adminGetPriceByProductIDService,
  adminAddPriceService,
  adminDeletePriceService,
  adminUpdatePriceService,
} = require("../../services/Admin/admin.price.service");

const adminGetPriceByProductID = async (req, res) => {
  const fish_id = req.params.id;
  const result = await adminGetPriceByProductIDService(fish_id);
  res.status(200).send(result);
};

const adminAddPrice = async (req, res) => {
  const fish_id = req.params.id;
  let sizeBody = req.body;
  const result = await adminAddPriceService(fish_id, sizeBody);
  res.status(201).send(result);
};

const adminDeletePrice = async (req, res) => {
  const fish_id = req.params.id;
  const { size_id } = req.body;
  const result = await adminDeletePriceService(fish_id, size_id);
  res.status(201).send(result);
};

const adminUpdatePrice = async (req, res) => {
  const fish_id = req.params.id;
  const priceBody = req.body;
  const result = await adminUpdatePriceService(fish_id, priceBody);
  res.status(201).send(result);
};

module.exports = {
  adminGetPriceByProductID,
  adminDeletePrice,
  adminAddPrice,
  adminUpdatePrice,
};
