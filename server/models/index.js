const { Sequelize, Op } = require("Sequelize");

const {
  DB,
  USER,
  PASSWORD,
  HOST,
  DIALECT,
} = require("../configs/database.config");
const { createCategoryModel } = require("./category.model");
const { createFishModel } = require("./fish.model");
const { createImageModel } = require("./image.model");
const { createSizeModel } = require("./size.model");
const { createFishPriceModel } = require("./fishPrice.model");
const { createRoleModel } = require("./role.model");
const { createUserModel } = require("./user.model");
const { createRateModel } = require("./rate.model");
const { createUserRoleModel } = require("./userRole.model");
const { createOrderModel } = require("./order.model");
const { createOrderDetailModel } = require("./orderDetail.model");
const { createCartModel } = require("./cart.model");
const { createCouponModel } = require("./coupon.model");
const { createOTPModel } = require("./otp.model");
const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
});

const Categories = createCategoryModel(sequelize);
const Fish = createFishModel(sequelize);
const ImageProduct = createImageModel(sequelize);
const Size = createSizeModel(sequelize);
const Fish_Size = createFishPriceModel(sequelize);
const Role = createRoleModel(sequelize);
const User = createUserModel(sequelize);
const UserRole = createUserRoleModel(sequelize);
const Rate = createRateModel(sequelize);
const Order = createOrderModel(sequelize);
const OrderDetail = createOrderDetailModel(sequelize);
const Cart = createCartModel(sequelize);
const Coupon = createCouponModel(sequelize);
const Otp = createOTPModel(sequelize);

const createOneCategory = async (category_name) => {
  const task = await Categories.create({
    category_name,
  });
};

const oneFish = {
  fish_name: "Cá Betta Halfmoon 2",
  fish_description: "Cá Betta Halfmoon rất đẹp 2",
  fish_remain: 100,
  fish_status: true,
  ph: "A",
  temperature: "B",
  food: "C",
  behavior: "D",
  origin: "E",
  category_id: 1,
  Images: [
    {
      url_image:
        "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/rummynosetetra.jpg",
    },
    {
      url_image:
        "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/serpaetetralongfin.jpg",
    },
  ],
  Fish_Prices: [
    {
      size_id: 1,
      price: 30000,
      fish_remain: 300,
    },
    {
      size_id: 2,
      price: 40000,
      fish_remain: 100,
    },
  ],
};

const createOneFishImage = async () => {
  Fish.create(oneFish, {
    include: [
      {
        model: ImageProduct,
      },
      {
        model: Fish_Size,
      },
    ],
  });
};

const createOneFish = async (
  fish_name,
  fish_description,
  fish_status,
  ph,
  temperature,
  food,
  behavior,
  origin,
  category_id
) => {
  const task = await Fish.create({
    fish_name,
    fish_description,
    fish_status,
    ph,
    temperature,
    food,
    behavior,
    origin,
    category_id,
  });
};

const createOneImage = async (fish_id, url_image) => {
  const task = await ImageProduct.create({
    fish_id,
    url_image,
  });
};

const createOneSize = async (size_name) => {
  const task = await Size.create({
    size_name,
  });
};

const createOneFishSize = async (fish_id, size_id, price, fish_remain) => {
  const task = await Fish_Size.create({
    fish_id,
    size_id,
    price,
    fish_remain,
  });
};

const createOneRole = async (role_code, role_name) => {
  const task = await Role.create({
    role_code,
    role_name,
  });
};

const createOneCoupon = async (
  coupon_code,
  coupon_name,
  discount,
  min_order,
  save_money_max,
  coupon_expired
) => {
  const task = await Coupon.create({
    coupon_code,
    coupon_name,
    discount,
    min_order,
    save_money_max,
    coupon_expired,
  });
};

const createOneUser = async (
  username,
  password,
  email,
  address,
  firstname,
  lastname,
  phonenumber,
  user_status
) => {
  const task = await User.create({
    username,
    password,
    email,
    address,
    firstname,
    lastname,
    phonenumber,
    user_status,
  });
};

const createOneUserDetail = async (
  user_id,
  address,
  firstname,
  lastname,
  phonenumber
) => {
  const task = await UserDetail.create({
    user_id,
    address,
    firstname,
    lastname,
    phonenumber,
  });
};

const createOneRate = async (user_id, fish_id, rate_point, rate_comment) => {
  const task = await Rate.create({
    user_id,
    fish_id,
    rate_point,
    rate_comment,
    rate_time: Date.now(),
  });
};

