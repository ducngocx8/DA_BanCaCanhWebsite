import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/Fish.css";
import NewFish from "./NewProduct";
import ReactPaginate from "react-paginate";
import { ApiLink, noImage } from "../../../Utils/Title";
export default function ProductNewProduct({menuName, imageUrl, isPagination, setLoading }) {
  let [product, setProductList] = useState([]);
  let [page, setPage] = useState(1);
  const maxShow = 8;
  useEffect(() => {
    async function getAllProduct() {
      const response = await axios.get(`${ApiLink.domain + "/product"}`);
      setProductList(response.data.data); // status, data
      console.log(response.data.data);
      return response.data.data;
    }
    getAllProduct();
  }, []);

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

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
          {product.map((product, index) => {
            if (
              !isPagination
                ? index < 4
                : index >= (page - 1) * maxShow && index < page * maxShow
            ) {
              return (
                <NewFish
                  key={index}
                  setLoading={setLoading}
                  fish_detail={{
                    fish_id: product.fish_id,
                    fish_name: product.fish_name,
                    fish_image:
                      product.Images.length > 0
                        ? product.Images[0].url_image
                        : noImage,
                    price: product.fish_status
                      ? product.Sizes.length > 0
                        ? product.Sizes[0].Fish_Price.price
                        : 999999999
                      : -1,
                    category_name: product.Category.category_name,
                    size_id:
                      product.Sizes.length > 0 ? product.Sizes[0].size_id : -1,
                  }}
                />
              );
            }
            return "";
          })}
        </div>
        {isPagination ? (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={
              product.length <= 8
                ? 1
                : product.length % 8 === 0
                ? Math.floor(product.length / 8)
                : Math.floor(product.length / 8) + 1
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
