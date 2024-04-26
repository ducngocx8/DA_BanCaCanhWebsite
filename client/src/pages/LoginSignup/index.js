import React, { Fragment, useEffect, useState } from "react";
import Header from "../../components/Layouts/SympleLayout/Header";
import "../../css/UserLogin.css";
import { ApiLink } from "../../Utils/Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginSignup({ children }) {
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    async function checkPermission() {
      const response = await axios.get(`${ApiLink.domain + "/check/all"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        return navigate("/account/info", { replace: true });
      } else {
        if (response.data.must === "login") {
          setLoading(true);
        } else return navigate("/", { replace: true });
      }
    }
    checkPermission();
  }, [navigate]);

  return (
    <Fragment>
      {loading ? (
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
      ) : (
        ""
      )}
    </Fragment>
  );
}
