import { Link } from 'react-router-dom';
import AdminHeaderLeft from "../Admin/AdminHeaderLeft";
export default function AccountLeft({ active_id }) {
  return (
    <div id="sidebar" className="active">
      <div className="sidebar-wrapper active">
        <AdminHeaderLeft />
        <div className="sidebar-menu">
          <ul className="menu">
            <li className="sidebar-title">Danh Mục Khách Hàng</li>
            <li className={`sidebar-item ${active_id === 1 ? "active" : ""} `}>
              <Link to="/account/info" className="sidebar-link">
                <i className="fas fa-chart-bar" />
                <span>Thông tin tài khoản</span>
              </Link>
            </li>
            <li className={`sidebar-item ${active_id === 2 ? "active" : ""} `}>
              <Link to="/account/cart" className="sidebar-link">
                <i className="fas fa-book" />
                <span>Giỏ hàng</span>
              </Link>
            </li>
            <li className={`sidebar-item ${active_id === 3 ? "active" : ""} `}>
              <Link to="/account/order" className="sidebar-link">
                <i className="fas fa-cart-plus" />
                <span>Danh sách đơn hàng</span>
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