const createOneOrder = async (
  user_id,
  phonenumber,
  address,
  save_money,
  order_time,
  order_status
) => {
  const task = await Order.create({
    user_id,
    phonenumber,
    address,
    save_money,
    order_time,
    order_status,
  });
};

const createOneOrder_OrderDetail = async (
  user_id,
  email,
  phonenumber,
  address,
  save_money,
  order_time,
  order_status
) => {
  const order = {
    user_id,
    email,
    phonenumber,
    address,
    save_money,
    order_time,
    order_status,
    OrderDetails: [
      {
        fish_id: 1,
        size_id: 2,
        amount: 2,
        price: 33000,
      },
      {
        fish_id: 2,
        size_id: 3,
        amount: 100,
        price: 33000,
      },
    ],
  };

  const task = await Order.create(order, {
    include: [{ model: OrderDetail }],
  });
  console.log("TASK = ", JSON.stringify(task, null, 2));
};

const ExecuteSQL1 = async () => {
  const fish = await Fish.findAll({
    include: [
      { model: Categories },
      { model: ImageProduct },
      { model: Fish_Size },
      { model: Rate, include: [{ model: User }] },
      // { model: Size },
    ],
  });
  return fish;
};

const ExecuteSQL2 = async () => {
  const fish = await Order.findAll({
    include: [{ model: OrderDetail }, { model: User }],
  });
  return fish;
};

const ExecuteSQL3 = async () => {
  const fish = await User.findAll({
    where: {
      [Op.and]: [{ user_id: 7 }, { "$Orders.order_status$": 2 }],
    },
    include: [{ model: Order }],
  });
  return fish;
};

const ExecuteSQL = async () => {
  const fish = await Order.findOne({
    where: {
      [Op.and]: [{ order_status: 1 }, { "$User.user_id$": 3 }],
    },
    include: [{ model: User }],
  });
  console.log(fish);
  return fish;
};

const syncModel = async () => {
  // Category - Fish
  Categories.hasMany(Fish, { foreignKey: "category_id" });
  Fish.belongsTo(Categories, { foreignKey: "category_id" });

  // Fish - Image
  Fish.hasMany(ImageProduct, { foreignKey: "fish_id" });
  ImageProduct.belongsTo(Fish, { foreignKey: "fish_id" });

  // Fish_Size - Fish, Fish_Size - Size
  Fish.belongsToMany(Size, { through: Fish_Size, foreignKey: "fish_id" });
  Size.belongsToMany(Fish, { through: Fish_Size, foreignKey: "size_id" });
  Fish.hasMany(Fish_Size, { foreignKey: "fish_id" });
  Fish_Size.belongsTo(Fish, { foreignKey: "fish_id" });
  Size.hasMany(Fish_Size, { foreignKey: "size_id" });
  Fish_Size.belongsTo(Size, { foreignKey: "size_id" });

  // User - UserRole, Role - UserRole
  User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
  Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

  // Mới thêm
  UserRole.belongsTo(User, { foreignKey: "user_id" });
  UserRole.belongsTo(Role, { foreignKey: "role_id" });
  User.hasMany(UserRole, { foreignKey: "user_id" });
  Role.hasMany(UserRole, { foreignKey: "role_id" });

  // Rate - Fish, Rate - User
  User.belongsToMany(Fish, { through: Rate, foreignKey: "user_id" });
  Fish.belongsToMany(User, { through: Rate, foreignKey: "fish_id" });
  Fish.hasMany(Rate, { foreignKey: "fish_id" });
  User.hasMany(Rate, { foreignKey: "user_id" });
  Rate.belongsTo(Fish, { foreignKey: "fish_id" });
  Rate.belongsTo(User, { foreignKey: "user_id" });

  // Order - User
  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  // Order - OrderDetail
  Order.hasMany(OrderDetail, { foreignKey: "order_id" });
  OrderDetail.belongsTo(Order, { foreignKey: "order_id" });

  // Cart - User
  User.hasMany(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });

  // Fish - Cart
  Fish.hasMany(Cart, { foreignKey: "fish_id" });
  Cart.belongsTo(Fish, { foreignKey: "fish_id" });

  // Fish - Cart
  Size.hasMany(Cart, { foreignKey: "size_id" });
  Cart.belongsTo(Size, { foreignKey: "size_id" });

  // Fish - OrderDetail
  Fish.belongsTo(OrderDetail, { foreignKey: "fish_id" });
  OrderDetail.belongsTo(Fish, { foreignKey: "fish_id" });

  // Size - OrderDetail
  Size.belongsTo(OrderDetail, { foreignKey: "size_id" });
  OrderDetail.belongsTo(Size, { foreignKey: "size_id" });

  // await Categories.sync({ force: true }); // force
  // await Fish.sync({ force: true }); // alter
  // await ImageProduct.sync({ force: true }); // force
  // await Size.sync({ force: true }); // alter
  // await Fish_Size.sync({ force: true }); // force
  // await User.sync({ force: true }); // force
  // await Role.sync({ force: true }); // force
  // await UserRole.sync({ force: true }); // force
  // await Rate.sync({ force: true }); // force
  // await Order.sync({ force: true }); // force
  // await OrderDetail.sync({ force: true }); // force
  // await Coupon.sync({ force: true }); // force
  // await Cart.sync({ force: true }); // force
  // await Otp.sync({ force: true }); // force

  // await createDataTable();
};

