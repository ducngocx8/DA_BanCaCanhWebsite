import React, { useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";
export default function FormEditRole({
  status,
  closeFormConfirm,
  loadData,
  itemChoose,
}) {
  let [inputRole, setInputRole] = useState({
    role_name: itemChoose ? itemChoose.role_name : "",
    role_code: itemChoose ? itemChoose.role_code : "",
  });
  let navigate = useNavigate();
  const handleEvent = async () => {
    if (status === "admin_edit_role") {
      const new_role = {
        role_name: inputRole.role_name,
        role_code: inputRole.role_code,
      };
      const response = await axios.put(
        `${ApiLink.domain + "/admin/role/" + itemChoose.role_id}`,
        new_role,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/account/login", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "admin_add_role") {
      const new_role = {
        role_name: inputRole.role_name,
        role_code: inputRole.role_code,
      };
      const response = await axios.post(
        `${ApiLink.domain + "/admin/role"}`,
        new_role,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
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
  };

  const handleCloseEvent = () => {
    closeFormConfirm();
  };

  const handleChangeRole = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setInputRole({ ...inputRole, [name]: value });
  };

  return (
    <div className="confirm_container remove_customer_class bg-white">
      <div
        className="confirm_header text-white bg-primary"
        style={{ padding: 10, fontWeight: 700 }}
      >
        <i className="fas fa-check-circle" style={{ color: "#47f764" }} />
        <span style={{ marginLeft: 3 }}> {status === "admin_add_role" ? "Thêm Quyền Hạn" : "Cập Nhật Quyền Hạn"}</span>
      </div>
      <div
        className="confirm_content"
        style={{ padding: 10, textAlign: "center" }}
      >
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Mã quyền hạn:</label>
          <input
            className="form-control showordisable"
            placeholder="Mã quyền hạn"
            type="text"
            name="role_code"
            defaultValue={inputRole.role_code}
            onInput={(e) => handleChangeRole(e)}
          ></input>
        </div>
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Tên quyền hạn:</label>
          <input
            className="form-control showordisable"
            placeholder="Tên quyền hạn"
            type="text"
            defaultValue={inputRole.role_name}
            name="role_name"
            onInput={(e) => handleChangeRole(e)}
          ></input>
        </div>
      </div>
      <div className="confirm_buttons">
        <div id="formDelete">
          <button
            onClick={() => handleEvent()}
            className="btn btn-success me-1 mb-2 btn_xacnhan_xoa"
            style={{ margin: "0px 10px" }}
            type="button"
          >
            {status === "admin_add_role" ? "Thêm" : "Lưu"}
          </button>
        </div>
        <button
          onClick={() => handleCloseEvent()}
          className="btn btn-danger me-1 mb-2 btn_huy_xoa"
          style={{ margin: "0px 10px" }}
          type="button"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
