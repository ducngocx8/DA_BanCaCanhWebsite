import React, { useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";
export default function FormEditOrder({
  status,
  closeFormConfirm,
  loadData,
  itemChoose,
}) {
  let [inputOrder, setInputOrder] = useState({
    phonenumber: itemChoose.phonenumber,
    fullname: itemChoose.fullname,
    address: itemChoose.address,
    note: itemChoose.note,
    order_status: itemChoose.order_status,
  });
  let navigate = useNavigate();
  const handleEvent = async () => {
    if (status === "user_edit_order") {
      const orderStatus = {
        order_id: itemChoose.order_id,
        order_status: itemChoose.order_status, // 4: Yêu cầu hủy
        phonenumber: inputOrder.phonenumber,
        fullname: inputOrder.fullname,
        address: inputOrder.address,
        note: inputOrder.note,
      };
      const response = await axios.post(
        `${ApiLink.domain + "/order/user"}`,
        orderStatus,
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
        }
      }
    }else if(status === "admin_edit_order"){
       const order = {
         order_status: inputOrder.order_status,
         phonenumber: inputOrder.phonenumber,
         fullname: inputOrder.fullname,
         address: inputOrder.address,
         note: inputOrder.note,
         email: "ducngoc123@gmail.com",
       };
      const response = await axios.put(
        `${ApiLink.domain + "/admin/order/" + itemChoose.order_id}`,
        order,
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

  const handleChangeOrder = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setInputOrder({ ...inputOrder, [name]: value });
  };

  return (
    <div className="confirm_container remove_customer_class bg-white">
      <div
        className="confirm_header text-white bg-primary"
        style={{ padding: 10, fontWeight: 700 }}
      >
        <i className="fas fa-check-circle" style={{ color: "#47f764" }} />
        <span style={{ marginLeft: 3 }}>Xác Nhận</span>
      </div>
      <div
        className="confirm_content"
        style={{ padding: 10, textAlign: "center" }}
      >
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Họ tên người nhận:</label>
          <input
            className="form-control showordisable"
            placeholder="Họ tên người nhận"
            type="text"
            name="fullname"
            defaultValue={inputOrder.fullname}
            onInput={(e) => handleChangeOrder(e)}
          ></input>
        </div>
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Số điện thoại:</label>
          <input
            className="form-control showordisable"
            placeholder="Số điện thoại"
            type="number"
            defaultValue={inputOrder.phonenumber}
            name="phonenumber"
            onInput={(e) => handleChangeOrder(e)}
          ></input>
        </div>
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Địa chỉ nhận hàng:</label>
          <input
            className="form-control showordisable"
            placeholder="Địa chỉ nhận hàng"
            defaultValue={inputOrder.address}
            name="address"
            onInput={(e) => handleChangeOrder(e)}
          ></input>
        </div>
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Ghi chú:</label>
          <input
            className="form-control showordisable"
            placeholder="Ghi chú nếu có"
            defaultValue={inputOrder.note}
            name="note"
            onInput={(e) => handleChangeOrder(e)}
          ></input>
        </div>
        {status === "admin_edit_order" ? (
          <div style={{ textAlign: "left" }}>
            <label className="form-label">Trạng thái đơn hàng:</label>
            <select
              name="order_status"
              className="form-select"
              defaultValue={inputOrder.order_status}
              onInput={(e) => handleChangeOrder(e)}
            >
              <option value={1}>Đặt hàng</option>
              <option value={2}>Đã xác nhận</option>
              <option value={3}>Đang vận chuyển</option>
              <option value={4}>Yêu cầu hủy</option>
              <option value={5}>Giao hàng thành công</option>
              <option value={6}>Đã hủy đơn</option>
              <option value={7}>Đã yêu cầu trả toàn bộ</option>
              <option value={8}>Trả toàn bộ thành công</option>
              {/* <option value={9}>Yêu cầu đổi hàng</option>
              <option value={10}>Đổi hàng thành công</option>
              <option value={11}>Đổi hàng thất bại</option> */}
            </select>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="confirm_buttons">
        <div id="formDelete">
          <button
            onClick={() => handleEvent()}
            className="btn btn-success me-1 mb-2 btn_xacnhan_xoa"
            style={{ margin: "0px 10px", padding: "5px 20px" }}
            type="button"
          >
            Xác Nhận
          </button>
        </div>
        <button
          onClick={() => handleCloseEvent()}
          className="btn btn-danger me-1 mb-2 btn_huy_xoa"
          style={{ margin: "0px 10px", padding: "5px 20px" }}
          type="button"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
