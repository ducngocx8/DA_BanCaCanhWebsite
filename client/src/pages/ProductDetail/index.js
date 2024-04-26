import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ApiLink } from "../../Utils/Title";
import ProductDetailLayout from "../../components/Layouts/ProductDetail/";
import "../../css/ProductDetail.css";
import { useParams } from "react-router-dom";
import NotFound from "../../components/Layouts/SympleLayout/NotFound";
export default function ProductDetail() {
  const { id } = useParams();
  console.log("ID = ", id);
  let [loading, isLoading] = useState(true);
  let [productDetail, setProductDetail] = useState(false);
  let [uid, setID] = useState(id);

  const setLoading = (fish_id) => {
    if (fish_id !== uid) {
      isLoading(true);
      setID(fish_id);
    } else {
      isLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isInteger(Number(uid))) {
      async function getProductDetail() {
        const response = await axios.get(
          `${ApiLink.domain + "/product/" + uid}`
        );
        setProductDetail(response.data.data);
        isLoading(false);
      }
      getProductDetail();
    }
  }, [uid]);
  return (
    <Fragment>
      {loading ? (
        ""
      ) : productDetail ? (
        <ProductDetailLayout
          fishDetail={productDetail}
          setLoading={setLoading}
        />
      ) : (
        <NotFound />
      )}
    </Fragment>
  );
}