syncModel();

const createDataTable = async () => {
  // await Categories.sync({ force: true }); // force
  // await Fish.sync({ force: true }); // alter
  // await ImageProduct.sync({ force: true }); // force
  // await Size.sync({ force: true }); // alter
  // await Fish_Size.sync({ force: true }); // force
  // await User.sync({ force: true }); // force
  // await Role.sync({ force: true }); // force
  // await UserRole.sync({ force: true }); // force
  // await Rate.sync({ force: true }); // force
  // await Order.sync({ force: true }); // force
  // await OrderDetail.sync({ force: true }); // force
  // await Coupon.sync({ force: true }); // force
  // await Cart.sync({ force: true }); // force
  // await Otp.sync({ force: true }); // force


  // Tạo 8 danh mục cá
  await createOneCategory("Cá Bảy Màu");
  await createOneCategory("Cá Thiên Đường");
  await createOneCategory("Cá Đuôi Kiếm");
  await createOneCategory("Cá Anh Đào");
  await createOneCategory("Cá Thần Tiên");
  await createOneCategory("Cá Mún");
  await createOneCategory("Cá Koi");
  await createOneCategory("Cá Betta");
  await createOneCategory("Cá Neon");

  // Tạo 6 con cá
  await createOneFish(
    "Cá Betta Halfmoon",
    "Cá Betta Halfmoon rất đẹp",
    true,
    "7 - 12",
    "28 - 30",
    "Cám, trùn chỉ",
    "Sống bầy đàn",
    "Nhật Bản",
    8
  );
  await createOneFish(
    "Cá Betta Galaxy Mix",
    "Cá Betta Galaxy rất đẹp",
    true,
    "5 - 7",
    "21 - 25",
    "Cám, bobo",
    "Sống theo đàn",
    "Chưa rõ nguồn gốc",
    8
  );
  await createOneFish(
    "Cá Neon Gấu Trúc - Paraguayensis Tetra",
    "Cá Neon Gấu Trúc rất đẹp",
    true,
    "7 - 12",
    "28 - 30",
    "Cám, trùn chỉ",
    "Sống tự do",
    "Việt Nam",
    9
  );
  await createOneFish(
    "Cá Neon Ngân Bình - Red Eye Tetra",
    "Cá Neon Ngân Bình rất đẹp",
    true,
    "6 - 9",
    "22 - 25",
    "Cám, trùn chỉ",
    "Sống tự do",
    "Hàn Quốc",
    9
  );
  await createOneFish(
    "Cá Neon Na Na - Nana Tetra",
    "Cá Neon Na Na rất đẹp",
    true,
    "7 - 12",
    "17 - 24",
    "Cám, trùn chỉ",
    "Sống bầy đàn",
    "Thái Lan",
    9
  );
  await createOneFish(
    "Cá Neon Hồng Nhung - Serpae Tetra",
    "Cá Neon Hồng Nhung rất đẹp",
    true,
    "7 - 12",
    "19 - 25",
    "Trùn chỉ",
    "Sống bầy đàn",
    "Tự nhiên",
    9
  );

  // Tạo ảnh cho sản phẩm
  await createOneImage(
    1,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/betta-halfmoon.jpg"
  );
  await createOneImage(
    2,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/betta-galaxy.jpg"
  );
  await createOneImage(
    3,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/rummynosetetra.jpg"
  );
  await createOneImage(
    4,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/redeyetetra.jpg"
  );
  await createOneImage(
    5,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/cananananatetra.jpg"
  );
  await createOneImage(
    6,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/serpaetetralongfin.jpg"
  );
  await createOneImage(
    6,
    "https://bizweb.dktcdn.net/thumb/large/100/424/759/products/serpaetetra.jpg"
  );

  // Tạo Size cá
  await createOneSize("2cm");
  await createOneSize("3cm");
  await createOneSize("2 - 3cm");
  await createOneSize("XL");
  await createOneSize("M");
  await createOneSize("XL");
  await createOneSize("S");
  await createOneSize("MAX");

  // Tạo Fish Size
  await createOneFishSize(1, 1, 25000, 100);
  await createOneFishSize(1, 2, 35000, 50);
  await createOneFishSize(2, 3, 40000, 120);
  await createOneFishSize(3, 1, 15000, 200);
  await createOneFishSize(4, 5, 30000, 90);
  await createOneFishSize(5, 6, 70000, 80);
  await createOneFishSize(6, 1, 95000, 10);
  await createOneFishSize(2, 7, 20000, 150);

  // Create One Role
  await createOneRole("ROLE_ADMIN", "Quản lý");
  await createOneRole("ROLE_EMPLOYEE", "Nhân viên");
  await createOneRole("ROLE_CUSTOMER", "Khách hàng");

  await createOneUser(
    "admin",
    "123",
    "ducngoc233@gmail.com",
    "Nghệ An",
    "Admin",
    "Nguyễn",
    "0378544081",
    2
  );
  await createOneUser(
    "nhanvien",
    "123",
    "kiemthecao.com@gmail.com",
    "",
    "Nhân",
    "Viên",
    "0379274722",
    2
  );
  await createOneUser(
    "khachhang",
    "123",
    "khachhang@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    2
  );
  await createOneUser(
    "ducngoc",
    "123",
    "ducngoc233@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    2
  );
  await createOneUser(
    "ngoc123",
    "123",
    "ducngoc233@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    3
  );
  await createOneUser(
    "hoang123",
    "123",
    "hoang123@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    2
  );
  await createOneUser(
    "hai123",
    "123",
    "hai123@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    2
  );
  await createOneUser(
    "nam123",
    "123",
    "nam123@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    3
  );
  await createOneUser(
    "duc123",
    "123",
    "duc123@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    2
  );
  await createOneUser(
    "tung123",
    "123",
    "tung123@gmail.com",
    "Vinh",
    "Ngọc",
    "Nguyễn",
    "",
    1
  );

  //
  await createOneRate(4, 1, 5, "Quá đẹp");
  await createOneRate(5, 1, 4, "Sản phẩm rẻ");
  await createOneRate(6, 2, 3, "Cá nhanh lớn");
  await createOneRate(7, 2, 2, "Cá ăn nhiều");
  await createOneRate(4, 3, 1, "Cá béo");
  await createOneRate(7, 4, 4, "Lượn như cá cảnh");
  await createOneRate(6, 5, 5, "Đáng mua lắm");

  await createOneFishImage();
  await createOneFishImage();
  await createOneFishImage();
  await createOneFishImage();
  await createOneFishImage();

  await createOneOrder(4, "0378274727", "Nghệ An", 0, "2023-07-02 12:23:00", 1);
  await createOneOrder(
    5,
    "0359372843",
    "Hải Phòng",
    0,
    "2023-08-02 3:15:00",
    2
  );
  await createOneOrder(6, "0372947213", "Hà Nội", 0, "2023-12-02 12:10:00", 3);
  await createOneOrder(
    null,
    "0372947213",
    "Hà Nội",
    10000,
    "2023-12-02 12:10:00",
    3
  );

  await createOneOrder_OrderDetail(
    7,
    "0372947213",
    "Hà Nội",
    0,
    "2023-12-02 12:10:00",
    1
  );

  await createOneCoupon(
    "GIAM10K",
    "Giảm 10% đơn hàng từ 10K tối đa 100K",
    10,
    10000,
    100000,
    "2023-12-27"
  );
};

module.exports = {
  sequelize,
  Categories,
  Fish,
  ImageProduct,
  Fish_Size,
  Size,
  User,
  Rate,
  Order,
  OrderDetail,
  Cart,
  UserRole,
  Role,
  Coupon,
  Otp,
};
