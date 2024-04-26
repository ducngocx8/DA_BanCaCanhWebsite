import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { convertToDateOnly } from "../../../../Utils/Title";
import InvoiceLayout from "../../SympleLayout/Invoice";

export default function FromOrderDetail({
  itemChoose,
  handleCloseViewDetailClick,
}) {
  console.log(itemChoose);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Hóa đơn số " + itemChoose.order_id,
  });

  const sumMoney = (OrderDetails) => {
    let sum = 0;
    OrderDetails.forEach((item) => {
      sum += item.amount * item.price;
    });
    return sum - itemChoose.save_money;
  };
  return (
    <div
      className="row col-8 chitiet_class"
      style={{
        margin: 0,
        backgroundColor: "rgb(242, 247, 255)",
        borderRadius: "3px 3px 0px 0px",
        boxShadow:
          "rgb(98, 176, 253) 0px 4px 8px, rgba(0, 0, 0, 0.08) 0px 4px 12px",
        display: "block",
      }}
    >
      <div
        className="bg-primary"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
        }}
      >
        <div className="text-white add_book_class_header">
          Thông tin đơn hàng
        </div>
        <i
          className="far fa-times-circle btn_close_form"
          id="view_chitiet_exit"
          style={{ color: "white", fontSize: 25 }}
          onClick={() => handleCloseViewDetailClick()}
        />
      </div>
      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <div className="madonhang_id" style={{ fontWeight: "bold" }}>
            Mã đơn hàng: #
            <span id="id_order_detail_show">{itemChoose.order_id}</span>
            <span style={{ margin: "0px 5px" }}>Nhận hàng tại: </span>{" "}
            <span id="adsress_order_detail_show">{itemChoose.address}</span>
            <span style={{ margin: "0px 5px" }}>#Phone: </span>{" "}
            <span id="adsress_order_detail_show">{itemChoose.phonenumber}</span>
            <span style={{ margin: "0px 5px" }}>#Giảm giá: </span>{" "}
            <span id="adsress_order_detail_show">
              {Number(itemChoose.save_money).toLocaleString("vi") + "đ"}
            </span>
          </div>
          <div style={{ display: "none" }}>
            <InvoiceLayout itemChoose={itemChoose} ref={componentRef} />
          </div>
          <div>
            <button
              className="btn btn-success btn_change_status"
              onClick={handlePrint}
              style={{ minWidth: 130, marginLeft: 20 }}
            >
              {" "}
              In hóa đơn
            </button>
          </div>
        </div>
        {itemChoose.note ? (
          <div
            className="madonhang_id"
            style={{ fontWeight: "bold", marginBottom: 15 }}
          >
            <span>Nội dung: </span>
            <span id="id_order_detail_show">{itemChoose.note}</span>
          </div>
        ) : (
          ""
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #62b0fd",
            padding: 10,
          }}
        >
          <div className="customer">
            <div style={{ fontWeight: 500 }}>Khách Hàng:</div>
            <div id="customer_name_detail_show" style={{ fontWeight: "bold" }}>
              {itemChoose.fullname}
            </div>
          </div>
          <div className="time">
            <div style={{ fontWeight: 500 }}>Thời gian:</div>
            <div id="time_detail_show" style={{ fontWeight: "bold" }}>
              {convertToDateOnly(itemChoose.order_time)}
            </div>
          </div>
          <div className="delivery">
            <div style={{ fontWeight: 500 }}>Đơn vị giao:</div>
            <div style={{ fontWeight: "bold" }}>Shopee Express</div>
          </div>
          <div className="vanchuyen">
            <div style={{ fontWeight: 500 }}>Tổng tiền:</div>
            <div id="total_price_detail_show" style={{ fontWeight: "bold" }}>
              {sumMoney(itemChoose.OrderDetails).toLocaleString("vi") + "đ"}
            </div>
          </div>
        </div>
        <div
          className="step_delivery"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
            marginTop: 20,
          }}
        >
          <div
            className="step_one"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
            }}
          >
            <i
              className={
                itemChoose.order_status > 0
                  ? itemChoose.order_status !== 4 &&
                    itemChoose.order_status !== 6 &&
                    itemChoose.order_status !== 7 &&
                    itemChoose.order_status !== 8
                    ? "fa fa-box bg-success"
                    : "fa fa-box bg-danger"
                  : "fa fa-check bg-warning"
              }
              style={{
                padding: 10,
                border: "2px solid",
                borderRadius: "50%",
                color: "#fff",
              }}
            />
            <span className="text"> Chờ xác nhận </span>
          </div>
          <div
            className="step_two"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
            }}
          >
            <i
              className={
                itemChoose.order_status > 1 && itemChoose.order_status !== 7
                  ? itemChoose.order_status !== 4 &&
                    itemChoose.order_status !== 6 &&
                    itemChoose.order_status !== 7 &&
                    itemChoose.order_status !== 8
                    ? "fa fa-check bg-success"
                    : "fa fa-check bg-danger"
                  : "fa fa-check bg-warning"
              }
              style={{
                padding: 10,
                border: "2px solid",
                borderRadius: "50%",
                color: "#fff",
              }}
            />
            <span className="text"> Xác nhận </span>
          </div>
          <div
            className="step_three"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
            }}
          >
            <i
              className={
                itemChoose.order_status > 2 &&
                itemChoose.order_status !== 4 &&
                itemChoose.order_status !== 7
                  ? itemChoose.order_status !== 4 &&
                    itemChoose.order_status !== 6 &&
                    itemChoose.order_status !== 7 &&
                    itemChoose.order_status !== 8
                    ? "fa fa-truck bg-success"
                    : "fa fa-truck bg-danger"
                  : "fa fa-truck bg-warning"
              }
              style={{
                padding: 10,
                border: "2px solid",
                borderRadius: "50%",
                color: "#fff",
              }}
            />
            <span className="text">Vận chuyển</span>
          </div>
          <div
            className="step_four"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
            }}
          >
            <i
              className={
                itemChoose.order_status > 4 && itemChoose.order_status !== 7
                  ? itemChoose.order_status !== 4 &&
                    itemChoose.order_status !== 6 &&
                    itemChoose.order_status !== 7 &&
                    itemChoose.order_status !== 8
                    ? "fa fa-box bg-success"
                    : "fa fa-box bg-danger"
                  : "fa fa-box bg-warning"
              }
              style={{
                padding: 10,
                border: "2px solid",
                borderRadius: "50%",
                color: "#fff",
              }}
            />
            <span className="text">
              {itemChoose.order_status === 4 || itemChoose.order_status === 6
                ? "Đã hủy"
                : itemChoose.order_status === 7 || itemChoose.order_status === 8
                ? "Đã đổi trả"
                : "Đã giao"}
            </span>
          </div>
          <div className="progress_delivery">
            <div
              className="progress_after"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                backgroundColor: `${
                  itemChoose.order_status !== 4 &&
                  itemChoose.order_status !== 6 &&
                  itemChoose.order_status !== 7 &&
                  itemChoose.order_status !== 8
                    ? "rgb(40, 167, 69)"
                    : "#dc3545"
                }`,
                width: `${
                  itemChoose.order_status < 2
                    ? "0%"
                    : itemChoose.order_status < 3
                    ? "31%"
                    : itemChoose.order_status < 4
                    ? "66%"
                    : itemChoose.order_status < 5
                    ? "31%"
                    : itemChoose.order_status < 7
                    ? "100%"
                    : itemChoose.order_status === 8
                    ? "100%"
                    : ""
                }`,
              }}
              width="0% !important"
            />
          </div>
        </div>
        <div
          className="books"
          id="books_detail_show"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {itemChoose.OrderDetails.map((detail, index) => {
            return (
              <div
                key={index}
                className="one_book col-md-4"
                style={{ display: "flex" }}
              >
                <div className="image_book">
                  <img
                    src={detail.Fish.Images[0].url_image}
                    style={{ width: 80, height: 80, padding: 7 }}
                    alt="anh_ca"
                  />
                </div>
                <div
                  className="info_book"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "2px 0px",
                  }}
                >
                  <span>
                    <a
                      href={"/product/" + detail.Fish.fish_id}
                      target="_blank"
                      rel="nofollow noreferrer"
                    >
                      {detail.Fish.fish_name}
                    </a>
                  </span>
                  <span>Loại: {detail.Fish.Category.category_name}</span>
                  <span>
                    {`${Number(detail.price).toLocaleString("vi") + "đ"} x ${
                      detail.amount
                    } x ${detail.Size.size_name}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
