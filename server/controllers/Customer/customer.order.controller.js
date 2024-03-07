const {
  getOrderByUserService,
  orderUserUpdateService,
  getOrderBetweenDateService,
  getOrderUserStatisticsService,
} = require("../../services/Customer/customer.order.service");

const getOrderByUser = async (req, res) => {
  const { user_id } = req.userLogin;
  const result = await getOrderByUserService(user_id);
  if (result) {
    res.status(200).send({
      status: true,
      data: result,
    });
  } else {
    res.status(200).send({
      status: true,
      message: "Lấy danh sách đơn hàng thất bại",
    });
  }
};

const orderUserUpdate = async (req, res) => {
  const order = req.body;
  console.log(order);
  const { user_id } = req.userLogin;
  const result = await orderUserUpdateService(user_id, order);
  res.status(201).send(result);
};

const getOrderBetweenDate = async (req, res) => {
  const { startDate, endDate } = req.order_search;
  const { user_id } = req.userLogin;
  const result = await getOrderBetweenDateService(
    user_id,
    startDate,
    endDate,
    1
  );
  res.status(200).send(result);
};

const getOrderUserStatistics = async (req, res) => {
  const { user_id } = req.userLogin;
  const result = await getOrderUserStatisticsService(user_id);
  res.status(200).send(result);
};

module.exports = {
  getOrderByUser,
  orderUserUpdate,
  getOrderBetweenDate,
  getOrderUserStatistics,
};
