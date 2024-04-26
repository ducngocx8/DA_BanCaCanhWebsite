import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ApiLink,
  Title,
  notify,
  regexEmail,
  regexUsername,
} from "../../../../Utils/Title";
export default function Signup() {
   let navigate = useNavigate();
  let [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

  let [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

   useEffect(() => {
     document.title = Title.sigup + Title.origin;
   }, []);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      if (!regexUsername.test(value) || value.trim().length < 3) {
        setError({
          ...error,
          [name]: "Username không hợp lệ hoặc dưới 3 ký tự",
        });
      } else {
        setError({
          ...error,
          [name]: "",
        });
      }
    } else if (name === "email") {
      if (!regexEmail.test(value)) {
        setError({
          ...error,
          [name]: "Email chỉ chấp nhận @gmail.com",
        });
      } else {
        setError({
          ...error,
          [name]: "",
        });
      }
    } else if (name === "repassword") {
      if (value !== user.password) {
        setError({
          ...error,
          [name]: "Mật khẩu không trùng nhau.",
        });
      } else {
        setError({
          ...error,
          [name]: "",
        });
      }
    } else {
      if (value.trim() === "") {
        setError({
          ...error,
          [name]: "Vui lòng điền " + name,
        });
      } else {
        setError({
          ...error,
          [name]: "",
        });
      }
    }
    setUser({ ...user, [name]: value });
  };

  const signupAPI = async (user) => {
    let bodyUser = {
      username: user.username,
      email: user.email,
      password: user.password,
    };
    return await axios
      .post(`${ApiLink.domain + "/account/signup"}`, bodyUser)
      .then((response) => {
        return response.data;
      });
  };

  const handleSignupButton = async () => {
    const { username, email, password, repassword } = user;
    let oldError = { ...error };
    let check = true;
    if (!regexUsername.test(username) || username.trim().length < 3) {
      oldError.username = "Username không hợp lệ hoặc dưới 3 ký tự.";
      check = false;
    }
    if (!regexEmail.test(email)) {
      oldError.email = "Email chỉ chấp nhận @gmail.com";
      check = false;
    }
    if (password.trim() === "") {
      oldError.password = "Vui lòng điền password.";
      check = false;
    }
    if (repassword.trim() === "" || repassword !== password) {
      oldError.repassword = "Hai mật khẩu không giống nhau.";
      check = false;
    }
    if (check === false) {
      setError({ ...oldError });
    } else {
      const result = await signupAPI(user);
      if (!result.status) {
        notify(false, result.message);
      } else {
        notify(true, result.message);
        return navigate("/account/login", { replace: true });
      }
    }
  };

  return (
    <div className="signup_container_left">
      <h2>Đăng Ký Tài Khoản</h2>
      <div className="form_signup">
        <div className="input_sign input_username flex-col">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            onChange={(e) => handleChangeValue(e)}
            value={user.username}
          />
        </div>
        {error.username === "" ? (
          ""
        ) : (
          <div className="error">{error.username}</div>
        )}
        <div className="input_sign input_phone flex-col">
          <label>Địa chỉ Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => handleChangeValue(e)}
            value={user.email}
          />
        </div>
        {error.email === "" ? "" : <div className="error">{error.email}</div>}
        <div className="input_sign input_password flex-col">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => handleChangeValue(e)}
          />
        </div>
        {error.password === "" ? (
          ""
        ) : (
          <div className="error">{error.password}</div>
        )}
        <div className="input_sign input_password flex-col">
          <label>Nhập lại mật khẩu</label>
          <input
            type="password"
            name="repassword"
            value={user.repassword}
            onChange={(e) => handleChangeValue(e)}
          />
        </div>
        {error.repassword === "" ? (
          ""
        ) : (
          <div className="error">{error.repassword}</div>
        )}
        <div className="btn_signup_signin flex_center mg-10_0">
          <button className="btn" onClick={() => handleSignupButton()}>
            Đăng Ký
          </button>
        </div>
      </div>
      <div className="login_signin">
        Bạn đã có tài khoản <Link to="/account/login">Đăng nhập</Link>
      </div>
      <div className="losspass">
        <Link to="/account/lost-password">Quên mật khẩu</Link>
      </div>
    </div>
  );
}
