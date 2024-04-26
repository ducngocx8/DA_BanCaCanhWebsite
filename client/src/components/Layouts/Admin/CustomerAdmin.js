import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import SearchTheme from "./SearchTheme";
import { useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";
import FormAddUser from "./Form/FormAddUser";
import FormUserDetail from "./Form/FormUserDetail";
import FormEditUser from "./Form/FormEditUser";

export default function CustomerAdmin({username}) {
  let [userList, setUserList] = useState([]);
  let [page, setPage] = useState(1);
  const maxShow = 7;
  let navigate = useNavigate();
  let [itemEdit, setItemEdit] = useState(false);
  let [itemAdd, setItemAdd] = useState(false);
  let [itemDetail, setItemDetail] = useState(false);
  let [keyword, setKeyword] = useState("");

  const handleShowFormEdit = (item) => {
    setItemEdit(item);
  };

  const handleShowFormAdd = () => {
    setItemAdd(true);
  };

  const handleShowFormDetail = (user) => {
    setItemDetail(user);
  };

  const closeFormDetail = () => {
    setItemDetail(false);
  };

  const handleCloseFormEdit = async (edit_submit, result) => {
    if (result & !edit_submit) {
      await reloadData();
    }
    setItemEdit(false);
  };

  useEffect(() => {
    async function getAllUser() {
      const response = await axios.get(`${ApiLink.domain + "/admin/user"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setUserList(response.data.data); // status, data
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
    getAllUser();
  }, [navigate]);

  const handlePageClick = (event) => {
    if (page !== event.selected + 1) setPage(event.selected + 1);
  };

  const loadData = (data) => {
    setUserList(data);
  };

  const reloadData = async () => {
    const response = await axios.get(`${ApiLink.domain + "/admin/user"}`, {
      withCredentials: true,
    });
    if (response.data.status) {
      setUserList(response.data.data);
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
  };

   const handleSearch = (keyword) => {
     setKeyword(keyword.toLowerCase().trim());
   };

   const filterSearch = () => {
     return userList.filter((item) => {
       return (
         item.username.toLowerCase().includes(keyword) ||
         item.email.toLowerCase().includes(keyword) ||
         item.address.toLowerCase().includes(keyword) ||
         item.firstname.toLowerCase().includes(keyword) ||
         item.lastname.toLowerCase().includes(keyword) ||
         item.phonenumber.toLowerCase().includes(keyword) ||
         Number(item.user_id) === Number(keyword)
       );
     });
   };

  return (
    <div id="main">
      {itemAdd || itemEdit || itemDetail ? (
        <div
          className="background_black"
          id="background_black"
          style={{ display: "block" }}
        >
          {itemEdit ? (
            <FormEditUser
              itemChoose={itemEdit}
              status={"admin_edit_order"}
              closeForm={handleCloseFormEdit}
              loadData={loadData}
            />
          ) : (
            ""
          )}

          {itemDetail ? (
            <FormUserDetail
              itemChoose={itemDetail}
              closeForm={closeFormDetail}
            />
          ) : (
            ""
          )}

          {itemAdd ? (
            <FormAddUser
              status={"admin_edit_user"}
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
              title={"Tìm kiếm người dùng"}
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
                          Danh sách người dùng
                        </h4>

                        <div style={{ display: "flex" }}>
                          <button
                            id="info"
                            className="btn btn-success btn_add"
                            onClick={() => handleShowFormAdd()}
                          >
                            <i className="fas fa-plus" />{" "}
                            <span>Thêm Người Dùng</span>
                          </button>
                        </div>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Số điện thoại</th>
                              <th>Quyền</th>
                              <th>Trạng thái</th>
                              <th>Cập nhật</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterSearch().map((user, index) => {
                              if (
                                index >= (page - 1) * maxShow &&
                                index < page * maxShow
                              ) {
                                return (
                                  <tr key={index} className="table-white">
                                    <td>{user.user_id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    {user.phonenumber !== "" ? (
                                      <td
                                        style={{
                                          color: "#007bff",
                                          fontWeight: 700,
                                        }}
                                      >
                                        {user.phonenumber}
                                      </td>
                                    ) : (
                                      <td
                                        style={{
                                          color: "#ffc107",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Chưa cập nhật
                                      </td>
                                    )}
                                    <td>
                                      {user.Roles.map((role, index) => {
                                        return (
                                          <div key={index}>
                                            {role.role_name}
                                          </div>
                                        );
                                      })}
                                    </td>
                                    {user.user_status === 1 ? (
                                      <td
                                        style={{
                                          color: "#007bff",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Chưa xác thực
                                      </td>
                                    ) : user.user_status === 2 ? (
                                      <td
                                        style={{
                                          color: "#28a745",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Đang hoạt động
                                      </td>
                                    ) : (
                                      <td
                                        style={{
                                          color: "#dc3545",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Tạm khóa
                                      </td>
                                    )}
                                    <td>
                                      <button
                                        onClick={() => handleShowFormEdit(user)}
                                        type="button"
                                        className="btn btn-warning m-1 btn_edit"
                                      >
                                        <i className="far fa-edit" />
                                      </button>

                                      <button
                                        className="btn btn-info btn_change_status"
                                        onClick={() =>
                                          handleShowFormDetail(user)
                                        }
                                      >
                                        Chi Tiết
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
