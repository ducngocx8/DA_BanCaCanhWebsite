import React from "react";

export default function DeliveryThemeTop({ username, order_amount }) {
  return (
    <div className="row">
      <div className="col-6 col-lg-6 col-md-6">
        <div className="card">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon blue">
                  <i className="fas fa-database text-c-blue f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">
                  Số Đơn Hàng Vận Chuyển
                </h6>
                <h6 className="font-bold mb-0">{order_amount}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6 col-lg-6 col-md-6">
        <div className="card">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon red">
                  <i className="fas fa-user text-c-yellow f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">
                  Thông Tin Người Giao Hàng
                </h6>
                <h6 className="font-bold mb-0">
                  <a href="/account/login">{username}</a> |{" "}
                  <span>
                    <a href="/account/logout">Logout</a>
                  </span>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
