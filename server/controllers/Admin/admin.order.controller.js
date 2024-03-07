const {
  adminGetAllOrderService,
  adminUpdateOrderService,
  adminGetOrderByDateService,
  adminGetOrderByStatusService,
} = require("../../services/Admin/admin.order.service");

const adminGetAllOrder = async (req, res) => {
  const result = await adminGetAllOrderService();
  res.status(200).send(result);
};

const adminUpdateOrder = async (req, res) => {
  const order_id = req.params.id;
  let orderInfo = req.body;
  const result = await adminUpdateOrderService(order_id, orderInfo);
  res.status(201).send(result);
};

const adminGetOrderByDate = async (req, res) => {
  const { endDate, startDate } = req.order_search;
  const result = await adminGetOrderByDateService(startDate, endDate);
  res.status(200).send(result);
};

const adminGetOrderByStatus = async (req, res) => {
  const order_status = Number(req.params.order_status)
  const result = await adminGetOrderByStatusService(order_status);
  res.status(200).send(result);
};


module.exports = {
  adminGetAllOrder,
  adminUpdateOrder,
  adminGetOrderByDate,
  adminGetOrderByStatus,
};
