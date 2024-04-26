import React from "react";

export default function ProductDescription({ fish_description }) {
  return (
    <div className="book_description flex_center mg-20_0">
      <div className="_1200px bg-white pd-10">
        <h3>Mô Tả Sản Phẩm</h3>
        <p>{fish_description}</p>
      </div>
    </div>
  );
}
