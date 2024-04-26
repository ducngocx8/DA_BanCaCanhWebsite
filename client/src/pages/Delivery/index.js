import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiLink, Title, notify } from "../../Utils/Title";
import DeliveryThemeLeft from "../../components/Layouts/Delivery/DeliveryThemeLeft";
export default function DeliveryPage({ children, active_id }) {
  let [loading, setLoading] = useState(false);
  let [roles, setRoles] = useState(false);
  let [username, setUsername] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    async function checkPermission() {
      const response = await axios.get(
        `${ApiLink.domain + "/check/delivery"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        document.title = "Quản lý vận chuyển" + Title.origin;
        setLoading(true);
        setRoles(response.data.roles);
        setUsername(response.data.username);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
        return navigate("/", { replace: true });
      }
    }
    checkPermission();
  }, [navigate, active_id]);
  return (
    <Fragment>
      {!loading ? (
        ""
      ) : (
        <Fragment>
          <DeliveryThemeLeft roles={roles} active_id={active_id} />
          {React.cloneElement(children, { username: username })}
        </Fragment>
      )}
    </Fragment>
  );
}
