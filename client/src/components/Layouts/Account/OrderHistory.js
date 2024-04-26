import React, { useEffect, useState } from "react";
import axios from "axios";
import UserStatistic from "./UserStatistic";
import { useDispatch } from "react-redux";
import { ApiLink, Title, convertToDateOnly, notify } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";
import FromOrderDetail from "../Admin/Form/FromOrderDetail";
import FormConfirm from "../Admin/Form/FormConfirm";
import FormEditOrder from "../Admin/Form/FormEditOrder";
export default function OrderHistory({username}) {
  let [orderUser, setOrderUser] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [showDetail, setShowDetail] = useState(false);
  let [showCancelOrder, setShowCancelOrder] = useState(false);
  let [showEditOrder, setShowEditOrder] = useState(false);
  let [orderChoose, setOrderChoose] = useState({});
  let [status, setStatus] = useState(null);
  let [dateOrder, setDateOrder] = useState({
    startDate: "",
    endDate: "",
  });

   useEffect(() => {
     document.title = Title.orderUser + Title.origin;
   }, []);

  useEffect(() => {
    async function getOrderUser() {
      const response = await axios.get(`${ApiLink.domain + "/order/user"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setOrderUser(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
      console.log(response.data);
      return response.data.data;
    }
    getOrderUser();
  }, [dispatch, navigate]);

  const handleViewDetailClick = (order) => {
    setOrderChoose(order);
    setShowDetail(true);
  };

  const loadData = (data) => {
    setOrderUser(data);
  };

  const closeFormConfirm = () => {
    if (status === "user_edit_order") {
      setShowEditOrder(false);
    } else if (status === "user_cancel_order") {
      setShowCancelOrder(false);
    }
  };

  const handleCloseViewDetailClick = () => {
    setShowDetail(false);
  };

  const handleCancelOrder = (order) => {
    setOrderChoose(order);
    setShowCancelOrder(true);
    setStatus("user_cancel_order");
  };

  const handleEditOrder = (order) => {
    setOrderChoose(order);
    setShowEditOrder(true);
    setStatus("user_edit_order");
  };

  const sumMoney = (OrderDetails, save_money) => {
    let sum = 0;
    OrderDetails.forEach((item) => {
      sum += item.amount * item.price;
    });
    return sum - save_money;
  };

  const handleGetOrderTime = async () => {
    let check = true;
    if (dateOrder.startDate === "") {
      notify(false, "Vui lòng điền ngày bắt đầu");
      check = false;
    } else if (dateOrder.endDate === "") {
      notify(false, "Vui lòng điền ngày kết thúc");
      check = false;
    }
    if (check) {
      const dateStart = new Date(Number(Date.parse(dateOrder.startDate)));
      const dateEnd = new Date(Number(Date.parse(dateOrder.endDate)));
      if (dateEnd.getTime() < dateStart.getTime()) {
        notify(false, "Ngày kết thúc đang < ngày bắt đầu");
        return;
      }

      const orderSearch = {
        endDate:
          dateEnd.getFullYear() +
          "-" +
          (dateEnd.getMonth() + 1) +
          "-" +
          dateEnd.getDate(),
        startDate:
          dateStart.getFullYear() +
          "-" +
          (dateStart.getMonth() + 1) +
          "-" +
          dateStart.getDate(),
      };
      const response = await axios.post(
        `${ApiLink.domain + "/order/userOrderDate"}`,
        orderSearch,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.status) {
        setOrderUser(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/account/login", { replace: true });
        }
      }
    }
  };

  const handleChangeTime = (e) => {
    const { value, name } = e.target;
    const date = new Date(Number(Date.parse(value)));
    const date_string =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setDateOrder({ ...dateOrder, [name]: date_string });
  };

  return (
    <div id="main">
      {showDetail || showCancelOrder || showEditOrder ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          {showDetail ? (
            <FromOrderDetail
              itemChoose={orderChoose}
              handleCloseViewDetailClick={handleCloseViewDetailClick}
            />
          ) : (
            ""
          )}
          {showCancelOrder ? (
            <FormConfirm
              itemChoose={orderChoose}
              status={status}
              content={"Bạn chắc chắn muốn hủy đơn hàng ID:"}
              id_handle={orderChoose.order_id}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {showEditOrder ? (
            <FormEditOrder
              itemChoose={orderChoose}
              status={status}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            {<UserStatistic username={username} />}
            <div className="row">
              <div className="col-12">
                <div className="col-lg-12 stretch-card" style={{ padding: 0 }}>
                  <div className="card">
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4
                          className="card-title"
                          style={{ marginBottom: "0 !important" }}
                        >
                          Danh sách đơn hàng
                        </h4>
                        <div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div>
                              <label
                                className="form-label"
                                htmlFor="basic-form-dob"
                              >
                                Ngày bắt đầu
                              </label>
                              <input
                                className="form-control"
                                id="datepickerfrom_start"
                                name="startDate"
                                type="date"
                                onChange={(e) => handleChangeTime(e)}
                              />
                            </div>
                            <div style={{ marginLeft: 15 }}>
                              <label
                                className="form-label"
                                htmlFor="basic-form-dob"
                              >
                                Ngày kết thúc
                              </label>
                              <input
                                className="form-control"
                                id="datepickerfrom_end"
                                name="endDate"
                                type="date"
                                onChange={(e) => handleChangeTime(e)}
                              />
                            </div>
                            <button
                              onClick={() => handleGetOrderTime()}
                              className="btn btn-success"
                              style={{
                                marginLeft: 10,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <i className="fas fa-search text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Thời gian</th>
                              <th>Tổng tiền</th>
                              <th>Họ tên</th>
                              <th>Số điện thoại</th>
                              <th>Trạng thái</th>
                              <th>Chi tiết</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderUser.map((order, index) => {
                              return (
                                <tr key={index} className="table-white">
                                  <td>{order.order_id}</td>
                                  <td>{convertToDateOnly(order.order_time)}</td>
                                  <td>
                                    {sumMoney(
                                      order.OrderDetails,
                                      order.save_money
                                    ).toLocaleString("vi") + "đ"}
                                  </td>
                                  <td>{order.fullname}</td>
                                  <td>{order.phonenumber}</td>
                                  {Number(order.order_status) === 1 ? (
                                    <td>
                                      <button
                                        className="btn btn-danger btn_change_status"
                                        onClick={() => handleCancelOrder(order)}
                                      >
                                        Hủy Đơn
                                      </button>
                                      <button
                                        className="btn btn-success btn_change_status"
                                        onClick={() => handleEditOrder(order)}
                                      >
                                        Chỉnh sửa
                                      </button>
                                    </td>
                                  ) : order.order_status === 2 ? (
                                    <td
                                      style={{
                                        color: "#17a2b8",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Đã xác nhận
                                    </td>
                                  ) : order.order_status === 3 ? (
                                    <td
                                      style={{
                                        color: "#007bff",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Đang vận chuyển
                                    </td>
                                  ) : order.order_status === 4 ? (
                                    <td
                                      style={{
                                        color: "#ffc107",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Đã yêu cầu hủy
                                    </td>
                                  ) : order.order_status === 5 ? (
                                    <td
                                      style={{
                                        color: "#28a745",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Giao hàng thành công
                                    </td>
                                  ) : order.order_status === 6 ? (
                                    <td
                                      style={{
                                        color: "#dc3545",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Đã hủy
                                    </td>
                                  ) : order.order_status === 7 ? (
                                    <td
                                      style={{
                                        color: "#ffc107",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Đã yêu cầu trả toàn bộ
                                    </td>
                                  ) : order.order_status === 8 ? (
                                    <td
                                      style={{
                                        color: "#dc3545",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Trả toàn bộ thành công
                                    </td>
                                  ) : (
                                    ""
                                  )}

                                  <td>
                                    <button
                                      className="btn btn-info btn_change_status"
                                      onClick={() =>
                                        handleViewDetailClick(order)
                                      }
                                    >
                                      Chi Tiết
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {/* Xu ly phan trang */}
                      <div
                        className="container"
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div>Số lượng: {orderUser.length}</div>
                        <nav aria-label="Page navigation">
                          <ul
                            className="pagination"
                            id="pagination"
                            style={{ margin: "0 20px" }}
                          />
                        </nav>
                      </div>
                      {/* Ket thuc xu ly phan trang */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
