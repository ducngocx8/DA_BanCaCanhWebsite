import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import SearchTheme from "./SearchTheme";
import { useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";
import FormAddProduct from "./Form/FormAddProduct";
import FormEditProduct from "./Form/FormEditProduct";

export default function ProductAdmin({ username }) {
  let [productList, setProductList] = useState([]);
  let [page, setPage] = useState(1);
  const maxShow = 7;
  let navigate = useNavigate();
  let [itemEdit, setItemEdit] = useState(false);
  let [itemAdd, setItemAdd] = useState(false);
  let [keyword, setKeyword] = useState("");

  const handleShowFormEdit = (item) => {
    setItemEdit(item);
  };

  const handleShowFormAdd = () => {
    setItemAdd(true);
  };

  useEffect(() => {
    async function getAllProduct() {
      const response = await axios.get(`${ApiLink.domain + "/admin/product"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setProductList(response.data.data); // status, data
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
    getAllProduct();
  }, [navigate]);

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

  const loadData = async (data) => {
    setProductList(data);
  };

  const reloadData = async () => {
    const response = await axios.get(`${ApiLink.domain + "/admin/product"}`, {
      withCredentials: true,
    });
    if (response.data.status) {
      setProductList(response.data.data);
    } else {
      notify(false, response.data.message);
      if (response.data.must === "login") {
        window.localStorage.clear();
        return navigate("/", { replace: true });
      } else if (response.data.must === "permission") {
        return navigate("/", { replace: true });
      }
    }
  };

  const handleCloseFormAdd = async (add_edit, result) => {
    if (result & !add_edit) {
      // reload_data
      await reloadData();
    }
    setItemAdd(false);
    setItemEdit(false);
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword.toLowerCase().trim());
  };

  const filterSearch = () => {
    return productList.filter((item) => {
      return (
        item.fish_name.toLowerCase().includes(keyword) ||
        item.fish_description.toLowerCase().includes(keyword) ||
        item.behavior.toLowerCase().includes(keyword) ||
        item.temperature.toLowerCase().includes(keyword) ||
        item.food.toLowerCase().includes(keyword) ||
        item.origin.toLowerCase().includes(keyword) ||
        item.Category.category_name.toLowerCase().includes(keyword) ||
        Number(item.fish_id) === Number(keyword)
      );
    });
  };

  return (
    <div id="main">
      {itemAdd || itemEdit ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          {itemEdit ? (
            <FormEditProduct
              itemChoose={itemEdit}
              status={"admin_edit_order"}
              closeFormAdd={handleCloseFormAdd}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {itemAdd ? (
            <FormAddProduct
              status={"admin_edit_product"}
              closeFormAdd={handleCloseFormAdd}
              loadData={loadData}
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
              title={"Tìm kiếm sản phẩm"}
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
                          Danh sách sản phẩm
                        </h4>

                        <div style={{ display: "flex" }}>
                          <button
                            id="info"
                            className="btn btn-success btn_add"
                            onClick={() => handleShowFormAdd()}
                          >
                            <i className="fas fa-plus" />{" "}
                            <span>Thêm Sản Phẩm</span>
                          </button>
                          <div
                            className="form_add display_none"
                            style={{ marginLeft: 20 }}
                          >
                            <div style={{ display: "flex" }}>
                              <input
                                className="form-control"
                                name="authorName"
                                type="text"
                                defaultValue
                                id="input_add_author"
                                placeholder="VD: Nguyễn Đức Ngọc"
                              />
                              <button
                                id="btn_add_submit"
                                style={{ marginLeft: 5 }}
                                type="submit"
                                className="btn btn-success btn_add_submit"
                              >
                                Thêm
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Tên Sản phẩm</th>
                              <th>Hình Ảnh</th>
                              <th>Thể loại</th>
                              <th>Trạng thái</th>
                              <th>Cập nhật</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((product, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{product.fish_id}</td>
                                    <td>
                                      <a
                                        href={"/product/" + product.fish_id}
                                        target="_blank"
                                        rel="nofollow noreferrer"
                                      >
                                        {product.fish_name}
                                      </a>
                                    </td>
                                    <td>
                                      {product.Images.length === 0 ? (
                                        "Chưa có hình ảnh"
                                      ) : (
                                        <img
                                          style={{ width: 150 }}
                                          src={product.Images[0].url_image}
                                          alt="anh_ca"
                                        />
                                      )}
                                    </td>
                                    <td>
                                      {" "}
                                      <a
                                        href={
                                          "/category/" +
                                          product.Category.category_id
                                        }
                                        target="_blank"
                                        rel="nofollow noreferrer"
                                      >
                                        {product.Category.category_name}
                                      </a>
                                    </td>
                                    {product.fish_status ? (
                                      <td
                                        style={{
                                          color: "#28a745",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Đang bán
                                      </td>
                                    ) : (
                                      <td
                                        style={{
                                          color: "#dc3545",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Ngừng kinh doanh
                                      </td>
                                    )}
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleShowFormEdit(product)
                                        }
                                        type="button"
                                        className="btn btn-warning m-1 btn_edit"
                                      >
                                        <i className="far fa-edit" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              } else return "";
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
