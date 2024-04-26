import React, { useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";
export default function ChangeOrderForm({
  status,
  closeFormConfirm,
  loadData,
  itemChoose,
}) {
  let [inputOrder, setInputOrder] = useState({
    note: "",
  });
  let navigate = useNavigate();
  const handleEvent = async () => {
    if (status === "delivery_exchange_order") {
      if (inputOrder.note.trim() === "" || inputOrder.note.trim().length < 5) {
        notify(
          false,
          "Vui lòng nhập thông tin yêu cầu trả hàng. Có ít nhất 5 ký tự"
        );
        return;
      }
      const orderStatus = {
        note: inputOrder.note.trim(), // Status = 7: Yêu cầu đổi trả toàn bộ
      };
      const response = await axios.post(
        `${
          ApiLink.domain + "/delivery/exchangeOrderAll/" + itemChoose.order_id
        }`,
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
        <span style={{ marginLeft: 3 }}>Xác Nhận Trả Hàng</span>
      </div>
      <div
        className="confirm_content"
        style={{ padding: 10, textAlign: "center" }}
      >
        <div style={{ textAlign: "left" }}>
          <label className="form-label">Nội dung yêu cầu trả hàng:</label>
          <textarea
            className="form-control showordisable"
            placeholder="Ghi nội dung yêu cầu trả hàng của khách, nếu đơn hàng đã thanh toán vui lòng ghi thêm STK và tên ngân hàng của khách hàng để nhận hoàn tiền."
            type="text"
            name="note"
            rows={7}
            value={inputOrder.note}
            onInput={(e) => handleChangeOrder(e)}
          ></textarea>
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
            Xác Nhận
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
