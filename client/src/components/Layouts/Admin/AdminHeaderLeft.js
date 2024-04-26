import React from 'react'
import { Link } from 'react-router-dom';

export default function AdminHeaderLeft() {
  return (
    <div className="sidebar-header">
      <div className="d-flex justify-content-between">
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src="/logo.png" style={{ height: 40 }} alt="Logo" />
            <span style={{ fontSize: 25, color: "#435ebe" }}>FISH STORE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
