import React, { useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";
export default function FormEditCoupon({
  status,
  closeFormConfirm,
  loadData,
  itemChoose,
}) {
  let [inputRole, setInputRole] = useState({
    coupon_name: itemChoose ? itemChoose.coupon_name : "",
    coupon_code: itemChoose ? itemChoose.coupon_code : "",
    discount: itemChoose ? itemChoose.discount : "",
    min_order: itemChoose ? itemChoose.min_order : "",
    save_money_max: itemChoose ? itemChoose.save_money_max : "",
    coupon_expired: itemChoose ? itemChoose.coupon_expired : "",
  });
  let navigate = useNavigate();
  const handleEvent = async () => {
    if (status === "admin_edit_coupon") {
      const new_coupon = {
        coupon_name: inputRole.coupon_name,
        coupon_code: inputRole.coupon_code,
        discount: inputRole.discount,
        min_order: inputRole.min_order,
        save_money_max: inputRole.save_money_max,
        coupon_expired: inputRole.coupon_expired,
      };
      console.log(new_coupon);
      const response = await axios.put(
        `${ApiLink.domain + "/admin/coupon/" + itemChoose.coupon_id}`,
        new_coupon,
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
    } else if (status === "admin_add_coupon") {
      const new_coupon = {
        coupon_name: inputRole.coupon_name,
        coupon_code: inputRole.coupon_code,
        discount: inputRole.discount,
        min_order: inputRole.min_order,
        save_money_max: inputRole.save_money_max,
        coupon_expired: inputRole.coupon_expired,
      };
      const response = await axios.post(
        `${ApiLink.domain + "/admin/coupon"}`,
        new_coupon,
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
    <div className="confirm_container_650 remove_customer_class bg-white">
      <div
        className="confirm_header text-white bg-primary"
        style={{ padding: 10, fontWeight: 700 }}
      >
        <i className="fas fa-check-circle" style={{ color: "#47f764" }} />
        <span style={{ marginLeft: 3 }}>
          {" "}
          {status === "admin_add_coupon"
            ? "Thêm Mã Coupon"
            : "Cập Nhật Mã Coupon"}
        </span>
      </div>
      <div
        className="confirm_content"
        style={{
          padding: 10,
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <div style={{ textAlign: "left" }}>
            <label className="form-label">Mã Coupon:</label>
            <input
              className="form-control showordisable"
              placeholder="Mã khuyến mãi"
              type="text"
              name="coupon_code"
              defaultValue={inputRole.coupon_code}
              onInput={(e) => handleChangeRole(e)}
            ></input>
          </div>
          <div style={{ textAlign: "left", marginTop: 5 }}>
            <label className="form-label">Mô tả Coupon:</label>
            <input
              className="form-control showordisable"
              placeholder="Mô tả về mã ưu đãi"
              type="text"
              defaultValue={inputRole.coupon_name}
              name="coupon_name"
              onInput={(e) => handleChangeRole(e)}
            ></input>
          </div>

          <div style={{ textAlign: "left", marginTop: 5 }}>
            <label className="form-label">Phần trăm khuyến mãi:</label>
            <input
              className="form-control showordisable"
              placeholder="Phần trăm khuyến mãi"
              type="number"
              defaultValue={inputRole.discount}
              name="discount"
              onInput={(e) => handleChangeRole(e)}
            ></input>
          </div>
        </div>

        <div style={{ flex: 1, marginLeft: 10 }}>
          <div style={{ textAlign: "left" }}>
            <label className="form-label">Áp dụng đơn hàng tối thiểu:</label>
            <input
              className="form-control showordisable"
              placeholder="Áp dụng đơn hàng tối thiểu"
              type="number"
              defaultValue={inputRole.min_order}
              name="min_order"
              onInput={(e) => handleChangeRole(e)}
            ></input>
          </div>

          <div style={{ textAlign: "left", marginTop: 5 }}>
            <label className="form-label">Tiết kiệm tối đa:</label>
            <input
              className="form-control showordisable"
              placeholder="Tiết kiệm tối đa"
              type="number"
              defaultValue={inputRole.save_money_max}
              name="save_money_max"
              onInput={(e) => handleChangeRole(e)}
            ></input>
          </div>

          <div style={{ textAlign: "left", marginTop: 5 }}>
            <label className="form-label">Ngày hết hạn:</label>
            <input
              className="form-control showordisable"
              placeholder="Ngày hết hạn"
              type="date"
              defaultValue={inputRole.coupon_expired}
              name="coupon_expired"
              onInput={(e) => handleChangeRole(e)}
            ></input>
          </div>
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
            {status === "admin_add_coupon" ? "Thêm" : "Lưu"}
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
