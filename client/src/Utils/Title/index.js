import { toast } from "react-toastify";
const Title = {
  origin: " - Chuyên kinh doanh cá cảnh",
  sigup: "Đăng ký tài khoản",
  login: "Đăng nhập tài khoản",
  forgotPassword: "Quên mật khẩu",
  verifyEmail: "Xác thực tài khoản",
  resendEmail: "Lấy lại link xác thực",
  search: "Kết quả tìm kiếm cho ",
  notFound: "Trang tìm kiếm không tồn tại",
  infoUser: "Thông tin tài khoản",
  orderUser: "Lịch sử mua hàng",
  cartUser: "Giỏ hàng",
};

const ApiLink = {
  domain: "http://localhost:7000/api",
};

// const regexEmail = new RegExp("[a-z0-9]+@gmail.com");
const regexEmail = /^[a-z0-9]+@gmail.com+$/;
const regexUsername = /^[a-zA-Z0-9]+$/;
const regexPhone = /(0[3|5|7|8|9])+([0-9]{8})\b/;

const toast_config = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const isAuth = () => {
  const user = JSON.parse(localStorage.getItem("userLogin"));
  if (user) {
    return true;
  }
  return false;
};

const notify = (success, message) => {
  if (success) {
    toast.success(message, toast_config);
  } else {
    toast.error(message, toast_config);
  }
};

const convertToDateOnly = (time) => {
  const date = new Date(Number(Date.parse(time)));
  return date.toLocaleDateString();
};

const convertToDate = (time) => {
  const date = new Date(Number(Date.parse(time)));
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const noImage =
  "https://img.freepik.com/free-vector/no-multiply-font-vector-text-typography_53876-168227.jpg";

export {
  Title,
  ApiLink,
  toast_config,
  regexEmail,
  regexUsername,
  isAuth,
  regexPhone,
  notify,
  convertToDateOnly,
  convertToDate,
  noImage,
};
