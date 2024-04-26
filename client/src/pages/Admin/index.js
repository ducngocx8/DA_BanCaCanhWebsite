import React, { Fragment, useEffect, useState } from "react";
import AdminThemeLeft from "../../components/Layouts/Admin/AdminThemeLeft";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiLink, Title, notify } from "../../Utils/Title";
export default function AdminPage({ children, active_id }) {
  let [loading, setLoading] = useState(false);
  let [roles, setRoles] = useState(false);
  let [username, setUsername] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    async function checkPermission() {
      const response = await axios.get(
        `${ApiLink.domain + "/check/admin-employee"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        document.title = active_id.substr(6, active_id.length) + Title.origin;
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
          <AdminThemeLeft roles={roles} active_id={active_id} />
          {React.cloneElement(children, { username: username })}
        </Fragment>
      )}
    </Fragment>
  );
}
