import React, { Fragment, useEffect } from "react";
import Header from "../SympleLayout/Header";
import ProductInfo from "../ProductDetail/ProductInfo";
import ProductDescription from "../ProductDetail/ProductDescription";
import ProductRating from "../ProductDetail/ProductRating";
import ProductBestSeller from "../Product/ProductBestSeller";
import Footer from "../SympleLayout/Footer";
import "../../../css/ProductDetail.css";
import ProductSameCategory from "../Product/ProductSameCategory";
import { Title } from "../../../Utils/Title";
export default function ProductDetailLayout({ fishDetail, setLoading }) {
  useEffect(() => {
    document.title = fishDetail.fish_name + Title.origin;
  }, [fishDetail.fish_name]);
  return (
    <Fragment>
      <Header />
      <ProductInfo fishDetail={fishDetail} />
      <ProductDescription fish_description={fishDetail.fish_description} />
      <ProductSameCategory
        category_id={fishDetail.category_id}
        menuName="Cá cảnh cùng danh mục"
        imageUrl={"/images/newfish.png"}
        isPagination={false}
        setLoading={setLoading}
      />
      <ProductRating fish_id={fishDetail.fish_id} />
      <ProductBestSeller
        menuName="Cá cảnh bán chạy nhất"
        imageUrl={"/images/bestseller.png"}
        setLoading={setLoading}
      />
      <Footer />
    </Fragment>
  );
}
