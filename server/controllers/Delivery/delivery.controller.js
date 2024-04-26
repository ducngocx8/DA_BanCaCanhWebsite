const {
  countOrderDeliverySerive,
  getOrderDeliverySerive,
  exchangeOrderAllSerive,
  getOrderDeliveryByDateService,
  deliveryOrderSuccessService,
} = require("../../services/Delivery/delivery.service");

const countOrderDelivery = async (req, res) => {
  const result = await countOrderDeliverySerive();
  res.status(200).send(result);
};

const getOrderDelivery = async (req, res) => {
  const result = await getOrderDeliverySerive();
  res.status(200).send(result);
};

const exchangeOrderAll = async (req, res) => {
  const { order_id } = req.params;
  const note = req.body.note.trim();
  const result = await exchangeOrderAllSerive(order_id, note);
  res.status(201).send(result);
};

const getOrderDeliveryByDate = async (req, res) => {
  const { endDate, startDate } = req.order_search;
  const result = await getOrderDeliveryByDateService(startDate, endDate);
  res.status(200).send(result);
};

const deliveryOrderSuccess = async (req, res) => {
  const { order_id } = req.params;
  const result = await deliveryOrderSuccessService(order_id);
  res.status(201).send(result);
};

module.exports = {
  countOrderDelivery,
  getOrderDelivery,
  exchangeOrderAll,
  getOrderDeliveryByDate,
  deliveryOrderSuccess,
};
