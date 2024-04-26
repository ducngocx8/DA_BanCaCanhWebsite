import React from "react";
import { Link } from "react-router-dom";

export default function DeliveryThemeLeft({ active_id, roles }) {
  console.log(roles);
  return (
    <div id="sidebar" className="active">
      <div className="sidebar-wrapper active" id="style-15">
        <div className="sidebar-header">
          <div className="d-flex justify-content-between">
            <div className="logo">
              <Link to="/delivery/order" style={{ textDecoration: "none" }}>
                <img src="/logo.png" style={{ height: 40 }} alt="Logo" />
                <span style={{ fontSize: 25, color: "#435ebe" }}>
                  FISH STORE
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="menu">
            <li className="sidebar-title">Danh Mục Quản Lý</li>
            <li
              className={`sidebar-item ${
                active_id === "DELIVERY_ORDER" ? "active" : ""
              } `}
            >
              <Link to="/delivery/order" className="sidebar-link">
                <i className="fas fa-chart-bar" />
                <span>Danh sách vận chuyển</span>
              </Link>
            </li>
          </ul>
        </div>
        <button className="sidebar-toggler btn x">
          <i data-feather="x" />
        </button>
      </div>
    </div>
  );
}
