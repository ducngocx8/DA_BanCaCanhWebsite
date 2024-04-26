import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ApiLink, Title, notify, regexPhone } from "../../../Utils/Title";
import { Link, useNavigate } from "react-router-dom";
import FormConfirm from "../Admin/Form/FormConfirm";
export default function Cart() {
  let [showFormOrder, setShowFormOrder] = useState(false);
  let [showFormConfirm, setShowFormConfirm] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let [errInput, setErrInput] = useState({
    phonenumber: "",
    fullname: "",
    address: "",
    coupon_code: "",
    note: ""
  });

  let [infoOrder, setInfoOrder] = useState({
    phonenumber: "",
    fullname: "",
    address: "",
    coupon_code: "",
    note: ""
  });

  const handleInputInfoOrder = (e) => {
    const { value, name } = e.target;
    console.log(name);
    if (name === "phonenumber") {
      if (regexPhone.test(value)) {
        setErrInput({ ...errInput, [name]: "" });
      } else {
        setErrInput({ ...errInput, [name]: "Số điện thoại không hợp lệ." });
      }
    } else if (name === "coupon_code") {
      setErrInput({ ...errInput, [name]: "" });
    } else {
      if (value) {
        setErrInput({ ...errInput, [name]: "" });
      } else {
        setErrInput({ ...errInput, [name]: "Vui lòng điền thông tin " + name });
      }
    }
    setInfoOrder({ ...infoOrder, [name]: value });
  };

  const handleChangeAmount = async (e, item) => {
    let { value } = e.target;
    value = Number(value);
    console.log(Number.isInteger(value));
    if (Number.isInteger(value) && value > 0) {
      const fish_item = {
        fish_id: item.fish_id,
        size_id: item.size_id,
        amount: Number(value),
      };
      const response = await axios.post(
        `${ApiLink.domain + "/cart/updateCart"}`,
        fish_item,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (response.data.status) {
        notify(true, response.data.message);
        dispatch({
          type: "load_cart",
          value: response.data.data,
        });
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
    }
  };

  const handleRemoveItem = async (item) => {
    const fish_item = {
      fish_id: item.fish_id,
      size_id: item.size_id,
    };
    const response = await axios.delete(
      `${ApiLink.domain + "/cart/removeFromCart"}`,
      {
        data: fish_item,
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      dispatch({
        type: "load_cart",
        value: response.data.data,
      });
    } else {
      if (response.data.must === "login") {
        notify(false, response.data.message);
        return navigate("/account/login", { replace: true });
      }
    }
  };

  const handleCheckCoupon = async () => {
    let check = true;
    if (infoOrder.coupon_code.trim() === "") {
      check = false;
      setErrInput({ ...errInput, coupon_code: "Vui lòng điền mã giảm giá." });
    } else {
      setErrInput({ ...errInput, coupon_code: "" });
    }
    if (check) {
      const coupon = {
        coupon_code: infoOrder.coupon_code,
      };
      const response = await axios.post(
        `${ApiLink.domain + "/cart/checkCoupon"}`,
        coupon,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(
          true,
          response.data.data.require_message +
            ". " +
            response.data.data.coupon_name
        );
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/account/login", { replace: true });
        }
      }
    }
  };

  const loadCart = async () => {
    const response = await axios.get(`${ApiLink.domain + "/cart/user"}`, {
      withCredentials: true,
    });
    if (response.data.status) {
      dispatch({
        type: "load_cart",
        value: response.data.data,
      });
    } else {
      notify(false, response.data.message);
      if (response.data.must === "login") {
        window.localStorage.clear();
        return navigate("/account/login", { replace: true });
      }
    }
  };

  let cart = useSelector((state) => state.cartReducer);
  console.log(cart);

  const sumMoney = () => {
    let sum = 0;
    cart.forEach((item) => {
      sum += Number(item.price) * Number(item.amount);
    });
    return sum;
  };

  const handleOrderSubmit = async () => {
    let check = true;
    let newErr = { ...errInput };
    if (infoOrder.fullname.trim() === "") {
      check = false;
      newErr.fullname = "Vui lòng điền họ tên.";
    }
    if (infoOrder.address.trim() === "") {
      check = false;
      newErr.address = "Vui lòng điền địa chỉ.";
    }
    if (!regexPhone.test(infoOrder.phonenumber)) {
      check = false;
      newErr.phonenumber = "Số điện thoại không hợp lệ.";
    }
    if (check) {
      setShowFormConfirm(true);
    } else {
      setErrInput({ ...newErr });
    }
  };

  const loadData = () => {
    setShowFormOrder(false);
    setShowFormConfirm(false);
  };

  const closeFormConfirm = () => {
    setShowFormConfirm(false);
  };

   useEffect(() => {
     document.title = Title.cartUser + Title.origin;
   }, []);

  useEffect(() => {
    async function getCartUser() {
      const response = await axios.get(`${ApiLink.domain + "/cart/user"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        dispatch({
          type: "load_cart",
          value: response.data.data,
        });
      } else {
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/account/login", { replace: true });
        }
      }
      console.log(response.data);
      return response.data.data;
    }
    getCartUser();
  }, [dispatch, navigate]);
  return (
    <div id="main">
      {showFormConfirm ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          <FormConfirm
            status={"customer_submit_order"}
            content={"Xác nhận đặt đơn hàng với những thông tin đã cung cấp!"}
            loadData={loadData}
            itemChoose={infoOrder}
            closeFormConfirm={closeFormConfirm}
          />
        </div>
      ) : (
        ""
      )}
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
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
                          Giỏ hàng hiện tại
                        </h4>
                        <button
                          style={{ marginTop: 20 }}
                          className="btn btn-success btn_thanhtoan"
                          onClick={() => {
                            loadCart();
                            if (cart.length !== 0) {
                              setShowFormOrder(!showFormOrder);
                            } else {
                              notify(false, "Giỏ hàng đang trống.");
                            }
                          }}
                        >
                          Thanh toán ngay
                        </button>
                      </div>
                      <div id="table_load">
                        <div className="table-responsive pt-3">
                          <table className="table table-bordered text-center">
                            <thead>
                              <tr>
                                <th>STT</th>
                                <th style={{ width: 100 }}>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Kiểu size</th>
                                <th>Đơn giá</th>
                                <th style={{ width: "10%" }}>Số lượng</th>
                                <th>Thành tiền</th>
                                <th>Chi tiết</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cart.map((item, index) => {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{index + 1}</td>
                                    <td>
                                      <img
                                        src={item.url_image}
                                        alt="product"
                                        style={{ height: 100, width: "auto" }}
                                      />
                                    </td>
                                    <td className="cart_book_name">
                                      {item.fish_name}
                                    </td>
                                    <td>{item.size_name}</td>
                                    <td>
                                      {Number(item.price).toLocaleString("vi") +
                                        "đ"}
                                    </td>
                                    <td>
                                      <div className="form_edit">
                                        <input
                                          style={{ textAlign: "center" }}
                                          min={1}
                                          max={20}
                                          className="form-control edit_quanty_input"
                                          type="number"
                                          name="quanty"
                                          defaultValue={item.amount}
                                          onChange={(e) =>
                                            handleChangeAmount(e, item)
                                          }
                                        />
                                        <p
                                          className="text-danger soluongconlai_9"
                                          style={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            display: "none",
                                          }}
                                        >
                                          Số lượng còn lại là: 0
                                        </p>
                                      </div>
                                    </td>
                                    <td>
                                      {Number(
                                        item.price * item.amount
                                      ).toLocaleString("vi") + "đ"}
                                    </td>
                                    <td>
                                      <button
                                        style={{ marginRight: 5 }}
                                        type="submit"
                                        className="btn btn-danger btn_delete_cart"
                                        onClick={() => handleRemoveItem(item)}
                                      >
                                        Xóa
                                      </button>
                                      <button className="btn btn-primary">
                                        <Link
                                          to={"/product/" + item.fish_id}
                                          style={{
                                            textDecoration: "none",
                                            color: "#fff",
                                          }}
                                        >
                                          Chi tiết
                                        </Link>
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
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 20,
                              color: "#C92127",
                              fontWeight: "500",
                            }}
                          >
                            Thành tiền:{" "}
                            {Number(sumMoney()).toLocaleString("vi") + "đ"}
                          </div>
                        </div>
                        {/* Ket thuc xu ly phan trang */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`row ${
                    showFormOrder ? "" : "display_none"
                  } form_xacnhanmuahang`}
                >
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
                            Thông tin mua hàng
                          </h4>
                          <div
                            className="col-12"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div className="col-6">
                              <div
                                action="/QLSACH/checkout.htm"
                                id="form_checkout"
                              >
                                <div style={{ marginBottom: 20 }}>
                                  <label className="form-label">
                                    Tên Khách Hàng
                                  </label>
                                  <input
                                    className="form-control showordisable"
                                    name="fullname"
                                    id="fullname"
                                    type="text"
                                    placeholder="Nhập tên người nhận hàng"
                                    onInput={(e) => handleInputInfoOrder(e)}
                                  />
                                  {errInput.fullname.length === 0 ? (
                                    ""
                                  ) : (
                                    <p
                                      className="text-danger"
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {errInput.fullname}
                                    </p>
                                  )}
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                  <label className="form-label">
                                    Số điện thoại
                                  </label>
                                  <input
                                    className="form-control showordisable"
                                    name="phonenumber"
                                    id="phone"
                                    type="number"
                                    placeholder="Nhập số điện thoại"
                                    onInput={(e) => handleInputInfoOrder(e)}
                                  />
                                  {errInput.phonenumber.length === 0 ? (
                                    ""
                                  ) : (
                                    <p
                                      className="text-danger"
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {errInput.phonenumber}
                                    </p>
                                  )}
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                  <label className="form-label">
                                    Địa chỉ nhận hàng
                                  </label>
                                  <input
                                    className="form-control showordisable"
                                    name="address"
                                    id="address"
                                    type="text"
                                    placeholder="Nhập địa chỉ nhận hàng"
                                    onInput={(e) => handleInputInfoOrder(e)}
                                  />
                                  {errInput.address.length === 0 ? (
                                    ""
                                  ) : (
                                    <p
                                      className="text-danger"
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Địa chỉ không được để trống
                                    </p>
                                  )}
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                  <label className="form-label">
                                    Ghi chú
                                  </label>
                                  <input
                                    className="form-control showordisable"
                                    name="note"
                                    type="text"
                                    placeholder="Nhập ghi chú nếu có"
                                    onInput={(e) => handleInputInfoOrder(e)}
                                  />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                  <label className="form-label">
                                    Nhập mã giảm giá
                                  </label>
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <input
                                      style={{ maxWidth: "80%" }}
                                      className="form-control showordisable"
                                      name="coupon_code"
                                      id="coupon"
                                      type="text"
                                      placeholder="Nhập mã giảm giá"
                                      onInput={(e) => handleInputInfoOrder(e)}
                                    />
                                    <div
                                      style={{
                                        padding: 5,
                                      }}
                                      type="button"
                                      className="btn btn-primary btn_xacnhanmuahang"
                                      onClick={() => handleCheckCoupon()}
                                    >
                                      Kiểm tra
                                    </div>
                                  </span>
                                  {errInput.coupon_code.length === 0 ? (
                                    ""
                                  ) : (
                                    <p
                                      className="text-danger"
                                      style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {errInput.coupon_code}
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
                                    type="button"
                                    className="btn btn-success btn_xacnhanmuahang"
                                    onClick={() => handleOrderSubmit()}
                                  >
                                    Xác nhận đặt hàng
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
