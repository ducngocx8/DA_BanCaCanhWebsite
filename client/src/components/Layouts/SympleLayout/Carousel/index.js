import React, { Fragment, useEffect, useState } from "react";
import "../../../../css/Carousel.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { ApiLink } from "../../../../Utils/Title";

export default function Carousel() {
  let [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getAllCategory() {
      const response = await axios.get(`${ApiLink.domain + "/category"}`);
      setCategories(response.data.data); // status, data
      return response.data.data;
    }
    getAllCategory();

    let findItem = document.getElementById("carousel_pro");
    if (!findItem) {
      const script = document.createElement("script");
      script.src = "/carousel_pro.js";
      script.async = true;
      script.id = "carousel_pro";
      document.body.appendChild(script);
    }
    return () => {
      findItem = document.getElementById("carousel_pro");
      if (findItem) {
        findItem.remove();
      }
    };
  }, []);

  return (
    <Fragment>
      <div className="category_carousel _100vw mg-10_0">
        <div className="_1200px flex_between">
          <div className="category_carousel_left bg-white" id="style-15">
            <div
              className="category_title bg-blue color-white pd-10_35"
              style={{ position: "absolute" }}
            >
              Danh Mục Sản Phẩm
            </div>
            <ul className="category_ul">
              <li className="category_ui_item pd-10">
                <Link to="/">Home</Link>
              </li>
              {categories.map((category, index) => (
                <li key={index} className="category_ui_item pd-10">
                  <Link to={"/category/" + category.category_id}>
                    {category.category_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="category_carousel_right">
            <div className="carousel_images">
              <Link to="/product/1">
                <img src="/images/fish_two.png" alt="sale" />
              </Link>
              <Link to="/product/2">
                <img src="/images/fish_four.png" alt="sale" />
              </Link>
              <Link to="/product/3">
                <img src="/images/cacanh_three.jpg" alt="sale" />
              </Link>
            </div>
            <div className="carousel_pre_after">
              <div className="pre_bg-main" style={{ padding: "2px 10px" }}>
                <i id="pre" className="fa fa-angle-left" />
              </div>
              <div className="next_bg-main" style={{ padding: "2px 10px" }}>
                <i id="next" className="fa fa-angle-right" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="banner flex_center">
        <div className="_1200px overflow_hidden">
          <Link to="/">
            <img src="/images/banner_qc_1.png" alt="banner" />
          </Link>
        </div>
      </div>
    </Fragment>
  );
}
