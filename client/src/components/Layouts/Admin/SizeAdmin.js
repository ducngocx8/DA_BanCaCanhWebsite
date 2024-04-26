import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import SearchTheme from "./SearchTheme";
import FormConfirm from "./Form/FormConfirm";

export default function SizeAdmin({ username }) {
  let navigate = useNavigate();
  let [addStatus, setAddStatus] = useState(false);
  let [editStatus, setEditStatus] = useState(false);
  let [deleteStatus, setDeleteStatus] = useState(false);
  let [sizeNameAdd, setSizeNameAdd] = useState("");
  let [sizeNameEdit, setSizeNameEdit] = useState("");
  let [itemEdit, setItemEdit] = useState(false);
  let [itemDelete, setItemDelete] = useState(false);
  let [sizeList, setSizeList] = useState([]);
  let [page, setPage] = useState(1);
  let [keyword, setKeyword] = useState("");
  const maxShow = 7;

  const handleClickAdd = () => {
    setAddStatus(!addStatus);
  };

  const handleClickEdit = (item) => {
    console.log(editStatus);
    if (item.size_id !== itemEdit.size_id) {
      setEditStatus(true);
      setItemEdit(item);
      setSizeNameEdit(item.size_name);
    } else if (editStatus) {
      setEditStatus(!editStatus);
      setItemEdit(false);
      setSizeNameEdit("");
    } else {
      setEditStatus(!editStatus);
      setItemEdit(item);
      setSizeNameEdit(item.size_name);
    }
  };

  const handleEditSubmit = async () => {
    const size_edit = {
      size_name: sizeNameEdit.trim(),
    };
    const response = await axios.put(
      `${ApiLink.domain + "/admin/size/" + itemEdit.size_id}`,
      size_edit,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      setSizeList(response.data.data);
      setItemEdit(false);
      setSizeNameEdit("");
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
    const size = {
      size_name: sizeNameAdd.trim(),
    };
    const response = await axios.post(
      `${ApiLink.domain + "/admin/size"}`,
      size,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      setSizeList(response.data.data);
      setAddStatus(false);
      setSizeNameAdd("");
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
    setSizeNameAdd(value);
  };

  const handleChangeNameEdit = (e) => {
    const { value } = e.target;
    setSizeNameEdit(value);
  };

  useEffect(() => {
    async function getAllSize() {
      const response = await axios.get(`${ApiLink.domain + "/admin/size"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setSizeList(response.data.data); // status, data
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
    getAllSize();
  }, [navigate]);

  const handleShowFormDelete = (item) => {
    setDeleteStatus(true);
    setItemDelete(item);
  };

  const loadData = async (data) => {
    setSizeList(data); // status, data
  };

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword.toLowerCase().trim());
  };

  const filterSearch = () => {
    return sizeList.filter((item) => {
      return (
        item.size_name.toLowerCase().includes(keyword) ||
        Number(item.size_id) === Number(keyword)
      );
    });
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
            status={"admin_delete_size"}
            content={
              "Bạn chắc chắn muốn xóa danh mục " +
              itemDelete.size_name +
              " với ID = "
            }
            id_handle={itemDelete.size_id}
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
              title={"Tìm kiếm size sản phẩm"}
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
                          Danh sách Size
                        </h4>

                        <div style={{ display: "flex" }}>
                          <button
                            id="info"
                            className="btn btn-success btn_add"
                            onClick={() => handleClickAdd()}
                          >
                            <i className="fas fa-plus" /> <span>Thêm Size</span>
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
                                  name="sizeName"
                                  type="text"
                                  defaultValue={sizeNameAdd}
                                  id="input_add_author"
                                  placeholder="VD: 3cm - 4cm"
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
                              <th>ID SIZE</th>
                              <th style={{ width: "40%" }}>Tên Size</th>
                              <th>Cập nhật</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((size, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{size.size_id}</td>
                                    <td>
                                      {itemEdit &&
                                      itemEdit.size_id === size.size_id ? (
                                        <div className="flex_center">
                                          <input
                                            onChange={(e) =>
                                              handleChangeNameEdit(e)
                                            }
                                            className="form-control"
                                            name="sizeName"
                                            type="text"
                                            defaultValue={itemEdit.size_name}
                                            id="input_add_author"
                                            placeholder="VD: 3cm - 4cm"
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
                                        <span>{size.size_name}</span>
                                      )}
                                    </td>
                                    <td>
                                      <button
                                        onClick={() => handleClickEdit(size)}
                                        type="button"
                                        className="btn btn-warning m-1 btn_edit"
                                      >
                                        <i className="far fa-edit" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleShowFormDelete(size)
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
