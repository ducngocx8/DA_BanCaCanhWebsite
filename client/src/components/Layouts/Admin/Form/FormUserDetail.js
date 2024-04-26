import React from "react";

export default function FormUserDetail({ itemChoose, closeForm }) {
  const userState = {
    username: itemChoose.username,
    password: itemChoose.password,
    email: itemChoose.email,
    address: itemChoose.address,
    firstname: itemChoose.firstname,
    lastname: itemChoose.lastname,
    phonenumber: itemChoose.phonenumber,
    user_status: itemChoose.user_status,
    verify: true,
    role: itemChoose.Roles.map((item) => {
      return {
        role_id: item.role_id,
        role_name: item.role_name,
      };
    }),
  };

  return (
    <div
      className="row col-6 add_edit_class sroll_form"
      style={{
        backgroundColor: "rgb(242, 247, 255)",
        borderRadius: "3px 3px 0px 0px",
        boxShadow:
          "rgb(98, 176, 253) 0px 4px 8px, rgba(0, 0, 0, 0.08) 0px 4px 12px",
        padding: "0px !important",
        display: "block",
      }}
    >
      <div
        className="bg-primary"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
        }}
      >
        <div className="text-white add_book_class_header">
          Chi Tiết Người Dùng
        </div>
        <i
          onClick={() => closeForm(false, false)}
          className="far fa-times-circle btn_close_form"
          style={{ color: "white", fontSize: 25 }}
        />
      </div>
      <div>
        <div style={{ padding: 20, display: "flex" }}>
          <div className="col-6">
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Tên Đăng Nhập</label>
              <input
                disabled
                className="form-control showordisable"
                name="username"
                defaultValue={userState.username}
                type="text"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">First Name</label>
              <input
                disabled
                className="form-control"
                name="firstname"
                defaultValue={userState.firstname}
                type="text"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Số Điện Thoại</label>
              <input
                disabled
                className="form-control"
                name="phonenumber"
                type="number"
                defaultValue={userState.phonenumber}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Xác Thực</label>
              <select
                disabled
                className="form-select"
                name="verify"
                defaultValue={userState.verify}
                aria-label="Default select example"
              >
                <option value={true}>Đã xác thực</option>
                <option value={false}>Chưa Xác Thực</option>
              </select>
            </div>

            <div>
              <label className="form-label">Quyền</label>
              <div style={{ display: "flex", marginTop: 15, flexWrap: "wrap" }}>
                {userState.role.map((user_role, index) => {
                  return (
                    <div key={index} className="one_role">
                      {user_role.role_name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Email</label>
              <input
                disabled
                className="form-control"
                name="email"
                type="email"
                defaultValue={userState.email}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Last Name</label>
              <input
                disabled
                className="form-control"
                name="lastname"
                type="text"
                defaultValue={userState.lastname}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Nhập Mật Khẩu</label>
              <input
                disabled
                className="form-control showordisable"
                name="password"
                type="password"
                defaultValue={userState.password}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Trạng thái</label>
              <select
                disabled
                className="form-select"
                name="user_status"
                defaultValue={userState.user_status}
                aria-label="Default select example"
              >
                <option value={1}>Chưa xác thực</option>
                <option value={2}>Đang hoạt động</option>
                <option value={3}>Tạm Khóa</option>
              </select>
            </div>

            <div>
              <label className="form-label">Địa chỉ</label>
              <textarea
                disabled
                className="form-control"
                name="address"
                defaultValue={userState.address}
                type="text"
                rows="3"
              />
            </div>
          </div>
        </div>
        {/* <div className="col-12" style={{ padding: "0px 35px", margin: 0 }}>
          <label className="form-label">Địa chỉ</label>
          <textarea
            className="form-control"
            id="user-address"
            name="address"
            type="text"
            rows="3"
            placeholder="VD: Diễn Hoàng, Diễn Châu, Nghệ An"
          />
        </div> */}
      </div>
    </div>
  );
}
