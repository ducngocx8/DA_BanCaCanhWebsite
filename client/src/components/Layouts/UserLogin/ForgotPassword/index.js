import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiLink, Title, notify } from "../../../../Utils/Title";
export default function ForgotPassword() {
  let navigate = useNavigate();
  let [sentEmail, setSendEmail] = useState(false);
  let [info, setInfo] = useState({
    otp_code: "",
    password: "",
    repassword: "",
    username: "",
    email: "",
  });

   useEffect(() => {
     document.title = Title.forgotPassword + Title.origin;
   }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };
  const handleSendEmail = async () => {
    const user = {
      email: info.email,
      username: info.username,
    };
    const response = await axios.post(
      `${ApiLink.domain + "/mail/forgot-password"}`,
      user,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      setSendEmail(true);
    } else {
      notify(false, response.data.message);
    }
  };

  const handleChangePassword = async () => {
    if (info.password !== info.repassword) {
      notify(false, "Hai mật khẩu không giống nhau.");
      return;
    }
    const user = {
      email: info.email,
      otp_code: info.otp_code,
      password: info.password,
    };
    const response = await axios.post(
      `${ApiLink.domain + "/account/forgot/password"}`,
      user,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      // setInfo({
      //   otp_code: "",
      //   password: "",
      //   repassword: "",
      //   username: "",
      //   email: "",
      // });
      // setSendEmail(false);
      return navigate("/account/login", { replace: true });
    } else {
      notify(false, response.data.message);
    }
  };
  return (
    <div className="signup_container_left">
      <h2>Cấp lại mật khẩu</h2>
      {sentEmail ? (
        <div className="form_signup">
          <div className="input_sign input_username flex-col">
            <label>Mã OTP</label>
            <input
              type="number"
              name="otp_code"
              onChange={(e) => handleOnChange(e)}
              value={info.otp_code}
            />
          </div>
          <div className="input_sign input_phone flex-col">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="password"
              onChange={(e) => handleOnChange(e)}
              value={info.password}
            />
          </div>
          <div className="input_sign input_phone flex-col">
            <label>Nhập lại mật khẩu mới</label>
            <input
              type="password"
              name="repassword"
              onChange={(e) => handleOnChange(e)}
              value={info.repassword}
            />
          </div>
          <div className="btn_signup_signin flex_center mg-10_0">
            <button className="btn" onClick={() => handleChangePassword()}>
              Đổi mật khẩu
            </button>
          </div>
        </div>
      ) : (
        <div className="form_signup">
          <div className="input_sign input_username flex-col">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              onChange={(e) => handleOnChange(e)}
              value={info.username}
            />
          </div>
          <div className="input_sign input_phone flex-col">
            <label>Địa chỉ Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => handleOnChange(e)}
              value={info.email}
            />
          </div>
          <div className="btn_signup_signin flex_center mg-10_0">
            <button onClick={() => handleSendEmail()} className="btn">
              Cấp lại mật khẩu
            </button>
          </div>
        </div>
      )}

      <div className="login_signin">
        Bạn đã có tài khoản <Link to="/account/login">Đăng nhập</Link>
      </div>
      <div className="losspass">
        <Link to="/account/resend-email">Gửi lại Email xác thực</Link>
      </div>
    </div>
  );
}
