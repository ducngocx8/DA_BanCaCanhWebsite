import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function AdminThemeLeft({ active_id, roles }) {
  console.log(roles);
  return (
    <div id="sidebar" className="active">
      <div className="sidebar-wrapper active" id="style-15">
        <div className="sidebar-header">
          <div className="d-flex justify-content-between">
            <div className="logo">
              <Link to="/admin/statistic" style={{ textDecoration: "none" }}>
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
                active_id === "ADMIN_STATISTIC" ? "active" : ""
              } `}
            >
              <Link to="/admin/statistic" className="sidebar-link">
                <i className="fas fa-chart-bar" />
                <span>Statistics</span>
              </Link>
            </li>
            <li
              className={`sidebar-item ${
                active_id === "ADMIN_PRODUCT" ? "active" : ""
              } `}
            >
              <Link to="/admin/product" className="sidebar-link">
                <i className="fas fa-book" />
                <span>Products</span>
              </Link>
            </li>
            <li
              className={`sidebar-item ${
                active_id === "ADMIN_SIZE" ? "active" : ""
              } `}
            >
              <Link to="/admin/size" className="sidebar-link">
                <i className="fas fa-user-astronaut" />
                <span>Sizes</span>
              </Link>
            </li>
            <li
              className={`sidebar-item ${
                active_id === "ADMIN_CATEGORY" ? "active" : ""
              } `}
            >
              <Link to="/admin/category" className="sidebar-link">
                <i className="fas fa-bookmark" />
                <span>Categories</span>
              </Link>
            </li>
            <li
              className={`sidebar-item ${
                active_id === "ADMIN_ORDER" ? "active" : ""
              } `}
            >
              <Link to="/admin/order" className="sidebar-link">
                <i className="fas fa-cart-plus" />
                <span>Orders</span>
              </Link>
            </li>
            <li
              className={`sidebar-item ${
                active_id === "ADMIN_RATE" ? "active" : ""
              } `}
            >
              <Link to="/admin/rate" className="sidebar-link">
                <i className="fas fa-feather" />
                <span>Reviews</span>
              </Link>
            </li>
            {roles.includes("ROLE_ADMIN") ? (
              <Fragment>
                <li
                  className={`sidebar-item ${
                    active_id === "ADMIN_CUSTOMER" ? "active" : ""
                  } `}
                >
                  <Link to="/admin/customer" className="sidebar-link">
                    <i className="fas fa-user-circle" />
                    <span>Customers</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-item ${
                    active_id === "ADMIN_ROLE" ? "active" : ""
                  } `}
                >
                  <Link to="/admin/role" className="sidebar-link">
                    <i className="fas fa-house-user" />
                    <span>Roles</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-item ${
                    active_id === "ADMIN_COUPON" ? "active" : ""
                  } `}
                >
                  <Link to="/admin/coupon" className="sidebar-link">
                    <i className="fas fa-tag"></i>
                    <span>Coupons</span>
                  </Link>
                </li>

                <li
                  className={`sidebar-item ${
                    active_id === "ADMIN_OTP" ? "active" : ""
                  } `}
                >
                  <Link to="/admin/otp" className="sidebar-link">
                    <i className="fas fa-code"></i>
                    <span>OTP SMS</span>
                  </Link>
                </li>
              </Fragment>
            ) : (
              ""
            )}
          </ul>
        </div>
        <button className="sidebar-toggler btn x">
          <i data-feather="x" />
        </button>
      </div>
    </div>
  );
}
