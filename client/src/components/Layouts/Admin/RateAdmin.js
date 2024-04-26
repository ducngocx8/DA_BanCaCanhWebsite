import React, { useEffect, useState } from "react";
import SearchTheme from "./SearchTheme";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { ApiLink, convertToDate, notify } from "../../../Utils/Title";
import FormConfirm from "./Form/FormConfirm";
import { useNavigate } from "react-router-dom";

export default function RateAdmin({ username }) {
  let [rateList, setRateList] = useState([]);
  let [page, setPage] = useState(1);
  let [keyword, setKeyword] = useState("");
  const maxShow = 7;
  let navigate = useNavigate();
  let [itemDelete, setItemDelete] = useState(false);

  const handleShowFormDelete = (item) => {
    setItemDelete(item);
  };

  useEffect(() => {
    async function getAllRate() {
      const response = await axios.get(`${ApiLink.domain + "/admin/rate"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setRateList(response.data.data); // status, data
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
    getAllRate();
  }, [navigate]);

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

  const closeFormConfirm = () => {
    setItemDelete(false);
  };

  const loadData = async (data) => {
    setRateList(data); // status, data
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword.toLowerCase().trim());
  };

  const filterSearch = () => {
    return rateList.filter((item) => {
      return (
        item.fish_name.toLowerCase().includes(keyword) ||
        item.rate_comment.toLowerCase().includes(keyword) ||
        Number(item.rate_point) === Number(keyword) ||
        Number(item.fish_id) === Number(keyword) ||
        Number(item.user_id) === Number(keyword)
      );
    });
  };

  return (
    <div id="main">
      {itemDelete ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          <FormConfirm
            itemChoose={itemDelete}
            status={"admin_delete_rate"}
            content={
              "Bạn chắc chắn muốn xóa đánh giá sản phẩm " +
              itemDelete.fish_name +
              " của User_ID = "
            }
            id_handle={itemDelete.user_id}
            closeFormConfirm={closeFormConfirm}
            loadData={loadData}
          />
        </div>
      ) : (
        ""
      )}
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            <AdminThemeTop username={username} />
            <SearchTheme
              title={"Tìm kiếm đánh giá"}
              handleSearch={handleSearch}
            />
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
                          Danh sách đánh giá
                        </h4>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>Thời gian</th>
                              <th>USER ID</th>
                              <th>PRODUCT ID</th>
                              <th>Tên Sản Phẩm</th>
                              <th>Điểm Số</th>
                              <th>Bài Đánh Giá</th>
                              <th>Cập Nhật</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((rate, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{convertToDate(rate.rate_time)}</td>
                                    <td>{rate.user_id}</td>
                                    <td>{rate.fish_id}</td>
                                    <td>
                                      <a
                                        href={"/product/" + rate.fish_id}
                                        target="_blank"
                                        rel="nofollow noreferrer"
                                      >
                                        {rate.fish_name}{" "}
                                      </a>
                                    </td>
                                    <td>
                                      <div className="ratings">
                                        {new Array(rate.rate_point)
                                          .fill(0)
                                          .map((star, index) => {
                                            return (
                                              <i
                                                key={index}
                                                className="fa fa-star rating-color"
                                              />
                                            );
                                          })}
                                        {new Array(5 - rate.rate_point)
                                          .fill(0)
                                          .map((star, index) => {
                                            return (
                                              <i
                                                key={index}
                                                className="fa fa-star"
                                              />
                                            );
                                          })}
                                        <span>({rate.amount})</span>
                                      </div>
                                    </td>
                                    <td>{rate.rate_comment}</td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleShowFormDelete(rate)
                                        }
                                        type="button"
                                        className="btn btn-danger btn_delete"
                                      >
                                        <i
                                          style={{ color: "white" }}
                                          className="fa fa-trash-alt"
                                        />
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
                        <div>Tổng số: {filterSearch().length}</div>
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel="Next"
                          onPageChange={handlePageClick}
                          pageRangeDisplayed={2}
                          pageCount={
                            filterSearch().length <= maxShow
                              ? 1
                              : filterSearch().length % maxShow === 0
                              ? Math.floor(filterSearch().length / maxShow)
                              : Math.floor(filterSearch().length / maxShow) + 1
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
