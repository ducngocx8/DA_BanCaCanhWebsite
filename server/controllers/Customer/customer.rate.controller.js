const {
  addRateUserService,
  getRateByFishIDService,
  deleteRateByFishIDService,
} = require("../../services/Customer/customer.rate.service");

const addRateUser = async (req, res) => {
    const rate = req.body;
    const { user_id } = req.userLogin;
    const result = await addRateUserService(rate, user_id);
    res.status(201).send(result)
};

const getRateByFishID = async (req, res) => {
    const fish_id = req.params.id;
    const rates = await getRateByFishIDService(fish_id);
    res.status(200).send({
      status: true,
      data: rates,
    });
}

const deleteRateByFishID = async (req, res) => {
    const fish_id = req.params.id;
    const { user_id } = req.userLogin;
    const result = await deleteRateByFishIDService(fish_id, user_id);
    res.status(200).send(result);
}
module.exports = { addRateUser, getRateByFishID, deleteRateByFishID };