import React from "react";
import AdminThemeTop from "./AdminThemeTop";
import ReactPaginate from "react-paginate";
import SearchTheme from "./SearchTheme";

export default function ImageAdmin() {
  const isPagination = true;
  const product = [1, 2, 4, 5];

  const handlePageClick = () => {};
  return (
    <div id="main">
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            <AdminThemeTop />
            <SearchTheme />
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

                        <div style={{ display: "flex" }}>
                          <button id="info" className="btn btn-success btn_add">
                            <i className="fas fa-plus" />{" "}
                            <span>Thêm Danh Mục</span>
                          </button>
                          <div
                            className="form_add display_none"
                            style={{ marginLeft: 20 }}
                          >
                            <form
                              action="/QLSACH/admin/author/add.htm"
                              method="post"
                              style={{ display: "flex" }}
                            >
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
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered text-center">
                          <thead>
                            <tr>
                              <th>
                                <a href="/QLSACH/admin/review.htm?page=1&order=id&dir=desc">
                                  ID Ảnh
                                </a>
                              </th>
                              <th>
                                <a href="/QLSACH/admin/review.htm?page=1&order=id&dir=desc">
                                  ID Sản phẩm
                                </a>
                              </th>
                              <th>
                                <a href="/QLSACH/admin/review.htm?page=1&order=id&dir=desc">
                                  Tên Sản Phẩm
                                </a>
                              </th>
                              <th>Hình ảnh</th>
                              <th>Cập nhật</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="table-white">
                              <td>4</td>
                              <td>2</td>
                              <td>Cá Neon Gấu Trúc Paraguayensis Tetra</td>
                              <td><img style={{width: 200}} src="https://bizweb.dktcdn.net/thumb/large/100/424/759/products/rummynosetetra.jpg" alt="anh_ca"/></td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-warning m-1 btn_edit"
                                >
                                  <i className="far fa-edit" />
                                </button>
                                <button
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
                          </tbody>
                        </table>
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
