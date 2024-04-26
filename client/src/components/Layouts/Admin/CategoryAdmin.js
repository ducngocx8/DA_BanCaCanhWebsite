import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import SearchTheme from "./SearchTheme";
import FormConfirm from "./Form/FormConfirm";

export default function CategoryAdmin({ username }) {
  let navigate = useNavigate();
  let [addStatus, setAddStatus] = useState(false);
  let [editStatus, setEditStatus] = useState(false);
  let [deleteStatus, setDeleteStatus] = useState(false);
  let [categoryNameAdd, setCategoryNameAdd] = useState("");
  let [categoryNameEdit, setCategoryNameEdit] = useState("");
  let [itemEdit, setItemEdit] = useState(false);
  let [itemDelete, setItemDelete] = useState(false);
  let [categoryList, setCategoryList] = useState([]);
  let [page, setPage] = useState(1);
  let [keyword, setKeyword] = useState("");
  const maxShow = 7;

  const handleClickAdd = () => {
    setAddStatus(!addStatus);
  };

  const handleClickEdit = (item) => {
    console.log(editStatus);
    if (item.category_id !== itemEdit.category_id) {
      setEditStatus(true);
      setItemEdit(item);
      setCategoryNameEdit(item.category_name);
    } else if (editStatus) {
      setEditStatus(!editStatus);
      setItemEdit(false);
      setCategoryNameEdit("");
    } else {
      setEditStatus(!editStatus);
      setItemEdit(item);
      setCategoryNameEdit(item.category_name);
    }
  };

  const handleEditSubmit = async () => {
    const category_edit = {
      category_name: categoryNameEdit.trim(),
    };
    const response = await axios.put(
      `${ApiLink.domain + "/admin/category/" + itemEdit.category_id}`,
      category_edit,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      setCategoryList(response.data.data);
      setItemEdit(false);
      setCategoryNameEdit("");
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

  const handleAddSubmit = async () => {
    const category = {
      category_name: categoryNameAdd.trim(),
    };
    const response = await axios.post(
      `${ApiLink.domain + "/admin/category"}`,
      category,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      setCategoryList(response.data.data);
      setAddStatus(false);
      setCategoryNameAdd("");
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

  const closeFormConfirm = () => {
    setDeleteStatus(false);
    setItemDelete(false);
  };

  const handleChangeNameAdd = (e) => {
    const { value } = e.target;
    setCategoryNameAdd(value);
  };

  const handleChangeNameEdit = (e) => {
    const { value } = e.target;
    setCategoryNameEdit(value);
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword.toLowerCase().trim());
  };

  const filterSearch = () => {
    return categoryList.filter((item) => {
      return (
        item.category_name.toLowerCase().includes(keyword) ||
        Number(item.category_id) === Number(keyword)
      );
    });
  };

  useEffect(() => {
    async function getAllCategory() {
      const response = await axios.get(
        `${ApiLink.domain + "/admin/category"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setCategoryList(response.data.data); // status, data
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
    getAllCategory();
  }, [navigate]);

  const handleShowFormDelete = (item) => {
    setDeleteStatus(true);
    setItemDelete(item);
  };

  const loadData = async (data) => {
    setCategoryList(data); // status, data
  };

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };
  return (
    <div id="main">
      {deleteStatus ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          <FormConfirm
            status={"admin_delete_category"}
            content={
              "Bạn chắc chắn muốn xóa danh mục " +
              itemDelete.category_name +
              " với ID = "
            }
            id_handle={itemDelete.category_id}
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
              title={"Tìm kiếm danh mục sản phẩm"}
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
                          Danh sách danh mục
                        </h4>

                        <div style={{ display: "flex" }}>
                          <button
                            id="info"
                            className="btn btn-success btn_add"
                            onClick={() => handleClickAdd()}
                          >
                            <i className="fas fa-plus" />{" "}
                            <span>Thêm Danh Mục</span>
                          </button>
                          {addStatus ? (
                            <div
                              className="form_add"
                              style={{ marginLeft: 20 }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  onChange={(e) => handleChangeNameAdd(e)}
                                  className="form-control"
                                  name="categoryName"
                                  type="text"
                                  defaultValue={categoryNameAdd}
                                  id="input_add_author"
                                  placeholder="VD: Cá bảy màu"
                                />
                                <button
                                  onClick={() => handleAddSubmit()}
                                  id="btn_add_submit"
                                  style={{ marginLeft: 5 }}
                                  type="submit"
                                  className="btn btn-success btn_add_submit"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>ID Danh Mục</th>
                              <th style={{ width: "40%" }}>Tên danh mục</th>
                              <th>Cập nhật</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((category, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{category.category_id}</td>
                                    <td>
                                      {itemEdit &&
                                      itemEdit.category_id ===
                                        category.category_id ? (
                                        <div className="flex_center">
                                          <input
                                            onChange={(e) =>
                                              handleChangeNameEdit(e)
                                            }
                                            className="form-control"
                                            name="categoryName"
                                            type="text"
                                            defaultValue={
                                              itemEdit.category_name
                                            }
                                            id="input_add_author"
                                            placeholder="VD: Cá bảy màu"
                                          />{" "}
                                          <button
                                            onClick={() => handleEditSubmit()}
                                            className="btn btn-success btn_add"
                                            style={{ margin: "0px 10px" }}
                                          >
                                            Lưu
                                          </button>
                                        </div>
                                      ) : (
                                        <span>
                                          {" "}
                                          <a
                                            href={
                                              "/category/" +
                                              category.category_id
                                            }
                                            target="_blank"
                                            rel="nofollow noreferrer"
                                          >
                                            {category.category_name}
                                          </a>
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleClickEdit(category)
                                        }
                                        type="button"
                                        className="btn btn-warning m-1 btn_edit"
                                      >
                                        <i className="far fa-edit" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleShowFormDelete(category)
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
