import React from "react";

export default function Toast({ info, deleteToast }) {
  return (
    <div
      className="toast_container toast_to_left"
      style={{ borderLeftColor: info.color }}
    >
      <i className={info.icon + " toast_icon"} style={{ color: info.color }} />
      <div className="toast_content">
        <span style={{ fontWeight: 700, color: info.color }}>
          {info.status}
        </span>
        <span className="toast_content_name" style={{ color: "#656565" }}>
          {info.content}
        </span>
      </div>
      <div>
        <i
          onClick={() => deleteToast(info.id)}
          className="fa fa-times toast_close"
          style={{ fontSize: 20, cursor: "pointer", color: "#656565" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
