import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ApiLink, convertToDateOnly, notify } from "../../../Utils/Title";

export default function ProductInfo({ fishDetail }) {
  console.log("fishDetail", fishDetail);
  let [amount_buy, setAmountBuy] = useState(1);
  let [couponList, setCouponList] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const avgStars = () => {
    let sum = 0;
    fishDetail.Rates.forEach((rate) => (sum += rate.rate_point));
    if (fishDetail.Rates.length > 0) {
      return Math.round(sum / fishDetail.Rates.length);
    }
    return 0;
  };
  const [size_selected, setSizeSelected] = useState(
    fishDetail.Sizes.length > 0 ? fishDetail.Sizes[0] : null
  );
  const [image_selected, setImageSelected] = useState(
    fishDetail.Images.length > 0
      ? fishDetail.Images[0]
      : {
          url_image:
            "https://img.freepik.com/free-vector/no-multiply-font-vector-text-typography_53876-168227.jpg",
        }
  );
  console.log(image_selected);
  const handleChangeSize = (size) => {
    setSizeSelected(size);
  };
  const handleChangeImage = (image) => {
    setImageSelected(image);
  };

  const handleAddToCartHasAmount = async () => {
    if (!size_selected) {
      notify(false, "Vui lòng chọn Size");
      return;
    }
    const value = Number(amount_buy);
    if (value <= 0) {
      notify(false, "Số lượng cần lớn hơn 0");
      return;
    }
    if (Number.isInteger(value) && value > 0) {
      const fish_item = {
        fish_id: fishDetail.fish_id,
        size_id: size_selected.size_id,
        amount: value,
      };
      const response = await axios.post(
        `${ApiLink.domain + "/cart/addToCart"}`,
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
  console.log("image_selected", image_selected);

  useEffect(() => {
     async function getAllCoupon() {
       const response = await axios.get(`${ApiLink.domain + "/coupon"}`, {
         withCredentials: true,
       });
       if (response.data.status) {
         setCouponList(response.data.data);
       } else {
         notify(false, response.data.message);
       }
     }
     getAllCoupon();
  }, [])
  return (
    <div className="product_book flex_center mg-20_0">
      <div className="_1200px bg-white pd-10" style={{ display: "flex" }}>
        <div className="product_image flex-4">
          <img src={image_selected.url_image} alt="Anh" />
          <div className="image_small_size">
            {fishDetail.Images.map((image, index) => {
              return (
                <img
                  key={index}
                  onClick={() => handleChangeImage(image)}
                  src={image.url_image}
                  alt="product"
                ></img>
              );
            })}
          </div>
          <div style={{ border: "2px solid #2196F3", marginTop: 15 }}>
            <div
              style={{
                fontWeight: "bold",
                backgroundColor: "#d1d5db",
                padding: 5,
              }}
            >
              <i style={{ color: "#2196F3" }} className="fas fa-gift"></i>{" "}
              <span>Khuyến mãi</span>
            </div>
            {couponList.length !== 0 ? (
              couponList.map((coupon, index) => {
                return (
                  <div key={index} className="coupon_flex">
                    <img
                      style={{ width: 15, marginTop: -20, marginRight: 2 }}
                      src="/images/success.svg"
                      alt="hinh_anh"
                    />
                    <div className="coupon_text">
                      <strong>{coupon.coupon_code}</strong>:{" "}
                      {coupon.coupon_name} tới hết ngày{" "}
                      {convertToDateOnly(coupon.coupon_expired)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="coupon_flex">
                <img
                  style={{ width: 15 }}
                  src="/images/success.svg"
                  alt="hinh_anh"
                />
                <div className="coupon_text">
                  Hiện tại chưa có chương trình khuyến mãi.
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="product_book_info flex-6">
          <h1 className="product_book_title">{fishDetail.fish_name}</h1>
          <div className="row_product">
            <div className="flex flex-1">
              <span className="text">Danh mục: </span>
              <p className="product_book_author mg-l-10">
                <strong>
                  <Link to={"/category/" + fishDetail.Category.category_id}>
                    {fishDetail.Category.category_name}
                  </Link>
                </strong>
              </p>
            </div>
            <div className="flex flex-1">
              <span className="text">pH: </span>
              <p className="product_book_category mg-l-10">
                <strong>{fishDetail.ph}</strong>
              </p>
            </div>
          </div>
          <div className="row_product">
            <div className="flex-1 flex">
              <span className="text">Nhiệt độ nước: </span>
              <p className="product_book_nxb mg-l-10">
                <strong>{fishDetail.temperature}°C</strong>
              </p>
            </div>
            <div className="flex flex-1">
              <span className="text">Thức ăn: </span>
              <p className="product_book_ngayxb mg-l-10">
                <strong>{fishDetail.food}</strong>
              </p>
            </div>
          </div>

          <div className="row_product">
            <div className="flex-1 flex">
              <span className="text">Nguồn gốc: </span>
              <p className="product_book_nxb mg-l-10">
                <strong>{fishDetail.origin}</strong>
              </p>
            </div>
            <div className="flex flex-1">
              <span className="text">Tập tính: </span>
              <p className="product_book_ngayxb mg-l-10">
                <strong>{fishDetail.behavior}</strong>
              </p>
            </div>
          </div>
          <div className="ranking" style={{ margin: "10px 0px" }}>
            <span>Xếp hạng: </span>
            {new Array(avgStars()).fill(0).map((start, index) => {
              return (
                <i
                  key={index}
                  className="fa fa-star"
                  style={{ color: "orange", fontSize: 15 }}
                />
              );
            })}

            {new Array(5 - avgStars()).fill(0).map((start, index) => {
              return (
                <i
                  key={index}
                  className="fa fa-star"
                  style={{ color: "rgba(83, 79, 79, 0.13)", fontSize: 15 }}
                />
              );
            })}
          </div>

          <div className="product_book_price">
            <div>
              {fishDetail.fish_status
                ? Number(
                    size_selected ? size_selected.Fish_Price.price : "999999999"
                  ).toLocaleString("vi") + "đ"
                : "Đã ngừng kinh doanh"}
            </div>
          </div>

          <div className="product_size">
            <span>Kích thước: </span>
            <div className="size_items">
              {fishDetail.Sizes.map((size, index) => {
                return (
                  <div
                    key={index}
                    className={
                      Number(size_selected.size_id) === Number(size.size_id)
                        ? "size_selected"
                        : ""
                    }
                    onClick={() => handleChangeSize(size)}
                  >
                    {size.size_name}
                  </div>
                );
              })}
            </div>
          </div>
          {fishDetail.fish_status ? (
            <div>
              {" "}
              <div style={{ marginBottom: 10 }}>
                <span className="product_book_slt">Số lượng tồn:</span>
                <span className="mg-l-10">
                  <strong id="current_quanty">
                    {size_selected ? size_selected.Fish_Price.fish_remain : 0}
                  </strong>
                </span>
              </div>
              <table className="table" style={{ width: "50%" }}>
                <thead className="thead-dark">
                  <tr style={{ textAlign: "center" }}>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Đặt mua</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ display: "inline-block", padding: "10px 0px" }}
                    >
                      <div id="form_add">
                        <input
                          type="number"
                          id="quanty_input"
                          name="quanty"
                          className="form-control"
                          style={{ width: 70 }}
                          defaultValue={1}
                          min={1}
                          max={
                            size_selected
                              ? size_selected.Fish_Price.fish_remain
                              : 0
                          }
                          onInput={(e) => setAmountBuy(e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAddToCartHasAmount()}
                        type="button"
                        id="btn_add_to_cart"
                        className="btn btn-success"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <i
                          className="fas fa-plus-circle"
                          style={{ margin: "0px 5px" }}
                        />
                        <span>Giỏ Hàng</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
