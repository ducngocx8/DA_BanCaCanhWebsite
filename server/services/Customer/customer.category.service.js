const { Categories, Fish, ImageProduct, Size } = require("../../models");

async function getAll() {
  const categories = await Categories.findAll();
  return categories;
}

async function getDetail(category_id) {
    const productList = await Categories.findOne({
      include: [
        { model: Fish, include: [{ model: ImageProduct }, { model: Size }] },
      ],
      where: { category_id: category_id },
    });
    return productList;
}

module.exports = { getAll, getDetail };
