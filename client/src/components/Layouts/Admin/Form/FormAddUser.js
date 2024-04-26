import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ApiLink,
  notify,
  regexEmail,
  regexPhone,
  regexUsername,
} from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";

export default function FormAddUser({ closeFormAdd, loadData }) {
  let [roleList, setRoleList] = useState([]);
  let navigate = useNavigate();
  let [UserRoles, setUserRoles] = useState([]);
  let [userState, setUserState] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
    user_status: true,
    role: {
      role_id: -1,
      role_name: "",
    },
  });
  useEffect(() => {
    async function getAllRole() {
      const response = await axios.get(`${ApiLink.domain + "/admin/role"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setRoleList(response.data.data); // status, data
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    }
    getAllRole();
  }, [navigate]);

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    if (name === "role") {
      const role_find = roleList.find(
        (item) => Number(item.role_id) === Number(value)
      );
      if (role_find) {
        value = {
          role_id: role_find.role_id,
          role_name: role_find.role_name,
        };
      } else {
        value = {
          role_id: -1,
          role_name: "",
        };
      }
    }
    setUserState({ ...userState, [name]: value });
  };

  const handleAddRole = () => {
    const role = userState.role;
    if (!role || Number(role.role_id === -1)) {
      notify(false, "Vui lòng chọn quyền hạn");
      return;
    }
    const role_find = UserRoles.findIndex(
      (item) => Number(item.role_id) === Number(role.role_id)
    );
    if (role_find !== -1) {
      notify(false, "User đã được cấp quyền này trước đó.");
    } else {
      const newRole = {
        role_id: role.role_id,
        role_name: role.role_name,
      };
      setUserRoles([...UserRoles, newRole]);
      setUserState({
        ...userState,
        role: { role_id: -1, role_name: "" },
      });
      notify(true, "Thêm quyền cho người dùng thành công");
    }
  };

  console.log("userState", userState);

  const handleRemoveRole = (role_id) => {
    const role_find = UserRoles.findIndex(
      (item) => Number(item.role_id) === Number(role_id)
    );
    if (role_find === -1) {
      notify(false, "Người dùng không sở hữu quyền hạn này.");
    } else {
      UserRoles.splice(role_find, 1);
      setUserRoles([...UserRoles]);
      notify(true, "Xóa quyền hạn người dùng thành công");
    }
  };

  const addUser = async (newUser) => {
    const response = await axios.post(
      `${ApiLink.domain + "/admin/user"}`,
      newUser,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      loadData(response.data.data);
      closeFormAdd(true, false);
    } else {
      notify(false, response.data.message);
      if (response.data.must === "login") {
        window.localStorage.clear();
        return navigate("/", { replace: true });
      } else if (response.data.must === "permission") {
        return navigate("/", { replace: true });
      }
    }
  };

  const handleAddUser = async () => {
    console.log("useState", userState);
    if (!regexUsername.test(userState.username.trim())) {
      notify(false, "Vui lòng điền Username");
      return;
    } else if (!regexEmail.test(userState.email.trim())) {
      notify(false, "Địa chỉ Email không hợp lệ");
      return;
    } else if (userState.password.trim() < 3) {
      notify(false, "Vui lòng điền password >= 3 ký tự");
      return;
    } else if (userState.phonenumber.trim() !== "") {
      if (!regexPhone.test(userState.phonenumber.trim())) {
        notify(false, "Số điện thoại không hợp lệ");
        return;
      }
    } else if (
      !Number.isInteger(Number(userState.user_status)) ||
      Number(userState.user_status) > 3 ||
      userState.user_status < 1
    ) {
      notify(false, "Vui lòng chọn trạng thái người dùng");
      return;
    } else if (UserRoles.length === 0) {
      notify(false, "Vui lòng thêm ít nhất 1 quyền hạn");
      return;
    }
    const newUser = {
      username: userState.username.trim(),
      password: userState.password.trim(),
      email: userState.email.trim(),
      address: userState.address.trim(),
      firstname: userState.firstname.trim(),
      lastname: userState.lastname.trim(),
      phonenumber: userState.phonenumber.trim(),
      user_status: Number(userState.user_status),
      User_Roles: UserRoles,
    };
    console.log(newUser);
    await addUser(newUser);
  };
  return (
    <div
      className="row col-6 add_edit_class sroll_form"
      style={{
        backgroundColor: "rgb(242, 247, 255)",
        borderRadius: "3px 3px 0px 0px",
        boxShadow:
          "rgb(98, 176, 253) 0px 4px 8px, rgba(0, 0, 0, 0.08) 0px 4px 12px",
        padding: "0px !important",
        display: "block",
      }}
    >
      <div
        className="bg-primary"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
        }}
      >
        <div className="text-white add_book_class_header">Thêm Người Dùng</div>
        <i
          onClick={() => closeFormAdd(false, false)}
          className="far fa-times-circle btn_close_form"
          style={{ color: "white", fontSize: 25 }}
        />
      </div>
      <div>
        <div style={{ padding: 20, display: "flex" }}>
          <div className="col-6">
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Tên Đăng Nhập</label>
              <input
                onChange={(e) => handleOnChange(e)}
                className="form-control showordisable"
                name="username"
                defaultValue={userState.username}
                type="text"
                placeholder="VD: NgocDZ"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">First Name</label>
              <input
                onChange={(e) => handleOnChange(e)}
                className="form-control"
                name="firstname"
                defaultValue={userState.firstname}
                type="text"
                placeholder="VD: Ngọc"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Số Điện Thoại</label>
              <input
                onChange={(e) => handleOnChange(e)}
                className="form-control"
                name="phonenumber"
                type="number"
                placeholder="VD: 0378544081"
                defaultValue={userState.phonenumber}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Trạng thái</label>
              <select
                onChange={(e) => handleOnChange(e)}
                className="form-select"
                name="user_status"
                value={userState.user_status}
                aria-label="Default select example"
              >
                <option value={1}>Chưa xác thực</option>
                <option value={2}>Đang hoạt động</option>
                <option value={3}>Tạm Khóa</option>
              </select>
            </div>

            <div>
              <label className="form-label">Quyền</label>
              <div className="flex_center">
                <select
                  onChange={(e) => handleOnChange(e)}
                  className="form-select noborderRadius"
                  name="role"
                  aria-label="Default select example"
                  value={userState.role.role_id}
                >
                  <option value={-1}>Vui lòng chọn Quyền</option>
                  {roleList.map((role, index) => {
                    return (
                      <option key={index} value={role.role_id}>
                        {role.role_name}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() => handleAddRole()}
                  style={{
                    padding: "0.45rem 0.75rem",
                  }}
                  className="btn btn-success noborderRadius"
                >
                  Thêm
                </button>
              </div>

              <div style={{ display: "flex", marginTop: 15, flexWrap: "wrap" }}>
                {UserRoles.map((user_role, index) => {
                  return (
                    <div key={index} className="one_role">
                      {user_role.role_name}{" "}
                      <div
                        onClick={() => handleRemoveRole(user_role.role_id)}
                        className="remove_role"
                      >
                        X
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Email</label>
              <input
                onChange={(e) => handleOnChange(e)}
                className="form-control"
                name="email"
                type="email"
                defaultValue={userState.email}
                placeholder="VD: admin@gmail.com"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Last Name</label>
              <input
                onChange={(e) => handleOnChange(e)}
                className="form-control"
                name="lastname"
                type="text"
                defaultValue={userState.lastname}
                placeholder="VD: Nguyễn"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Nhập Mật Khẩu</label>
              <input
                onChange={(e) => handleOnChange(e)}
                className="form-control showordisable"
                name="password"
                type="password"
                defaultValue={userState.password}
              />
            </div>
            <div>
              <label className="form-label">Địa chỉ</label>
              <textarea
                onChange={(e) => handleOnChange(e)}
                className="form-control"
                name="address"
                value={userState.address}
                type="text"
                rows="3"
                placeholder="VD: Diễn Hoàng, Diễn Châu, Nghệ An"
              />
            </div>
          </div>
        </div>
        {/* <div className="col-12" style={{ padding: "0px 35px", margin: 0 }}>
          <label className="form-label">Địa chỉ</label>
          <textarea
            className="form-control"
            id="user-address"
            name="address"
            type="text"
            rows="3"
            placeholder="VD: Diễn Hoàng, Diễn Châu, Nghệ An"
          />
        </div> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <button
            onClick={() => handleAddUser()}
            className="btn btn-success btn_add_edit_customer_submit"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
}
