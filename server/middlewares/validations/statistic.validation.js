const yearValidation = (req, res, next) => {
  const year = req.params.year;
  const currentYear = (new Date).getFullYear()
  if (!Number.isInteger(Number(year)) || Number(year) < 2020 || Number(year) > currentYear) {
    res.status(201).send({
      status: false,
      message: "Year phải là số nguyên từ 2020 và nhỏ hơn hoặc bằng năm hiện tại ("+currentYear+")",
    });
  } else {
    next();
  }
};

module.exports = { yearValidation };
