const moment = require("moment");
var regexEmail = /^[a-z0-9]+@gmail.com+$/;
const regexPhone = /(0[3|5|7|8|9])+([0-9]{8})\b/;
const checkOrderStatusUser = (req, res, next) => {
  const { order_status, order_id, phonenumber, address, fullname } = req.body;
  if (!order_id || !order_status) {
    res.status(201).send({ status: false, message: "Thiếu trường dữ liệu" });
  } else {
    if (phonenumber || address || fullname) {
      if (address.trim() === "") {
        res
          .status(201)
          .send({ status: false, message: "Bạn chưa điền địa chỉ nhận hàng" });
      } else if (!regexPhone.test(phonenumber)) {
        res.status(201).send({
          status: false,
          message: "Số điện thoại bạn điền chưa hợp lệ",
        });
      }
      if (!phonenumber || !address || !fullname) {
        if (!phonenumber) {
          res.status(201).send({
            status: false,
            message: "Bạn chưa điền số điện thoại",
          });
        } else if (!address) {
          res.status(201).send({
            status: false,
            message: "Bạn chưa điền địa chỉ nhận hàng",
          });
        } else if (!fullname) {
          res.status(201).send({
            status: false,
            message: "Bạn chưa điền họ tên người nhận",
          });
        }
      }
    }
    if (order_status === 1 || order_status === 4) {
      // Hủy hoặc đã đặt (Chưa xác nhận)
      next();
    } else
      res
        .status(201)
        .send({ status: false, message: "Trạng thái đơn hàng chưa đúng" });
  }
};

const checkBodyOrderDetail = (req, res, next) => {
  const { address, fullname, phonenumber } = req.body;
  if (!address || !fullname || !phonenumber) {
    res
      .status(201)
      .send({ status: false, message: "Chưa đầy đủ thông tin đặt hàng" });
  } else if (!regexPhone.test(phonenumber)) {
    res
      .status(201)
      .send({ status: false, message: "Số điện thoại không hợp lệ" });
  } else if (!address.trim()) {
    res
      .status(201)
      .send({ status: false, message: "Chưa điền địa chỉ nhận hàng" });
  } else if (!fullname.trim()) {
    res
      .status(201)
      .send({ status: false, message: "Chưa điền họ tên người nhận hàng" });
  } else if (address.trim().length > 255) {
    res
      .status(201)
      .send({ status: false, message: "Địa chỉ nhận hàng cần dưới 255 ký tự" });
  } else if (fullname.trim().length > 50) {
    res
      .status(201)
      .send({ status: false, message: "Tên người nhận cần dưới 50 ký tự" });
  }
  next();
};

const checkDateOrder = (req, res, next) => {
  const { endDate, startDate } = req.body;
  if (!endDate || !startDate) {
    if (!startDate || !moment(startDate).isValid()) {
      res
        .status(200)
        .send({ status: false, message: "Vui lòng điền ngày bắt đầu" });
    } else if (!endDate || !moment(endDate).isValid()) {
      res
        .status(200)
        .send({ status: false, message: "Vui lòng điền ngày kết thúc" });
    }
  } else {
    const dateStart = new Date(Number(Date.parse(startDate)));
    let dateEnd = new Date(Number(Date.parse(endDate)));
    if (dateEnd.getTime() < dateStart.getTime()) {
      res
        .status(200)
        .send({ status: false, message: "Ngày kết thúc đang < ngày bắt đầu" });
    } else {
      dateEnd = new Date(endDate);
      dateEnd = new Date(dateEnd.setDate(dateEnd.getDate() + 1));
      req.order_search = {
        endDate:
          dateEnd.getFullYear() +
          "-" +
          (dateEnd.getMonth() + 1) +
          "-" +
          dateEnd.getDate(),
        startDate:
          dateStart.getFullYear() +
          "-" +
          (dateStart.getMonth() + 1) +
          "-" +
          dateStart.getDate(),
      };
      next();
    }
  }
};

const adminCheckOrderDetail = (req, res, next) => {
  const { address, fullname, phonenumber, email, order_status } = req.body;
  if (!address || !fullname || !phonenumber || !email || !order_status) {
    return res
      .status(201)
      .send({ status: false, message: "Chưa đầy đủ thông tin đơn hàng" });
  } else if (!regexEmail.test(email)) {
    return res
      .status(201)
      .send({ status: false, message: "Địa chỉ email không hợp lệ" });
  } else if (!regexPhone.test(phonenumber)) {
    return res
      .status(201)
      .send({ status: false, message: "Số điện thoại không hợp lệ" });
  } else if (!address.trim()) {
    return res
      .status(201)
      .send({ status: false, message: "Chưa điền địa chỉ nhận hàng" });
  } else if (!fullname.trim()) {
    return res
      .status(201)
      .send({ status: false, message: "Chưa điền họ tên người nhận hàng" });
  } else if (
    !Number.isInteger(Number(order_status)) ||
    Number(order_status) < 1 ||
    Number(order_status) > 8
  ) {
    return res
      .status(201)
      .send({ status: false, message: "Trạng thái đơn hàng không hợp lệ" });
  } else if (address.trim().length > 255) {
    return res
      .status(201)
      .send({ status: false, message: "Địa chỉ nhận hàng cần dưới 255 ký tự" });
  } else if (fullname.trim().length > 50) {
    return res
      .status(201)
      .send({ status: false, message: "Tên người nhận cần dưới 50 ký tự" });
  }
  next();
};

const adminCheckOrderStatus = (req, res, next) => {
  const order_status = req.params.order_status;
  if (
    !Number.isInteger(Number(order_status)) ||
    Number(order_status) < 1 ||
    Number(order_status) > 8
  ) {
    return res.status(200).send({
      status: false,
      message: "order_status phải là số nguyên >= 1 và <= 8",
    });
  } else {
    next();
  }
};

module.exports = {
  checkOrderStatusUser,
  checkBodyOrderDetail,
  checkDateOrder,
  adminCheckOrderDetail,
  adminCheckOrderStatus,
};
