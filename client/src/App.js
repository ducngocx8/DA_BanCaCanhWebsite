import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routers";
export default function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout;
            const active_id = route.active_id;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  Layout ? (
                    <Page active_id={active_id ? active_id : ""}>
                      <Layout />
                    </Page>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout;
            const active_id = route.active_id;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  Layout ? (
                    <Page active_id={active_id ? active_id : ""}>
                      <Layout />
                    </Page>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}
