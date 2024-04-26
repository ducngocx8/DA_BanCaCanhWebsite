const checkEmptyhasAmount = (req, res, next) => {
  const { fish_id, size_id, amount } = req.body;
  if (!fish_id || !size_id || (!amount && amount !== 0)) {
    res.status(201).send({
      status: false,
      message: "Chưa đủ tham số truyền vào",
    });
  }
  next();
};

const checkEmptyNoAmount = (req, res, next) => {
  const { fish_id, size_id } = req.body;
  if (!fish_id || !size_id) {
    res.status(201).send({
      status: false,
      message: "Chưa đủ tham số truyền vào",
    });
  }
  next();
};

const checkINTCarthasAmount = (req, res, next) => {
  const { fish_id, size_id, amount } = req.body;
  if (
    amount <= 0 ||
    !Number.isInteger(amount) ||
    !Number.isInteger(fish_id) ||
    !Number.isInteger(size_id)
  ) {
    res.status(201).send({
      status: false,
      message: "Số lượng sản phẩm phải > 0 và là số nguyên",
    });
  }
  next();
};

const checkINTCartNoAmount = (req, res, next) => {
  const { fish_id, size_id } = req.body;
  if (
    !Number.isInteger(fish_id) ||
    !Number.isInteger(size_id)
  ) {
    res.status(201).send({
      status: false,
      message: "fish_id, size_id phải là số nguyên",
    });
  }
  next();
};

module.exports = {
  checkEmptyhasAmount,
  checkEmptyNoAmount,
  checkINTCarthasAmount,
  checkINTCartNoAmount,
};
