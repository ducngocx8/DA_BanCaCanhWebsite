const {
  adminGetAllSizeService,
  adminAddSizeService,
  adminDeleteSizeService,
  adminUpdateSizeService,
} = require("../../services/Admin/admin.size.service");

const adminGetAllSize = async (req, res) => {
  const result = await adminGetAllSizeService();
  res.status(200).send(result);
};

const adminAddSize = async (req, res) => {
  let { size_name } = req.body;
  size_name = String(size_name).trim();
  const result = await adminAddSizeService(size_name);
  res.status(201).send(result);
};

const adminDeleteSize = async (req, res) => {
  const size_id = req.params.id;
  const result = await adminDeleteSizeService(size_id);
  res.status(201).send(result);
};

const adminUpdateSize = async (req, res) => {
  const size_id = req.params.id;
  let { size_name } = req.body;
  size_name = String(size_name).trim();
  const result = await adminUpdateSizeService(size_id, size_name);
  res.status(201).send(result);
};

module.exports = {
  adminGetAllSize,
  adminDeleteSize,
  adminAddSize,
  adminUpdateSize,
};
