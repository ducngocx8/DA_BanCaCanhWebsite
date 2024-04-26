import React from "react";
import "../../../../css/Invoice.css";
import { convertToDateOnly } from "../../../../Utils/Title";
const InvoiceLayout = React.forwardRef(({ itemChoose }, ref) => {
  const sumMoney = () => {
    let sum = 0;
    itemChoose.OrderDetails.forEach((item) => {
      sum += item.amount * item.price;
    });
    return sum;
  };

  const renderAddress = () => {
    const addressArray = itemChoose.address.split(",");
    return {
      data: addressArray,
      length: addressArray.length,
    };
  };

  return (
    <div ref={ref} className="my-5 page_invoice A4">
      <div className="p-5">
        <section className="top-content_invoice bb_invoice d-flex justify-content-between">
          <div className="logo_invoice">
            <img src="/logo.png" className="img-fluid" alt="logo" />
          </div>
          <div className="top-left_invoice">
            <div className="graphic-path">
              <p>HÓA ĐƠN</p>
            </div>
            <div className="position-relative">
              <p>
                Invoice No. <span>{itemChoose.order_id}</span>
              </p>
            </div>
          </div>
        </section>
        <section className="store-user mt-5">
          <div className="col-10">
            <div className="row bb_invoice pb-3">
              <div className="col-7">
                <p>Nhà cung cấp,</p>
                <h2>Ngọc Fish Store</h2>
                <p className="address">
                  {" "}
                  97 Đường Man Thiện, <br /> Phường Hiệp Phú, <br />
                  Thành Phố Hồ Chí Minh
                </p>
                <div className="txn mt-2">Phone: 0378544081</div>
              </div>
              <div className="col-5">
                <p>Khách hàng,</p>
                <h2>{itemChoose.fullname}</h2>
                <p className="address">
                  {" "}
                  {renderAddress().data.map((item, index) => {
                    if (index !== renderAddress().length - 1) {
                      return (
                        <span key={index}>
                          {item},
                          <br />
                        </span>
                      );
                    } else {
                      return (
                        <span key={index}>
                          {item}
                          <br />
                        </span>
                      );
                    }
                  })}
                </p>
                <div className="txn mt-2">Phone: 0372884622</div>
                <div style={{ marginTop: 10 }}>
                  <span>Trạng thái: </span>
                  {Number(itemChoose.order_status) === 1
                    ? "Chờ xác nhận"
                    : Number(itemChoose.order_status) === 2
                    ? "Đã xác nhận"
                    : Number(itemChoose.order_status) === 3
                    ? "Đang vận chuyển"
                    : Number(itemChoose.order_status) === 4
                    ? "Đã yêu cầu hủy"
                    : Number(itemChoose.order_status) === 5
                    ? "Giao hàng thành công"
                    : Number(itemChoose.order_status) === 6
                    ? "Đã hủy đơn hàng"
                    : Number(itemChoose.order_status) === 7
                    ? "Đã yêu cầu trả hàng"
                    : Number(itemChoose.order_status) === 8
                    ? "Trả hàng thành công"
                    : ""}
                </div>
              </div>
            </div>
            <div className="row extra-info pt-3">
              <div className="col-7">
                <p>
                  Phương thức thanh toán: <span>Tiền mặt</span>
                </p>
                <p>
                  Mã đơn hàng: <span>#{itemChoose.order_id}</span>
                </p>
              </div>
              <div className="col-5">
                <p>
                  Ngày đặt hàng:{" "}
                  <span>{convertToDateOnly(itemChoose.order_time)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="product-area mt-4">
          <table className="table table_invoice table-hover">
            <thead
              className="thead_invoice"
              style={{ backgroundColor: "#22b8d1 !important" }}
            >
              <tr className="tr_invoice" style={{ color: "black" }}>
                <td>Danh sách sản phẩm</td>
                <td>Giá</td>
                <td>Số lượng</td>
                <td>Tổng tiền</td>
              </tr>
            </thead>
            <tbody>
              {itemChoose.OrderDetails.map((detail, index) => {
                return (
                  <tr key={index} className="tr_invoice">
                    <td>
                      <div className="media">
                        <img
                          className="mr-3 img-fluid"
                          src={detail.Fish.Images[0].url_image}
                          alt="Product 01"
                        />
                        <div className="media-body">
                          <p className="mt-0 title">{detail.Fish.fish_name}</p>
                          Loại {detail.Fish.Category.category_name}, Size:{" "}
                          {detail.Size.size_name}.
                        </div>
                      </div>
                    </td>
                    <td>{Number(detail.price).toLocaleString("vi") + "đ"}</td>
                    <td>{detail.amount}</td>
                    <td>
                      {(Number(detail.price) * detail.amount).toLocaleString(
                        "vi"
                      ) + "đ"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
        <section className="balance-info">
          <div className="row">
            <div className="col-8">
              <p className="m-0 font-weight-bold"> Ghi chú: </p>
              <p>{itemChoose.note}</p>
            </div>
            <div className="col-4">
              <table className="table border-0 table-hover invoice">
                <tbody>
                  <tr className="tr_invoice">
                    <td>Tổng cộng:</td>
                    <td>{Number(sumMoney()).toLocaleString("vi")}đ</td>
                  </tr>
                  <tr className="tr_invoice">
                    <td>Giảm giá:</td>
                    <td>
                      {Number(itemChoose.save_money).toLocaleString("vi")}đ
                    </td>
                  </tr>
                  <tr className="tr_invoice">
                    <td>Phí vận chuyển:</td>
                    <td>0đ</td>
                  </tr>
                </tbody>
                <tfoot className="t_foot">
                  <tr className="tr_invoice">
                    <td>Thành tiền:</td>
                    <td>
                      {(
                        Number(sumMoney()) - Number(itemChoose.save_money)
                      ).toLocaleString("vi")}
                      đ
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="col-12">
                <img
                  src="/images/signature.png"
                  className="img-fluid"
                  alt="sign"
                />
                <p className="text-center m-0"> Chữ ký chủ shop </p>
              </div>
            </div>
          </div>
        </section>
        <footer className="invoice">
          <hr />
          <p className="m-0 text-center">
            Xem chi tiết đơn hàng{" "}
            <a href="/account/order">tại trang đặt hàng </a>
          </p>
          <div className="social pt-3">
            <span className="pr-2">
              <i className="fas fa-mobile-alt" />
              <span style={{ margin: 4 }}>0378544081</span>
            </span>
            <span className="pr-2">
              <i className="fas fa-envelope" />
              <span style={{ margin: 4 }}>dungoc233@gmail.com</span>
            </span>
            <span className="pr-2">
              <i className="fab fa-youtube" />
              <span style={{ margin: 4 }}>kiemthecao</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
});

export default InvoiceLayout;
