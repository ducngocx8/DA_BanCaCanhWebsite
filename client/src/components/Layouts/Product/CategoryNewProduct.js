import React, {useState } from 'react'
import NewFish from './NewProduct';
import ReactPaginate from 'react-paginate';

export default function CategoryNewProduct({ fishList, imageUrl, isPagination }) {
  console.log(fishList);
  let [page, setPage] = useState(1);
  const maxShow = 8;

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
          <img
            src={imageUrl}
            className="icon_sach"
            alt={fishList.category_name}
          />
          <span className="favorite_book_list_title mg-l-10">
            {fishList.category_name}
          </span>
        </div>
        <div className="favorite_book_item flex_center mg-10_0">
          {fishList.Fishes.length === 0 ? <div>Không tìm thấy sản phẩm nào.</div> : fishList.Fishes.map((product, index) => {
            if (
              !isPagination
                ? index < 4
                : index >= (page - 1) * maxShow && index < page * maxShow
            ) {
              return (
                <NewFish
                  key={index}
                  setLoading={() => {}}
                  fish_detail={{
                    fish_id: product.fish_id,
                    fish_name: product.fish_name,
                    fish_image:
                      product.Images.length > 0
                        ? product.Images[0].url_image
                        : "https://img.freepik.com/free-vector/no-multiply-font-vector-text-typography_53876-168227.jpg",
                    price: product.fish_status
                      ? product.Sizes.length > 0
                        ? product.Sizes[0].Fish_Price.price
                        : 999999999
                      : -1,
                    category_name: fishList.category_name,
                    fish_sold: product.fish_sold,
                  }}
                />
              );
            }
            return "";
          })}
        </div>
        {isPagination && fishList.Fishes.length > 0 ? (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={
              fishList.Fishes.length <= 8
                ? 1
                : fishList.Fishes.length % 8 === 0
                ? Math.floor(fishList.Fishes.length / 8)
                : Math.floor(fishList.Fishes.length / 8) + 1
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
