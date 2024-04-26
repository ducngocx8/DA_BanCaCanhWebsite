import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";
import axios from "axios";

export default function AdminThemeTop({ username }) {
  let navigate = useNavigate();
  let [userAmount, setUserAmount] = useState(0);
  let [revenue, setRevenue] = useState([]);
  let [orderAmount, setOrderAmount] = useState(0);

  const sumRevenue = () => {
    let sum = 0;
    revenue.forEach((item) => {
      sum += Number(item.total);
    });
    return sum;
  };

  useEffect(() => {
    async function getOrderSuccessAmount() {
      const response = await axios.get(
        `${ApiLink.domain + "/admin/statistic/orderSucessAmount"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setOrderAmount(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    }

    async function getUserAmount() {
      const response = await axios.get(
        `${ApiLink.domain + "/admin/statistic/userAmount"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setUserAmount(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    }

    async function getRevenueOfYear() {
      const response = await axios.get(
        `${
          ApiLink.domain +
          "/admin/statistic/getRevenueOfYear/" +
          new Date().getFullYear()
        }`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setRevenue(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    }

    const list_promise = [
      Promise.resolve(getOrderSuccessAmount()),
      Promise.resolve(getUserAmount()),
      Promise.resolve(getRevenueOfYear()),
    ];

    Promise.all(list_promise);
  }, [navigate]);
  return (
    <div className="row">
      <div className="col-6 col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon purple">
                  <i className="fas fa-money-bill-alt text-c-red f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">Doanh Thu</h6>
                <h6 className="font-bold mb-0">
                  {Number(sumRevenue()).toLocaleString("vi")}đ
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6 col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon blue">
                  <i className="fas fa-database text-c-blue f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">Đơn Hàng</h6>
                <h6 className="font-bold mb-0">{orderAmount}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6 col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon green">
                  <i className="fas fa-dollar-sign text-c-green f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">Tổng User</h6>
                <h6 className="font-bold mb-0">{userAmount}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6 col-lg-3 col-md-6">
        <div className="card">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon red">
                  <i className="fas fa-user text-c-yellow f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">Login Info</h6>
                <h6 className="font-bold mb-0">
                  <a href="/account/login">{username}</a> |{" "}
                  <span>
                    <a href="/account/logout">Logout</a>
                  </span>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
