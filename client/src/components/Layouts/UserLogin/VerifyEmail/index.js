import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiLink, Title, notify } from "../../../../Utils/Title";
import Login from "../Login";
import { useParams } from "react-router-dom";
export default function VerifyEmail() {
  let [message, setMessage] = useState("");
  let { email, token } = useParams();
  console.log(email, token);

  useEffect(() => {
      document.title = Title.verifyEmail + Title.origin;
    const checkResult = async () => {
      const response = await axios.get(
        `${ApiLink.domain + "/account/verify/email/" + email + "/" + token}`,
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      if (response.data.status) {
        notify(true, response.data.message);
      } else {
        notify(false, response.data.message);
      }
    };
    checkResult();
  }, [email, token]);

  return (
    <div style={{ paddingLeft: 20 }}>
      <div
        className="login_signin"
        style={{ color: "red", fontWeight: "bold" }}
      >
        {message}
      </div>
      <Login />
    </div>
  );
}
