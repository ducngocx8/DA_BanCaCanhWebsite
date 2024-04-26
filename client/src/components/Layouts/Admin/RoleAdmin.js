import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";
import FormEditRole from "./Form/FormEditRole";
import SearchTheme from "./SearchTheme";
import FormConfirm from "./Form/FormConfirm";

export default function RoleAdmin({ username }) {
  let [roleList, setRoleList] = useState([]);
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
    async function getAllRole() {
      const response = await axios.get(`${ApiLink.domain + "/admin/role"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setRoleList(response.data.data); // status, data
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
    getAllRole();
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
    setRoleList(data); // status, data
  };

  const handleSearch = (keyword) => {
    setKeyword(keyword.toLowerCase().trim());
  };

  const filterSearch = () => {
    return roleList.filter((item) => {
      return (
        item.role_code.toLowerCase().includes(keyword) ||
        item.role_name.toLowerCase().includes(keyword) ||
        Number(item.role_id) === Number(keyword)
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
            <FormEditRole
              itemChoose={itemEdit}
              status={"admin_edit_role"}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {itemAdd ? (
            <FormEditRole
              itemChoose={false}
              status={"admin_add_role"}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {itemDelete ? (
            <FormConfirm
              itemChoose={itemDelete}
              status={"admin_delete_role"}
              closeFormConfirm={closeFormConfirm}
              loadData={loadData}
              id_handle={itemDelete.role_code}
              content="Bạn có chắc chắc muốn xóa mã quyền hạn: "
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
              title={"Tìm kiếm quyền hạn"}
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
                          <i className="fas fa-plus" />{" "}
                          <span>Thêm Quyền Hạn</span>
                        </button>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>ROLE_ID</th>
                              <th>ROLE_CODE</th>
                              <th>ROLE_NAME</th>
                              <th>STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((role, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{role.role_id}</td>
                                    <td>{role.role_code}</td>
                                    <td>{role.role_name}</td>
                                    <td>
                                      <button
                                        className="btn btn-success btn_change_status"
                                        onClick={() => handleShowFormEdit(role)}
                                      >
                                        Chỉnh sửa
                                      </button>
                                      <button
                                        className="btn btn-info btn_change_status"
                                        onClick={() =>
                                          handleShowFormDelete(role)
                                        }
                                      >
                                        Xóa
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
