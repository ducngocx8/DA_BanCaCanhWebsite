import React, { Fragment, useEffect } from "react";
import Header from "../Header";
import Carousel from "../Carousel";
import Footer from "../Footer";
import CategoryNewProduct from "../../Product/CategoryNewProduct";
import { Title } from "../../../../Utils/Title";

export default function ProductCategory({ fishList }) {
  useEffect(() => {
    document.title = fishList.category_name + Title.origin;
  }, [fishList.category_name]);
  return (
    <Fragment>
      <Header />
      <Carousel />
      <CategoryNewProduct
        fishList={fishList}
        imageUrl={"/images/top-buy.png"}
        isPagination={true}
      />
      <Footer />
    </Fragment>
  );
}
