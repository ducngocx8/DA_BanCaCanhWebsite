const orderIDDeliveryValidation = (req, res, next) => {
  const order_id = req.params.order_id;
  if (!Number.isInteger(Number(order_id))) {
    res.status(201).send({
      status: false,
      message: "Order_id phải là số nguyên",
    });
  } else {
    next();
  }
};

const noteOrderDeliveryValidation = (req, res, next) => {
  let { note } = req.body;
  if (!note) {
    res.status(201).send({
      status: false,
      message: "Chưa có thông tin ghi chú yêu cầu trả hàng",
    });
  } else {
    if (note.trim() === "") {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin yêu cầu trả hàng",
      });
    } else if (note.trim().length > 255 || note.trim().length < 5) {
      res.status(201).send({
        status: false,
        message: "Nội dung yêu cầu trả hàng từ 5 ký tự và không vượt quá 255 ký tự",
      });
    } else {
      next();
    }
  }
};

module.exports = { noteOrderDeliveryValidation, orderIDDeliveryValidation };
