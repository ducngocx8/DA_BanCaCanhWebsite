const BACKEND_BASE = "http://localhost:7000/api";
const FRONTEND_BASE = "http://localhost:3000";
const CryptoJS = require("crypto-js");
var { nanoid } = require("nanoid");
var regexUsername = /^[a-zA-Z0-9]+$/;
var regexRoleCode = /^[a-zA-Z0-9_]+$/;
var regexEmail = /^[a-z0-9]+@gmail.com+$/;
const regexPhone = /(0[3|5|7|8|9])+([0-9]{8})\b/;
const decodePassword = (password) => {
  return CryptoJS.AES.decrypt(password, "duc_ngoc_123").toString(
    CryptoJS.enc.Utf8
  );
};

const encodePassword = (password) => {
  return CryptoJS.AES.encrypt(password, "duc_ngoc_123").toString();
};

const createToken = () => {
  return nanoid(64);
};

const admin_code = "ROLE_ADMIN";
const customer_code = "ROLE_CUSTOMER";
const employee_code = "ROLE_EMPLOYEE";
const delivery_code = "ROLE_DELIVERY";

module.exports = {
  decodePassword,
  encodePassword,
  regexUsername,
  regexEmail,
  regexPhone,
  admin_code,
  customer_code,
  employee_code,
  delivery_code,
  regexRoleCode,
  createToken,
  BACKEND_BASE,
  FRONTEND_BASE,
  delivery_code,
};
