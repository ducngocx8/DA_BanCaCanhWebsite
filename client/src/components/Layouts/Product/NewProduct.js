import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ApiLink, notify } from "../../../Utils/Title";

export default function NewFish({ fish_detail, setLoading }) {
  console.log("fish_detail", fish_detail);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleAddToCart = async (item) => {
    console.log(item.Sizes);
    if (!item.fish_id) {
      notify(false, "Sản phẩm chưa có Size, bạn không thể mua");
    }
    const fish_item = {
      fish_id: item.fish_id,
      size_id: item.size_id,
      amount: 1,
    };
    const response = await axios.post(
      `${ApiLink.domain + "/cart/addToCart"}`,
      fish_item,
      {
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
      notify(false, response.data.message);
      if (response.data.must === "login") {
        return navigate("/account/login", { replace: true });
      }
    }
  };

  return (
    <div className="favorite_book flex_col_center">
      <Link
        to={"/product/" + fish_detail.fish_id}
        onClick={() => setLoading(fish_detail.fish_id)}
      >
        <div className="book_logo">
          <img src={fish_detail.fish_image} alt={fish_detail.fish_name} />
        </div>
        <span className="info">
          <h3 className="book_name">
            {fish_detail.fish_name.length > 28
              ? fish_detail.fish_name.substr(0, 24) + "..."
              : fish_detail.fish_name}
          </h3>
          <span className="book_author">{fish_detail.category_name}</span>
          <p className="book_price">
            {Number(fish_detail.price) === -1
              ? "Ngừng kinh doanh"
              : Number(fish_detail.price).toLocaleString("vi") + "đ"}
          </p>
          <p
            className="book_author"
            style={{
              marginTop: 10,
              color: "#fff",
              borderRadius: 17,
              padding: 0,
            }}
          >
            <button
              className="btn_buynow"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(fish_detail);
              }}
            >
              <i className="fas fa-cart-plus" /> Thêm vào giỏ hàng
            </button>
          </p>
        </span>
      </Link>
    </div>
  );
}
