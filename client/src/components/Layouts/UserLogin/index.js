import React, { Fragment } from "react";
import Header from "../SympleLayout/Header";
import "../../../css/UserLogin.css";

export default function UserLogin({ children }) {
  return (
    <Fragment>
      <Header />
      <div className="flex_center signup bg-white">
        <div className="_1200px flex_center signup_container">
          {children}
          <div
            className="signup_container_right"
            style={{ backgroundImage: `url("/images/background.jpg")` }}
          ></div>
        </div>
      </div>
    </Fragment>
  );
}
