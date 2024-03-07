const validationRate = (req, res, next) => {
  const { rate_point, rate_comment, fish_id } = req.body;
  // Có thể check nội dung comment hợp lệ ở đây.
  if (!rate_comment || !rate_point || !fish_id) {
    if (!rate_comment) {
      res.status(201).send({
        status: false,
        message: "Vui lòng điền nội dung đánh giá",
      });
    } else if (!fish_id) {
      res.status(201).send({
        status: false,
        message: "Thiếu trường dữ liệu",
      });
    } else if (!rate_point) {
      res.status(201).send({
        status: false,
        message: "Vui lòng chọn số sao/điểm",
      });
    }
  } else {
    if ((!Number.isInteger(rate_point) && rate_point > 5) || rate_point < 1) {
      res.status(201).send({
        status: false,
        message: "Rate_point không phải là số từ 1 -> 5",
      });
    } else if (!Number.isInteger(fish_id)) {
      res.status(201).send({
        status: false,
        message: "Trường Fish_id không đúng",
      });
    } else if (rate_comment.trim() === "") {
      res.status(201).send({
        status: false,
        message: "Vui lòng nhập nội dung đánh giá",
      });
    } else if (rate_comment.trim().length > 255) {
      res.status(201).send({
        status: false,
        message: "Nội dung đánh giá cần dưới 255 ký tự",
      });
    } else if (
      ["hehe", "haha", "hihi"].includes(rate_comment.trim().toLowerCase())
    ) {
      res.status(201).send({
        status: false,
        message: "Nội dung đánh giá spam: 'hehe', 'haha', 'hihi",
      });
    } else {
      next();
    }
  }
};

const rateAdminDeleteValidation = (req, res, next) => {
  const fish_id = req.params.id;
  const { user_id } = req.body;
  if (!user_id || !fish_id) {
    if (!user_id) {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin user_id",
      });
    } else if (!fish_id) {
      res.status(201).send({
        status: false,
        message: "Chưa điền thông tin fish_id",
      });
    }
  } else {
    if (!Number.isInteger(Number(fish_id))) {
      res.status(201).send({
        status: false,
        message: "Trường Fish_id không đúng, phải là số nguyên",
      });
    } else if (!Number.isInteger(user_id)) {
      res.status(201).send({
        status: false,
        message: "Trường User_id không đúng, phải là số nguyên",
      });
    } else {
      next();
    }
  }
};

module.exports = { validationRate, rateAdminDeleteValidation };
