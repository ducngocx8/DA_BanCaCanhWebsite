import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";
import FormEditCoupon from "./Form/FormEditCoupon";
import SearchTheme from "./SearchTheme";
import FormConfirm from "./Form/FormConfirm";

export default function CouponAdmin({ username }) {
  let [couponList, setCouponList] = useState([]);
  let [page, setPage] = useState(1);
  const maxShow = 7;
  let navigate = useNavigate();
  let [itemEdit, setItemEdit] = useState(false);
  let [itemAdd, setItemAdd] = useState(false);
  let [itemDelete, setItemDelete] = useState(false);
  let [keyword, setKeyword] = useState("");

  const handleShowFormEdit = (item) => {
    setItemEdit(item);
  };

  const handleShowFormDelete = (item) => {
    setItemDelete(item);
  };

  const handleShowFormAdd = () => {
    setItemAdd(true);
  };

  useEffect(() => {
    async function getAllCoupon() {
      const response = await axios.get(`${ApiLink.domain + "/admin/coupon"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setCouponList(response.data.data); // status, data
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
    getAllCoupon();
  }, [navigate]);

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

  const closeFormConfirm = () => {
    setItemEdit(false);
    setItemAdd(false);
    setItemDelete(false);
  };

  const loadData = async (data) => {
    setCouponList(data); // status, data
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword.toLowerCase().trim());
  };

  const filterSearch = () => {
    return couponList.filter((item) => {
      return (
        item.coupon_code.toLowerCase().includes(keyword) ||
        item.coupon_name.toLowerCase().includes(keyword) ||
        Number(item.coupon_id) === Number(keyword) ||
        Number(item.discount) === Number(keyword) ||
        Number(item.min_order) === Number(keyword) ||
        Number(item.save_money_max) === Number(keyword)
      );
    });
  };

  return (
    <div id="main">
      {itemAdd || itemEdit || itemDelete ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          {itemEdit ? (
            <FormEditCoupon
              itemChoose={itemEdit}
              status={"admin_edit_coupon"}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {itemAdd ? (
            <FormEditCoupon
              itemChoose={false}
              status={"admin_add_coupon"}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {itemDelete ? (
            <FormConfirm
              itemChoose={itemDelete}
              status={"admin_delete_coupon"}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
              id_handle={itemDelete.coupon_code}
              content="Bạn có chắc chắc muốn xóa mã coupon: "
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            <AdminThemeTop username={username} />
            <SearchTheme
              title={"Tìm kiếm coupon"}
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
                          Danh sách quyền hạn{" "}
                        </h4>
                        <button
                          id="info"
                          className="btn btn-success btn_add"
                          onClick={() => handleShowFormAdd()}
                        >
                          <i className="fas fa-plus" /> <span>Thêm Coupon</span>
                        </button>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>COUPON_ID</th>
                              <th>COUPON_CODE</th>
                              <th>COUPON_NAME</th>
                              <th>DISCOUNT</th>
                              <th>MIN ORDER</th>
                              <th>MAX SAVE</th>
                              <th>EXPIRED</th>
                              <th>STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((coupon, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{coupon.coupon_id}</td>
                                    <td>{coupon.coupon_code}</td>
                                    <td>{coupon.coupon_name}</td>
                                    <td>{coupon.discount}%</td>
                                    <td>
                                      {Number(coupon.min_order).toLocaleString(
                                        "vi"
                                      )}
                                      đ
                                    </td>
                                    <td>
                                      {Number(
                                        coupon.save_money_max
                                      ).toLocaleString("vi")}
                                      đ
                                    </td>
                                    <td>{coupon.coupon_expired}</td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleShowFormEdit(coupon)
                                        }
                                        type="button"
                                        className="btn btn-warning m-1 btn_edit"
                                      >
                                        <i className="far fa-edit"></i>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleShowFormDelete(coupon)
                                        }
                                        type="button"
                                        className="btn btn-danger btn_delete"
                                      >
                                        <i
                                          className="fa fa-trash-alt"
                                          style={{ color: "white" }}
                                        ></i>
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
