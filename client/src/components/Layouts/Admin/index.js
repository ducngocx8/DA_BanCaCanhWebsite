import React, { Fragment } from "react";
import AdminThemeLeft from "./AdminThemeLeft";

export default function AdminTheme({children}) {
  return (
    <Fragment>
      <AdminThemeLeft />
      {children}
    </Fragment>
  );
}
