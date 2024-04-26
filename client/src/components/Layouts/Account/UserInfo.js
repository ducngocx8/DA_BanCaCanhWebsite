import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import UserStatistic from "./UserStatistic";
import { ApiLink, Title, notify, regexPhone } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";
export default function UserInfo({ username }) {
  let [info, setInfo] = useState({});

  let [errInfo, setErrInfo] = useState({
    phonenumber: "",
    firstname: "",
    lastname: "",
    address: "",
  });

  let [errPassword, setErrPassword] = useState({
    oldpassword: "",
    newpassword: "",
    renewpassword: "",
  });

  let [infoAccount, setInfoAccount] = useState({
    phonenumber: "",
    firstname: "",
    lastname: "",
    address: "",
  });

  let [inputPassword, setInputPassword] = useState({
    oldpassword: "",
    newpassword: "",
    renewpassword: "",
  });

  let navigate = useNavigate();

  useEffect(() => {
    document.title = Title.infoUser + Title.origin;
  }, []);

  useEffect(() => {
    async function getInfo() {
      const response = await axios.get(`${ApiLink.domain + "/account/info"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setInfo(response.data.data);
        const { address, firstname, lastname, phonenumber } =
          response.data.data;
        setInfoAccount({
          address,
          firstname,
          lastname,
          phonenumber,
        });
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
    }
    getInfo();
  }, [navigate]);

  const handleChangeInfoAccount = (e) => {
    const { name, value } = e.target;
    if (name === "phonenumber") {
      if (regexPhone.test(value) || value === "") {
        setErrInfo({ ...errInfo, [name]: "" });
      } else {
        setErrInfo({ ...errInfo, [name]: "Số điện thoại không hợp lệ 1" });
      }
    }
    console.log(e.target.value);
    setInfoAccount({ ...infoAccount, [name]: value });
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    if (name === "renewpassword") {
      if (inputPassword.newpassword !== value) {
        setErrPassword({
          ...errPassword,
          [name]: "Hai mật khẩu không giống nhau",
        });
      } else {
        setErrPassword({ ...errPassword, [name]: "" });
      }
    } else if (name === "newpassword") {
      if (value.length < 3) {
        setErrPassword({
          ...errPassword,
          [name]: "Mật khẩu mới từ 3 ký tự trở lên",
        });
      } else {
        setErrPassword({ ...errPassword, [name]: "" });
      }
    }
    setInputPassword({ ...inputPassword, [name]: value });
  };

  const handleChangePasswordSubmit = async () => {
    const newError = { ...errPassword };
    let check = true;
    if (inputPassword.newpassword.trim().length < 3) {
      newError.oldpassword = "Vui lòng điền mật khẩu";
      check = false;
    }
    if (inputPassword.newpassword.trim().length < 3) {
      newError.newpassword = "Mật khẩu mới đang dưới 3 ký tụ";
      check = false;
    }
    if (inputPassword.newpassword !== inputPassword.renewpassword) {
      newError.renewpassword = "Hai mật khẩu không giống nhau";
      check = false;
    }
    if (check) {
      const response = await axios.post(
        `${ApiLink.domain + "/account/info/update_password"}`,
        inputPassword,
        {
          withCredentials: true,
        }
      );
      notify(response.data.status, response.data.message);
      if (response.data.status) {
        setInfo(response.data.data);
        console.log(response.data.message);
      }
    } else {
      setErrPassword({ ...newError });
    }
  };

  const handleChangeInfoSubmit = async () => {
    if (infoAccount.phonenumber.length !== 0) {
      console.log(infoAccount.phonenumber);
      const result = regexPhone.test(infoAccount.phonenumber);
      if (result === false) {
        return;
      }
    }
    const response = await axios.post(
      `${ApiLink.domain + "/account/info/update_info"}`,
      infoAccount,
      {
        withCredentials: true,
      }
    );
    notify(response.data.status, response.data.message);
    if (response.data.status) {
      setInfo(response.data.data);
      console.log(response.data.message);
    }
  };

  return (
    <Fragment>
      <div id="main">
        <div className="page-content">
          <section className="row">
            <div className="col-12 col-lg-12">
              {<UserStatistic username={username} />}
              <div className="row">
                <div className="col-12">
                  <div
                    className="col-lg-12 stretch-card"
                    style={{ padding: 0 }}
                  >
                    <div className="card">
                      <div className="card-body">
                        <h4
                          className="card-title"
                          style={{ marginBottom: 20, textAlign: "center" }}
                        >
                          Chỉnh sửa thông tin tài khoản
                        </h4>
                        <div
                          className="col-12"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div className="col-6">
                            <div id="form_edit_info_submit">
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">
                                  Tên Đăng Nhập
                                </label>
                                <input
                                  className="form-control showordisable"
                                  name="username"
                                  disabled
                                  defaultValue={info.username}
                                  type="text"
                                  placeholder="Nhập tên tài khoản"
                                />
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">
                                  Địa chỉ Email
                                </label>
                                <input
                                  className="form-control showordisable"
                                  id="info_email_input"
                                  name="email"
                                  disabled
                                  defaultValue={info.email}
                                  type="email"
                                  placeholder="Nhập địa chỉ email"
                                />
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">
                                  Số điện thoại
                                </label>
                                <input
                                  className="form-control showordisable"
                                  id="info_phone_input"
                                  name="phonenumber"
                                  defaultValue={info.phonenumber}
                                  type="number"
                                  placeholder="Nhập số điện thoại"
                                  onInput={(e) => handleChangeInfoAccount(e)}
                                />
                                {errInfo.phonenumber === "" ? (
                                  ""
                                ) : (
                                  <p
                                    className="text-danger"
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {errInfo.phonenumber}
                                  </p>
                                )}
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">First Name</label>
                                <input
                                  className="form-control showordisable"
                                  name="firstname"
                                  defaultValue={info.firstname}
                                  type="text"
                                  placeholder="Nhập tên của bạn"
                                  onInput={(e) => handleChangeInfoAccount(e)}
                                />
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">Last Name</label>
                                <input
                                  className="form-control showordisable"
                                  name="lastname"
                                  defaultValue={info.lastname}
                                  type="text"
                                  placeholder="Nhập họ của bạn"
                                  onInput={(e) => handleChangeInfoAccount(e)}
                                />
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">Địa chỉ</label>
                                <input
                                  className="form-control showordisable"
                                  name="address"
                                  defaultValue={info.address}
                                  type="text"
                                  placeholder="Nhập địa chỉ hiện tại"
                                  onInput={(e) => handleChangeInfoAccount(e)}
                                />
                              </div>
                              <div
                                style={{
                                  marginBottom: 20,
                                  textAlign: "center",
                                }}
                              >
                                <button
                                  type="button"
                                  id="btn_edit_info"
                                  className="btn btn-success"
                                  onClick={() => handleChangeInfoSubmit()}
                                >
                                  Cập nhật thông tin
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div
                    className="col-lg-12 stretch-card"
                    style={{ padding: 0 }}
                  >
                    <div className="card">
                      <div className="card-body">
                        <h4
                          className="card-title"
                          style={{ marginBottom: 20, textAlign: "center" }}
                        >
                          Thay đổi mật khẩu
                        </h4>
                        <div
                          className="col-12"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div className="col-6">
                            <div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">
                                  Nhập mật khẩu cũ
                                </label>
                                <input
                                  className="form-control showordisable"
                                  name="oldpassword"
                                  type="password"
                                  onInput={(e) => handleChangePassword(e)}
                                  autoComplete="current-password"
                                  placeholder="Nhập mật khẩu cũ"
                                />
                                {errPassword.oldpassword === "" ? (
                                  ""
                                ) : (
                                  <p
                                    className="text-danger"
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {errPassword.oldpassword}
                                  </p>
                                )}
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">
                                  Nhập mật khẩu mới
                                </label>
                                <input
                                  className="form-control showordisable"
                                  name="newpassword"
                                  type="password"
                                  autoComplete="current-password"
                                  onInput={(e) => handleChangePassword(e)}
                                  placeholder="Nhập mật khẩu mới"
                                />
                                {errPassword.newpassword === "" ? (
                                  ""
                                ) : (
                                  <p
                                    className="text-danger"
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {errPassword.newpassword}
                                  </p>
                                )}
                              </div>
                              <div style={{ marginBottom: 20 }}>
                                <label className="form-label">
                                  Nhập lại mật khẩu mới
                                </label>
                                <input
                                  className="form-control showordisable"
                                  name="renewpassword"
                                  type="password"
                                  autoComplete="current-password"
                                  onInput={(e) => handleChangePassword(e)}
                                  placeholder="Nhập lại mật khẩu mới"
                                />
                                {errPassword.renewpassword === "" ? (
                                  ""
                                ) : (
                                  <p
                                    className="text-danger"
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {errPassword.renewpassword}
                                  </p>
                                )}
                              </div>
                              <div
                                style={{
                                  marginBottom: 20,
                                  textAlign: "center",
                                }}
                              >
                                <button
                                  onClick={() => handleChangePasswordSubmit()}
                                  className="btn btn-success"
                                >
                                  Cập nhật mật khẩu
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
}
