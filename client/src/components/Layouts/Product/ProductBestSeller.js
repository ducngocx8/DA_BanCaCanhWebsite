import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/Fish.css";
import BestSeller from "../Product/BestSeller";
import { ApiLink, notify } from "../../../Utils/Title";
export default function Fish({ menuName, imageUrl, setLoading }) {
  let [topBuy, setTopBuy] = useState([]);
  useEffect(() => {
    async function getTopBuy() {
      const response = await axios.get(
        `${ApiLink.domain + "/product/topbuy/fish"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setTopBuy(response.data.data);
      } else {
        notify(false, response.data.message);
      }
      console.log(response.data);
    }
    getTopBuy();
  }, []);
  return (
    <div className="favorite_book_list flex_center mg-10_0">
      <div className="_1200px bg-white flex_col pd-10">
        <div
          className="favorite_book_list_icon_title"
          style={{ padding: "5px 0px", borderBottom: "1px solid #007bff" }}
        >
          <img src={imageUrl} className="icon_sach" alt={menuName} />
          <span className="favorite_book_list_title mg-l-10">{menuName}</span>
        </div>
        <div className="favorite_book_item flex_center mg-10_0">
          {topBuy.map((item, index) => {
            return (
              <BestSeller
              key={index}
              setLoading={setLoading}
                fish_detail={{
                  fish_id: `${item.fish_id}`,
                  fish_name: `${item.fish_name}`,
                  fish_image: `${item.url_image}`,
                  price: `${Number(item.price).toLocaleString("vi")}đ`,
                  category_name: `${item.category_name}`,
                  fish_sold: `${item.amount}`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
