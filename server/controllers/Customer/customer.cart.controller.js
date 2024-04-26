const {
  addToCartService,
  removeFromCartService,
  checkFishSize,
  checkInventoryInsert,
  updateCartService,
  getCartByUserService,
  addOrderService,
  checkCouponService,
  checkFishService,
} = require("../../services/Customer/customer.cart.service");

const addToCart = async (req, res) => {
  const { user_id } = req.userLogin;
  const fishDetail = req.body;
  // Check size - fish có tồn tại trong FishSize
  const check_fish = await checkFishService(fishDetail.fish_id);
  if(check_fish){
    if(check_fish.fish_status === false){
      return res.status(201).send({
        status: false,
        message: "Rất tiếc, sản phẩm đã ngừng kinh doanh.",
      });
    }
  }
  const checkFS = await checkFishSize(fishDetail);
  if (checkFS) {
    const checkQuantyAdd = await checkInventoryInsert(user_id, fishDetail, 1);
    if (checkQuantyAdd.status) {
      const resutl = await addToCartService(user_id, fishDetail);
      res.status(201).send(resutl);
    } else {
      res.status(201).send(checkQuantyAdd);
      return;
    }
  } else {
    res.status(201).send({
      status: false,
      message: "Size_id và Fish_id không tồn tại",
    });
    return;
  }
};

const removeFromCart = async (req, res) => {
 const { user_id } = req.userLogin;
  const fishDetail = req.body;
  const result = await removeFromCartService(user_id, fishDetail);
  res.status(201).send(result);
};

const updateCart = async (req, res) => {
  const { user_id } = req.userLogin;
  const fishDetail = req.body;
  console.log(fishDetail);
  const update = await updateCartService(user_id, fishDetail);
  res.status(201).send(update);
};

const getCartByUser = async (req, res) => {
  const { user_id } = req.userLogin;
  const result = await getCartByUserService(user_id);
  res.status(200).send({
    status: true,
    data: result,
  });
};

const addOrder = async (req, res) => {
 const { user_id } = req.userLogin;
  const orderBody = req.body;
  const result = await addOrderService(user_id, orderBody);
  res.status(200).send(result);
};

const checkCoupon = async (req, res) => {
 const { user_id } = req.userLogin;
  if(req.body){
     const { coupon_code } = req.body;
     if (coupon_code) {
       const couponCheck = await checkCouponService(coupon_code, user_id);
       if (couponCheck) {
         return res.status(200).send({ status: true, data: couponCheck });
       } else {
         return res.status(200).send({
           status: false,
           message: "Coupon không tồn tại hoặc đã hết hạn sử dụng",
         });
       }
     } else {
       return res.status(200).send({
         status: false,
         message: "Bạn chưa điền mã coupon",
       });
     }
  }else{
    return res.status(200).send({
      status: false,
      message: "Bạn chưa điền mã coupon",
    });
  }
}

module.exports = {
  addToCart,
  removeFromCart,
  updateCart,
  getCartByUser,
  addOrder,
  checkCoupon,
};
