import React, { Fragment, useEffect } from 'react'
import Header from "../../components/Layouts/SympleLayout/Header"
import Carousel from "../../components/Layouts/SympleLayout/Carousel";
import ProductBestSeller from "../../components/Layouts/Product/ProductBestSeller";
import ProductNewProduct from "../../components/Layouts/Product/ProductNewProduct";
import ProductRecomment from "../../components/Layouts/Product/ProductRecomment";
import Footer from "../../components/Layouts/SympleLayout/Footer";
export default function Home() {
   useEffect(() => {
     document.title = "Trang chủ - Kinh Doanh Cá Cảnh";
   }, []);

   const setLoading = () => {}
   return (
     <Fragment>
       <Header />
       <Carousel />
       <ProductBestSeller
         menuName="Sản phẩm bán chạy nhất"
         imageUrl={"/images/bestseller.png"}
         setLoading={setLoading}
       />

       <ProductNewProduct
         menuName="Sản phẩm mới nhất"
         imageUrl={"/images/newfish.png"}
         isPagination={true}
         setLoading={setLoading}
       />

       <ProductRecomment
         menuName="Sản phẩm gợi ý"
         imageUrl={"/images/newfish.png"}
         isPagination={false}
         setLoading={setLoading}
       />

       <Footer />
     </Fragment>
   );
}
