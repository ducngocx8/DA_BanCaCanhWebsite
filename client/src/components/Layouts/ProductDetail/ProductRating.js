import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../Utils/Title";
import { useNavigate } from "react-router-dom";

export default function ProductRating({ fish_id }) {
  let [login, isLogin] = useState(false);
  let [usernameLogin, setUsernameLogin] = useState("");
  const convertToDate = (time) => {
    const date = new Date(Number(Date.parse(time)));
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  let navigate = useNavigate();
  let [showRating, setShowRating] = useState(false);
  let [starChoose, setStarChoose] = useState(5);
  let [fishRate, setFishRate] = useState([]);
  let [review, setReview] = useState("");

  const handleChangeStar = (value) => {
    setStarChoose(value);
  };

  const handleRateSubmit = async () => {
    const rate_content = {
      rate_comment: review,
      fish_id: fish_id,
      rate_point: starChoose,
    };

    const response = await axios.post(
      `${ApiLink.domain + "/rate"}`,
      rate_content,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    if (response.data.status) {
      notify(true, response.data.message);
      setFishRate(response.data.data);
    } else {
      notify(false, response.data.message);
      if (response.data.must === "login") {
        return navigate("/account/login", { replace: true });
      }
    }
  };

  const handleChangeReview = (e) => {
    const { value } = e.target;
    setReview(value);
  };

  const avgStars = () => {
    let sum = 0;
    fishRate.forEach((rate) => (sum += rate.rate_point));
    if (fishRate.length > 0) {
      return sum / fishRate.length;
    }
    return 0;
  };

  const avgPercent = () => {
    let arrStar = new Array(5).fill(0);
    if (fishRate.length > 0) {
      fishRate.forEach((rate) => (arrStar[5 - rate.rate_point] += 1));
      arrStar = arrStar.map((number) => number / fishRate.length);
      console.log(arrStar);
    }
    return arrStar;
  };

  const handleShowRating = async () => {
    setShowRating(!showRating);
  };

  const handleDeleteRate = async () => {
    const response = await axios.delete(
      `${ApiLink.domain + "/rate/" + fish_id}`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    if (response.data.status) {
      notify(true, response.data.message);
      setFishRate(response.data.data);
    } else {
      notify(false, response.data.message);
      if (response.data.must === "login") {
        return navigate("/account/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    async function getFishRate() {
      const response = await axios.get(
        `${ApiLink.domain + "/rate/" + fish_id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setFishRate(response.data.data); // status, data
      }
    }
    getFishRate();
  }, [fish_id]);

  useEffect(() => {
    async function checkLogin() {
      const response = await axios.get(`${ApiLink.domain + "/check/all"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        isLogin(true);
        setUsernameLogin(response.data.username);
      } else {
        if (response.data.must === "login") {
          isLogin(false);
        }
      }
    }
    checkLogin();
  }, []);

  return (
    <div className="rating flex_center mg-20_0">
      <div className="_1200px bg-white pd-10">
        <h3 className="rating_title mg-10_0">Đánh giá sản phẩm</h3>
        <div className="overall_detail flex_center">
          <div className="overall_rating">
            <div>Đánh Giá Trung Bình</div>
            <p className="point">{avgStars().toFixed(1)}</p>
            <div className="star">
              {new Array(Math.round(avgStars())).fill(0).map((start, index) => {
                return (
                  <i
                    key={index}
                    className="fa fa-star"
                    style={{ color: "#48bb78" }}
                  />
                );
              })}

              {new Array(5 - Math.round(avgStars()))
                .fill(0)
                .map((start, index) => {
                  return (
                    <i
                      key={index}
                      className="fa fa-star"
                      style={{ color: "rgba(83, 79, 79, 0.13)", fontSize: 15 }}
                    />
                  );
                })}
            </div>
            <div className="rating_total">{fishRate.length} đánh giá</div>
          </div>
          <div className="rating_total_detail">
            {avgPercent().map((element, index) => {
              console.log(element);
              return (
                <div
                  key={index}
                  className="five_star flex_align_center mg-10_0"
                >
                  <span>{5 - index}</span>
                  <i className="fa fa-star" style={{ color: "#48bb78" }} />
                  <span className="progress_star mg-l-10">
                    <span
                      className="progress_star_over"
                      style={{ width: element * 200 }}
                    />
                  </span>
                  <span className="percent">{(element * 100).toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
          <button
            className="btn_show_review_input"
            onClick={() => handleShowRating()}
          >
            Gửi đánh giá của bạn
          </button>{" "}
          {/* CHƯA ĐÁNH GIÁ / ĐÁNH GIÁ  (ĐÃ LOGIN) */}
        </div>
        {/* FORM ĐÁNH GIÁ */}
        {showRating ? (
          login ? (
            <div
              className="form_review display_flex"
              style={{ backgroundColor: "#f8f9fa", padding: 20 }}
            >
              <div
                className="form_left"
                style={{ flex: 4, textAlign: "center" }}
              >
                <p>
                  <b>Bạn chấm sản phẩm này bao nhiêu sao?</b>
                </p>
                <ul className="list_star_review" style={{ marginTop: 10 }}>
                  {new Array(5).fill(0).map((item, index) => {
                    return index < starChoose ? (
                      <i
                        key={index}
                        className="fa fa-star one_star_review star_orange"
                        star_value={index + 1}
                        onClick={() => handleChangeStar(index + 1)}
                        style={{ fontSize: 20 }}
                      />
                    ) : (
                      <i
                        key={index}
                        className="fa fa-star one_star_review"
                        star_value={index + 1}
                        onClick={() => handleChangeStar(index + 1)}
                        style={{ color: "#676666", fontSize: 20 }}
                      />
                    );
                  })}
                </ul>
              </div>
              <div className="form_right" style={{ flex: 6 }}>
                <textarea
                  name="review"
                  rows={3}
                  placeholder="Bạn có khuyên người khác mua sản phẩm này không? Tại sao?"
                  defaultValue={review}
                  onChange={(e) => handleChangeReview(e)}
                />
                <button
                  style={{ outline: "none" }}
                  className="btn_review_submit"
                  onClick={() => handleRateSubmit()}
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          ) : (
            <div
              className="form_review"
              style={{ backgroundColor: "#f8f9fa", padding: 20 }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: 19,
                  color: "#cb1c22",
                  fontWeight: 700,
                }}
              >
                Vui lòng đăng nhập tài khoản để đánh giá sản phẩm
              </div>
            </div>
          )
        ) : (
          ""
        )}

        <div className="rate">
          {fishRate.map((rate, index) => {
            return (
              <div
                key={index}
                className="one_rate"
                style={{ position: "relative" }}
              >
                {isLogin && usernameLogin === rate.User.username ? (
                  <button
                    style={{ outline: "none" }}
                    className="btn_review_delete"
                    onClick={() => handleDeleteRate()}
                  >
                    Xóa Đánh giá
                  </button>
                ) : (
                  ""
                )}
                <div className="user_image">
                  <img src="/images/user.png" alt="user_rating" />
                </div>
                <div className="rating_content">
                  <div className="username_star pd-5_0">
                    <div className="user_name">
                      <strong>{rate.User.username}</strong>
                    </div>
                    <div
                      className="star"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {new Array(rate.rate_point).fill(0).map((star, index) => {
                        return (
                          <i
                            key={index}
                            className="fa fa-star"
                            style={{ color: "orange" }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="pd-5_0">{rate.rate_comment}</div>
                  <div className="time_rate pd-5_0">
                    <i className="fas fa-clock" style={{ color: "green" }} />
                    <span style={{ paddingLeft: 3 }}>
                      {convertToDate(rate.rate_time)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
