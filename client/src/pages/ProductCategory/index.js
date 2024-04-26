import React, { Fragment, useEffect, useState } from "react";
import ProductCategoryLayout from "../../components/Layouts/SympleLayout/ProductCategory";
import NotFound from "../../components/Layouts/SympleLayout/NotFound";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ApiLink } from "../../Utils/Title";

export default function ProductCategory() {
  const { id } = useParams();
  let [loading, isLoading] = useState(true);
  let [productListCategory, setproductListCategory] = useState(false);
  let [uid, setID] = useState(id);

  useEffect(() => {
    setID(uid);
  }, [uid]);
  
  useEffect(() => {
    if (Number.isInteger(Number(id))) {
      async function getProductCategory() {
        const response = await axios.get(
          `${ApiLink.domain + "/category/" + id}`
        );
        setproductListCategory(response.data.data);
        isLoading(false);
      }
      getProductCategory();
    }
  }, [id]);
  return (
    <Fragment>
      {loading ? (
        ""
      ) : productListCategory ? (
        <ProductCategoryLayout fishList={productListCategory} />
      ) : (
        <NotFound />
      )}
    </Fragment>
  );
}
