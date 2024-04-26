import React from "react";
export default function Footer() {
  return (
    <footer className="flex_center" style={{ backgroundColor: "var(--blue)" }}>
      <div className="_1200px flex" style={{ padding: "30px 0px" }}>
        <div className="footer_left" style={{ flex: 3, color: "#fff" }}>
          <h3 className="pd-10_0">Giới Thiệu</h3>
          <p>
            Đức Ngọc Fish Store là cơ sở chuyên sản xuất và xuất khẩu cá cảnh
            nước ngọt được thành lập vào năm 2023. Đây là địa điểm mua bán cá
            cảnh online uy tín, chất lượng hàng đầu Việt Nam! Chúng tôi luôn
            mang lại các sản phẩm mới ra thị trường.
          </p>
        </div>
        <div
          className="footer_mid"
          style={{ flex: 4, color: "#fff", textAlign: "center" }}
        >
          <h3 className="pd-10_0">Hotline Chăm Sóc Khách Hàng</h3>
          <div>
            <p>
              <a
                href="tel:0378544081"
                style={{
                  textDecoration: "none",
                  color: "#f19f01",
                  fontWeight: 700,
                }}
              >
                0378544081 (Đức Ngọc)
              </a>
            </p>
            <p>Từ thứ Hai đến thứ Bảy (08:00 - 17:00)</p>
            <p>Chủ nhật (08:00 - 12:00)</p>
            <div className="mg-10_0">
              <img
                style={{ height: 30 }}
                src="/images/vietnampost.png"
                alt="vietnampost"
              />
              <img
                style={{ height: 30, marginLeft: 5 }}
                src="/images/viettelpost.png"
                alt="viettelpost"
              />
              <img
                style={{ height: 30, marginLeft: 5 }}
                src="/images/ahamove.png"
                alt="ahamove"
              />
            </div>
          </div>
        </div>
        <div className="footer_right" style={{ flex: 3, color: "#fff" }}>
          <h3 className="pd-10_0">Chi Nhánh Cửa Hàng</h3>
          <div>
            <p>CN1: 97 Đ. Man Thiện, Hiệp Phú TP.HCM</p>
            <p>CN2: 27 Đặng Thùy Trâm - Cầu Giấy</p>
            <p>CN3: 413 Cách mạng tháng 8 - P.13- Q.10</p>
            <p className="mg-10_0">
              <img src="/images/da-thong-bao-bct.png" alt="da-thong-bao-bct" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
