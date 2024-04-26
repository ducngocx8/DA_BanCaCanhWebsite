import React, { Fragment, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";
import { useDispatch } from "react-redux";

export default function Logout() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  useEffect(() => {
    async function checkPermission() {
      const response = await axios.get(
        `${ApiLink.domain + "/account/logout"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        dispatch({
          type: "load_cart",
          value: [],
        });
        return navigate("/account/login", { replace: true });
      }
    }
    checkPermission();
  }, [navigate, dispatch]);

  return <Fragment></Fragment>;
}
