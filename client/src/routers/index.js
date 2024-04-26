import Home from "../pages/Home";
import LoginSignup from "../pages/LoginSignup";
import Login from "../components/Layouts/UserLogin/Login";
import Signup from "../components/Layouts/UserLogin/Signup";
import CartUser from "../pages/CartUser";
import Cart from "../components/Layouts/Account/Cart";
import OrderHistory from "../components/Layouts/Account/OrderHistory";
import UserInfo from "../components/Layouts/Account/UserInfo";
import ForgotPassword from "../components/Layouts/UserLogin/ForgotPassword";
import ProductDetail from "../pages/ProductDetail";
import ProductCategory from "../pages/ProductCategory";
import RateAdmin from "../components/Layouts/Admin/RateAdmin";
import OrderAdmin from "../components/Layouts/Admin/OrderAdmin";
import CategoryAdmin from "../components/Layouts/Admin/CategoryAdmin";
import CouponAdmin from "../components/Layouts/Admin/CouponAdmin";
import ProductAdmin from "../components/Layouts/Admin/ProductAdmin";
import CustomerAdmin from "../components/Layouts/Admin/CustomerAdmin";
import StatisticsAdmin from "../components/Layouts/Admin/StatisticsAdmin";
import RoleAdmin from "../components/Layouts/Admin/RoleAdmin";
import Logout from "../components/Layouts/Account/Logout";
import SizeAdmin from "../components/Layouts/Admin/SizeAdmin";
import AdminPage from "../pages/Admin";
import OTPAdmin from "../components/Layouts/Admin/OTPAdmin";
import ResendEmail from "../components/Layouts/UserLogin/ResendEmail";
import VerifyEmail from "../components/Layouts/UserLogin/VerifyEmail";
import Search from "../pages/Search";
import DeliveryPage from "../pages/Delivery";
import DeliveryOrder from "../components/Layouts/Delivery/DeliveryOrder";
import InvoiceLayout from "../components/Layouts/SympleLayout/Invoice";
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/account/login", component: LoginSignup, layout: Login },
  { path: "/account/signup", component: LoginSignup, layout: Signup },
  { path: "/account/lost-password", component: LoginSignup, layout: ForgotPassword },
  { path: "/account/verify/email/:email/:token", component: LoginSignup, layout: VerifyEmail },
  { path: "/account/resend-email", component: LoginSignup, layout: ResendEmail },
  { path: "/account/cart", component: CartUser, layout: Cart, active_id: 2 },
  { path: "/account/order", component: CartUser, layout: OrderHistory, active_id: 3 },
  { path: "/account/info", component: CartUser, layout: UserInfo, active_id: 1 },
  { path: "/account/logout", component: Logout },
  {
    path: "/category/:id",
    component: ProductCategory,
  },
  {
    path: "/product/:id",
    component: ProductDetail,
  },
];

const privateRoutes = [
  {
    path: "/admin/rate",
    component: AdminPage,
    layout: RateAdmin,
    active_id: "ADMIN_RATE",
  },
  {
    path: "/admin/order",
    component: AdminPage,
    layout: OrderAdmin,
    active_id: "ADMIN_ORDER",
  },
  {
    path: "/admin/category",
    component: AdminPage,
    layout: CategoryAdmin,
    active_id: "ADMIN_CATEGORY",
  },
  {
    path: "/admin/product",
    component: AdminPage,
    layout: ProductAdmin,
    active_id: "ADMIN_PRODUCT",
  },
  {
    path: "/admin/customer",
    component: AdminPage,
    layout: CustomerAdmin,
    active_id: "ADMIN_CUSTOMER",
  },
  {
    path: "/admin/statistic",
    component: AdminPage,
    layout: StatisticsAdmin,
    active_id: "ADMIN_STATISTIC",
  },
  {
    path: "/admin/size",
    component: AdminPage,
    layout: SizeAdmin,
    active_id: "ADMIN_SIZE",
  },
  {
    path: "/admin/coupon",
    component: AdminPage,
    layout: CouponAdmin,
    active_id: "ADMIN_COUPON",
  },
  {
    path: "/admin/role",
    component: AdminPage,
    layout: RoleAdmin,
    active_id: "ADMIN_ROLE",
  },
  {
    path: "/admin/otp",
    component: AdminPage,
    layout: OTPAdmin,
    active_id: "ADMIN_OTP",
  },
  {
    path: "/delivery/order",
    component: DeliveryPage,
    layout: DeliveryOrder,
    active_id: "DELIVERY_ORDER",
  },
  {
    path: "/search",
    component: Search,
  },
  {
    path: "/invoice",
    component: InvoiceLayout,
  },
];

export { publicRoutes, privateRoutes };
