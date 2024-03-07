const {
  getAllOTPService,
  deleteAllOTPService,
} = require("../../services/Admin/admin.otp.service");
const getAllOTP = async (req, res) => {
  const result = await getAllOTPService();
  res.status(200).send(result);
};

const deleteAllOTP = async (req, res) => {
  const result = await deleteAllOTPService();
  res.status(201).send(result);
};

module.exports = {
  getAllOTP,
  deleteAllOTP,
};
