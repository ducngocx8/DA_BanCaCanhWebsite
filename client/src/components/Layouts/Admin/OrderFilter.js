import React, { useState } from "react";
import { ApiLink, notify } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderFilter({ loadData }) {
  let navigate = useNavigate();
  let [status, setStatus] = useState(false);
  const getOrderByOrderStatus = async (status) => {
    setStatus(status);
    let link = "";
    if (status) {
      link = `${ApiLink.domain + "/admin/order/status/" + status}`;
    } else {
      link = `${ApiLink.domain + "/admin/order"}`;
    }
    const response = await axios.get(link, {
      withCredentials: true,
    });
    if (response.data.status) {
      loadData(response.data.data);
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
  return (
    <div className="row">
      <div className="col-12">
        <div className="col-lg-12 stretch-card" style={{ padding: 0 }}>
          <div className="card">
            <div className="card-body">
              <h4
                className="card-title"
                style={{ marginBottom: "0 !important" }}
              >
                Lọc nhanh danh sách đơn hàng
              </h4>
              <div style={{ padding: "10px 0px" }}>
                <span
                  className={`btn btn-outline-info  btn_outline_admin ${
                    status === false ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(false)}
                >
                  Tất Cả
                </span>
                <span
                  className={`btn btn-outline-warning btn_outline_admin ${
                    status === 1 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(1)}
                >
                  Chờ Xác Nhận
                </span>
                <span
                  className={`btn btn-outline-success btn_outline_admin ${
                    status === 2 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(2)}
                >
                  Đã Xác Nhận
                </span>
                <span
                  className={`btn btn-outline-info btn_outline_admin ${
                    status === 3 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(3)}
                >
                  Vận Chuyển
                </span>
                <span
                  className={`btn btn-outline-danger btn_outline_admin ${
                    status === 4 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(4)}
                >
                  Yêu Cầu Hủy
                </span>
                <span
                  className={`btn btn-outline-success btn_outline_admin ${
                    status === 5 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(5)}
                >
                  Thành Công
                </span>
                <span
                  className={`btn btn-outline-danger btn_outline_admin ${
                    status === 6 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(6)}
                >
                  Đã Hủy
                </span>
                <span
                  className={`btn btn-outline-warning btn_outline_admin ${
                    status === 7 ? "active" : ""
                  } `}
                  onClick={() => getOrderByOrderStatus(7)}
                >
                  Trả Toàn Bộ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
