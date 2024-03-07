const express = require("express")
const customerCategoryRoute = require("./Customer/customer.category.router");
const customerProductRoute = require("./Customer/customer.product.router");
const customerCartRoute = require("./Customer/customer.cart.router");
const customerOrderRoute = require("./Customer/customer.order.router");
const customerRateRoute = require("./Customer/customer.rate.router");
const acountRoute = require("./account.router");
const mailRoute = require("./mail.router");

// admin
const adminRateRoute = require("./Admin/admin.rate.router");
const adminCategoryRoute = require("./Admin/admin.category.router");
const adminSizeRoute = require("./Admin/admin.size.router");
const adminOrderRoute = require("./Admin/admin.order.router");
const adminProductRoute = require("./Admin/admin.product.router");
const adminImageRoute = require("./Admin/admin.image.router");
const adminPriceRoute = require("./Admin/admin.price.router");
const adminCouponRoute = require("./Admin/admin.coupon.router");
const adminUserRoute = require("./Admin/admin.user.router");
const adminRoleUserRoute = require("./Admin/admin.roleuser.router");
const adminRoleRoute = require("./Admin/admin.role.router");
const adminStatisticRoute = require("./Admin/admin.statistic.router");
const adminOTPRoute = require("./Admin/admin.otp.router");
const checkRoute = require("./check.router");
const adminCartRoute = require("./Admin/admin.cart.router");
const { verifyToken, checkUserToken } = require("../middlewares/validations/account.validation");
const { customerPermission, admin_employee_Permission, adminPermission, allPermission, deliveryPermission } = require("../middlewares/permission");
const couponRouter = require("./coupon.router");
const deliveryRouter = require("./Delivery/delivery.router");

const rootRouter = express.Router()
rootRouter.use("/api/category", customerCategoryRoute);
rootRouter.use("/api/product", customerProductRoute);
rootRouter.use("/api/cart", verifyToken, checkUserToken, customerPermission, customerCartRoute);
rootRouter.use("/api/order",  verifyToken, checkUserToken, allPermission, customerOrderRoute);
rootRouter.use("/api/account", acountRoute);
rootRouter.use("/api/rate", customerRateRoute);
rootRouter.use("/api/mail", mailRoute);
rootRouter.use("/api/check", checkRoute);
rootRouter.use("/api/coupon", couponRouter);
rootRouter.use("/api/delivery", verifyToken, checkUserToken, deliveryPermission, deliveryRouter);


rootRouter.use("/api/admin/rate", verifyToken, checkUserToken, admin_employee_Permission, adminRateRoute);
rootRouter.use("/api/admin/category", verifyToken, checkUserToken, admin_employee_Permission, adminCategoryRoute);
rootRouter.use("/api/admin/size", verifyToken, checkUserToken, admin_employee_Permission, adminSizeRoute);
rootRouter.use("/api/admin/order", verifyToken, checkUserToken, admin_employee_Permission, adminOrderRoute);
rootRouter.use("/api/admin/product", verifyToken, checkUserToken, admin_employee_Permission, adminProductRoute);
rootRouter.use("/api/admin/image", verifyToken, checkUserToken, admin_employee_Permission, adminImageRoute);
rootRouter.use("/api/admin/price", verifyToken, checkUserToken, admin_employee_Permission, adminPriceRoute);
rootRouter.use("/api/admin/statistic", verifyToken, checkUserToken, admin_employee_Permission, adminStatisticRoute);
rootRouter.use("/api/admin/cart", verifyToken, checkUserToken, admin_employee_Permission, adminCartRoute);
rootRouter.use("/api/admin/otp",  verifyToken, checkUserToken, adminPermission, adminOTPRoute);
rootRouter.use("/api/admin/coupon", verifyToken, checkUserToken, adminPermission, adminCouponRoute);
rootRouter.use("/api/admin/user", verifyToken, checkUserToken, adminPermission, adminUserRoute);
rootRouter.use("/api/admin/roleuser", verifyToken, checkUserToken, adminPermission,adminRoleUserRoute);
rootRouter.use("/api/admin/role", verifyToken, checkUserToken, adminPermission, adminRoleRoute);


module.exports = rootRouter;