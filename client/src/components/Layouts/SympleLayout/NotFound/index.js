import React, { Fragment, useEffect } from "react";
import Header from "../Header";
import { Title } from "../../../../Utils/Title";

export default function NotFound() {
   useEffect(() => {
     document.title = Title.notFound + Title.origin;
   }, []);
  return (
    <Fragment>
      <Header />
      <div className="flex_center signup bg-white">
        <div className="_1200px flex_center signup_container">
          <div className="signup_container_left">
            <h2
              style={{ padding: "30px 15px", color: "#0166d6", fontSize: 45 }}
            >
              TRANG YÊU CẦU KHÔNG TỒN TẠI
            </h2>
          </div>
          <div
            className="signup_container_right"
            style={{ backgroundImage: `url("/images/background.jpg")` }}
          />
        </div>
      </div>
    </Fragment>
  );
}
