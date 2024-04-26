import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderFilter from "./OrderFilter";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { ApiLink, convertToDateOnly, notify } from "../../../Utils/Title";
import FromOrderDetail from "./Form/FromOrderDetail";
import FormEditOrder from "./Form/FormEditOrder";

export default function OrderAdmin({ username }) {
  let [orderList, setOrderList] = useState([]);
  let [page, setPage] = useState(1);
  const maxShow = 7;
  let navigate = useNavigate();
  let [itemEdit, setItemEdit] = useState(false);
  let [itemDetail, setItemDetail] = useState(false);
  let [dateOrder, setDateOrder] = useState({
    startDate: "",
    endDate: "",
  });

  const handleShowFormEdit = (item) => {
    setItemEdit(item);
  };

  const handleShowFormDetail = (item) => {
    setItemDetail(item);
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
        `${ApiLink.domain + "/admin/order/getByDate"}`,
        orderSearch,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.status) {
        setOrderList(response.data.data);
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

  const handleChangeTime = (e) => {
    const { value, name } = e.target;
    const date = new Date(Number(Date.parse(value)));
    const date_string =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setDateOrder({ ...dateOrder, [name]: date_string });
  };

  useEffect(() => {
    async function getAllOrder() {
      const response = await axios.get(`${ApiLink.domain + "/admin/order"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setOrderList(response.data.data); // status, data
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
    getAllOrder();
  }, [navigate]);

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

  const closeFormConfirm = () => {
    setItemEdit(false);
  };

  const loadData = async (data) => {
    setOrderList(data);
  };

  const handleCloseViewDetailClick = () => {
    setItemDetail(false);
  };

  return (
    <div id="main">
      {itemDetail || itemEdit ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          {itemDetail ? (
            <FromOrderDetail
              itemChoose={itemDetail}
              handleCloseViewDetailClick={handleCloseViewDetailClick}
            />
          ) : (
            ""
          )}

          {itemEdit ? (
            <FormEditOrder
              itemChoose={itemEdit}
              status={"admin_edit_order"}
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
            <AdminThemeTop username={username} />
            <OrderFilter loadData={loadData} />
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
                          Danh sách đánh giá{" "}
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
                              <th>Khách hàng</th>
                              <th>Số điện thoại</th>
                              <th>Thời gian</th>
                              <th>Trạng thái</th>
                              <th>Xem chi tiết</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderList.map((order, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{order.order_id}</td>
                                    <td>
                                      {order.User
                                        ? order.User.username
                                        : order.fullname}
                                    </td>
                                    <td>{order.phonenumber}</td>
                                    <td>
                                      {convertToDateOnly(order.order_time)}
                                    </td>
                                    {Number(order.order_status) === 1 ? (
                                      <td
                                        style={{
                                          color: "#17a2b8",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Chờ xác nhận
                                      </td>
                                    ) : order.order_status === 2 ? (
                                      <td
                                        style={{
                                          color: "#007bff",
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
                                        className="btn btn-success btn_change_status"
                                        onClick={() =>
                                          handleShowFormEdit(order)
                                        }
                                      >
                                        Chỉnh sửa
                                      </button>
                                      <button
                                        className="btn btn-info btn_change_status"
                                        onClick={() =>
                                          handleShowFormDetail(order)
                                        }
                                      >
                                        Chi Tiết
                                      </button>
                                    </td>
                                  </tr>
                                );
                              } else {
                                return ``;
                              }
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex_center">
                        <div>Tổng số: {orderList.length}</div>
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel="Next"
                          onPageChange={handlePageClick}
                          pageRangeDisplayed={2}
                          pageCount={
                            orderList.length <= maxShow
                              ? 1
                              : orderList.length % maxShow === 0
                              ? Math.floor(orderList.length / maxShow)
                              : Math.floor(orderList.length / maxShow) + 1
                          }
                          previousLabel="Previous"
                          renderOnZeroPageCount={null}
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          containerClassName="pagination"
                          activeClassName="active"
                        />
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
  );
}
