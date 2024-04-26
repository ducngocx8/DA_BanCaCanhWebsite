import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ApiLink, notify } from "../../../Utils/Title";

export default function Statistic({ username }) {
  let [orderStatistic, setOrderStatistic] = useState([]);
  let navigate = useNavigate();
  console.log("orderStatistic", orderStatistic);

  const sumAll = () => {
    let money = 0;
    let order_success_count = 0;
    let order_nosucess_count = 0;
    orderStatistic.forEach((order) => {
      if (order.order_status === 5) {
        // Mua thành công
        money += Number(order.money_order);
        order_success_count += 1;
      } else if (order.order_status === 1) {
        order_nosucess_count += 1;
      }
    });
    return {
      money: Number(money),
      order_success_count: order_success_count,
      order_nosucess_count: order_nosucess_count,
    };
  };

  const resultStatistic = sumAll();

  useEffect(() => {
    async function getOrderStatistics() {
      const response = await axios.get(
        `${ApiLink.domain + "/order/userOrderStatistics"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setOrderStatistic(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
      console.log(response.data);
      return response.data.data;
    }
    getOrderStatistics();
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
                <h6 className="text-muted font-semibold">Số tiền đã mua</h6>
                <h6 className="mb-0">
                  {resultStatistic.money.toLocaleString("vi")} đ
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
                <h6 className="text-muted font-semibold">Đơn thành công</h6>
                <h6 className="mb-0">
                  {" "}
                  {resultStatistic.order_success_count} đơn
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
                <div className="stats-icon green">
                  <i className="fas fa-dollar-sign text-c-green f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">Đang chờ xác nhận</h6>
                <h6 className="mb-0">
                  {" "}
                  {resultStatistic.order_nosucess_count} đơn
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
                <div className="stats-icon red">
                  <i className="fas fa-user text-c-yellow f-18" />
                </div>
              </div>
              <div className="col-md-8">
                <h6 className="text-muted font-semibold">Login Info</h6>
                <h6 className="mb-0">
                  <Link to="/account/login">{username}</Link> |{" "}
                  <span>
                    <Link to="/account/logout">Logout</Link>
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
