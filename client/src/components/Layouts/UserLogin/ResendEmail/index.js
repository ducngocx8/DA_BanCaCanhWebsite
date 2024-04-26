import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiLink, Title, notify } from "../../../../Utils/Title";
export default function ResendEmail() {
  let [info, setInfo] = useState({
    email: "",
  });

   useEffect(() => {
     document.title = Title.resendEmail + Title.origin;
   }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSendEmail = async () => {
    const user = {
      email: info.email,
    };
    const response = await axios.post(
      `${ApiLink.domain + "/mail/resend-email"}`,
      user,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
    } else {
      notify(false, response.data.message);
    }
  };

  return (
    <div className="signup_container_left">
      <h2>Gửi lại Email xác thực</h2>
      <div className="form_signup">
        <div className="input_sign flex-col">
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
            Gửi lại
          </button>
        </div>
      </div>
      <div className="login_signin">
        Bạn đã có tài khoản <Link to="/account/login">Đăng nhập</Link>
      </div>
      <div className="losspass">
        <Link to="/account/signup">Chưa có tài khoản</Link>
      </div>
    </div>
  );
}
