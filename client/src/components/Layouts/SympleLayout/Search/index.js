import React, { Fragment, useEffect } from "react";
import SearchProduct from "../../Product/SearchProduct";
import Header from "../Header";
import Carousel from "../Carousel";
import Footer from "../Footer";
import { Title } from "../../../../Utils/Title";

export default function SearchLayout({ fishList, keyword }) {
  useEffect(() => {
    document.title = Title.search + keyword.trim() + Title.origin;
  }, [keyword]);
  return (
    <Fragment>
      <Header />
      <Carousel />
      <SearchProduct
        fishList={fishList}
        imageUrl={"/images/top-buy.png"}
        isPagination={true}
        keyword={keyword}
      />
      <Footer />
    </Fragment>
  );
}
