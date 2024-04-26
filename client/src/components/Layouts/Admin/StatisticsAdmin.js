import React, { useEffect, useState } from "react";
import AdminThemeTop from "./AdminThemeTop";
import Chart from "react-apexcharts";
import { ApiLink, notify } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StatisticsAdmin({ username }) {
  let [revenue, setRevenue] = useState([]);
  let [year, setYear] = useState(new Date().getFullYear());
  let navigate = useNavigate();

  const handleDataRevenue = () => {
    const data = new Array(12).fill(0);
    revenue.forEach((item) => {
      const month = new Date(Number(Date.parse(item.order_time))).getMonth();
      data[month] += Number(item.total);
    });
    return data;
  };

  const handleChangeYear = (e) => {
    setYear(Number(e.target.value));
  };

  const option_vip = {
    series: [
      {
        name: "Doanh thu",
        data: handleDataRevenue(),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Number(val).toLocaleString("vi") + "đ";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },

      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return Number(val).toLocaleString("vi") + "đ";
          },
        },
      },
    },
  };

  useEffect(() => {
    async function getRevenueOfYear() {
      const response = await axios.get(
        `${ApiLink.domain + "/admin/statistic/getRevenueOfYear/" + year}`,
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

    getRevenueOfYear();
  }, [navigate, year]);

  return (
    <div id="main">
      <header className="mb-3">
        <a href="/" className="burger-btn d-block d-xl-none">
          <i className="bi bi-justify fs-3" />
        </a>
      </header>
      <div className="page-heading">
        <h3>Thống Kê Năm</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            <AdminThemeTop username={username} />
            <div className="row">
              <div className="col-12" style={{ position: "relative" }}>
                <div
                  className="form_year_select"
                  style={{
                    position: "absolute",
                    zIndex: 10000,
                    top: 0,
                    right: 40,
                  }}
                >
                  <select
                    onChange={(e) => handleChangeYear(e)}
                    className="form-select"
                    name="year"
                    id="year_profit"
                    defaultValue={year}
                    aria-label="Default select example"
                  >
                    <option value={new Date().getFullYear()}>
                      {new Date().getFullYear()}
                    </option>
                    <option value={new Date().getFullYear() - 1}>
                      {new Date().getFullYear() - 1}
                    </option>
                    <option value={new Date().getFullYear() - 2}>
                      {new Date().getFullYear() - 2}
                    </option>
                  </select>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h4>Thống kê doanh thu năm {year}</h4>
                  </div>
                  <div className="card-body">
                    <div id="chart">
                      <Chart
                        options={option_vip.options}
                        series={option_vip.series}
                        type="bar"
                        height={350}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
