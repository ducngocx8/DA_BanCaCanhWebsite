import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ApiLink, Title, notify } from "../../../../Utils/Title";
export default function Login() {
  let navigate = useNavigate();
  let [user, setUser] = useState({
    // username: "ngocloc",
    // password: "ngocloc",
    username: "",
    password: "",
  });

  let [error, setError] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    document.title = Title.login + Title.origin;
  }, []);

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      const regexUsername = /^[a-zA-Z0-9]+$/;
      if (!regexUsername.test(value)) {
        setError({
          ...error,
          [name]: "Username không hợp lệ.",
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

  const loginApi = async (user) => {
    return await axios
      .post(`${ApiLink.domain + "/account/login"}`, user, {
        withCredentials: true,
      })
      .then((response) => {
        return response.data;
      });
  };

  const handleLoginButton = async () => {
    const { username, password } = user;
    const regexUsername = /^[a-zA-Z0-9]+$/;
    let oldError = { ...error };
    let check = true;
    if (!regexUsername.test(username)) {
      oldError.username = "Username không hợp lệ.";
      check = false;
    }
    if (password.trim() === "") {
      oldError.password = "Vui lòng điền password.";
      check = false;
    }
    if (check === false) {
      setError({ ...oldError });
    } else {
      const result = await loginApi(user);
      if (!result.status) {
        notify(false, result.message);
      } else {
        notify(true, result.message);
        setUser({
          username: "",
          password: "",
        });
        if (
          result.userLogin.roles.includes("ROLE_ADMIN") ||
          result.userLogin.roles.includes("ROLE_EMPLOYEE")
        ) {
          return navigate("/admin/statistic", { replace: true });
        } else if (result.userLogin.roles.includes("ROLE_DELIVERY")) {
           return navigate("/delivery/order", { replace: true });
        } else if (result.userLogin.roles.includes("ROLE_CUSTOMER")) {
          return navigate("/account/info", { replace: true });
        } else {
          return navigate("/", { replace: true });
        }
      }
    }
  };
  return (
    <div className="signup_container_left">
      <h2>Đăng Nhập Tài Khoản</h2>
      <div className="form_signup">
        <div className="input_sign input_username flex-col">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            onChange={(e) => handleChangeValue(e)}
            value={user.username}
          />
          {error.username.length === 0 ? (
            ""
          ) : (
            <div className="error">{error.username}</div>
          )}
        </div>
        <div className="input_sign input_password flex-col">
          <label>Mật khẩu</label>
          <input
            type="password"
            onChange={(e) => handleChangeValue(e)}
            name="password"
            value={user.password}
          />
        </div>
        {error.password.length === 0 ? (
          ""
        ) : (
          <div className="error">{error.password}</div>
        )}
        <div
          className="check_remember"
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 7,
            color: "red",
          }}
        ></div>
        <div className="btn_signup_signin flex_center mg-10_0">
          <button className="btn" onClick={() => handleLoginButton()}>
            Đăng Nhập
          </button>
        </div>
      </div>
      <div className="login_signin">
        Bạn chưa có tài khoản <Link to="/account/signup">Đăng ký</Link>
      </div>
      <div className="losspass">
        <Link to="/account/lost-password">Quên mật khẩu</Link>
      </div>
    </div>
  );
}
