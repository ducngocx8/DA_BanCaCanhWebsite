import React, { Fragment } from "react";
import "../../../css/Bootstrap.css";
import "../../../css/Toast.css";
import "../../../css/Custom.css";
import AccountLeft from "./AccountLeft";

export default function Account({children}) {
  return (
    <Fragment>
      <AccountLeft />
      {children}
    </Fragment>
  );
}
