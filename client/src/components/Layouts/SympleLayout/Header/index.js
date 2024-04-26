import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../../../css/Header.css";
import "../../../../css/App.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ApiLink } from "../../../../Utils/Title";
export default function Header() {
  let dispatch = useDispatch();
  useEffect(() => {
    const loadCart = async () => {
      const response = await axios.get(`${ApiLink.domain + "/cart/user"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        dispatch({
          type: "load_cart",
          value: response.data.data,
        });
      }
    };
    loadCart();
  }, [dispatch]);
  let cart = useSelector((state) => state.cartReducer);
  return (
    <header className="_100vw">
      <div className="toast_class" />
      <div className="_1200px flex_between pd-10_0">
        <div className="nav_left">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Logo" />
              <span>FISH STORE</span>
            </Link>
          </div>
          <div className="search">
            <form action="/search">
              <input
                type="text"
                name="keyword"
                placeholder="Nhập sản phẩm cần tìm kiếm..."
              />
              <button className="btn_search">
                <i className="fa fa-search" />
              </button>
            </form>
          </div>
        </div>
        <div className="nav_right">
          <Link to="/account/login">
            <i className="fa fa-user" />
          </Link>
          <Link to="/account/cart">
            <i className="fa fa-shopping-cart" />{" "}
            <span
              style={{
                position: "absolute",
                top: 15,
                color: "#FFEB3B",
                fontWeight: "bold",
              }}
            >
              {cart.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
