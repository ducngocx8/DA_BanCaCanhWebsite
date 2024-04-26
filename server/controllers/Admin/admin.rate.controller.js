const {
  deleteRateAdminService,
  getAllRateAdminService,
} = require("../../services/Admin/admin.rate.service");

const deleteRateAdmin = async (req, res) => {
   const fish_id = req.params.id;
    const {user_id} = req.body;
    const result = await deleteRateAdminService(fish_id, user_id);
    return res.status(201).send(result)
}

const getAllRateAdmin = async (req, res) => {
  const result = await getAllRateAdminService();
  return res.status(201).send(result);
};
module.exports = { deleteRateAdmin, getAllRateAdmin };