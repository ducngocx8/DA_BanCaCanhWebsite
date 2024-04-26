import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchLayout from "../../components/Layouts/SympleLayout/Search";
import axios from "axios";
import { ApiLink } from "../../Utils/Title";

export default function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword").toLowerCase().trim();
  console.log("Search: " + keyword);
  let [productList, setProductList] = useState([]);

  useEffect(() => {
    async function searchProduct() {
      const keyword_ob = {
        keyword: keyword,
      };
      const response = await axios.post(
        `${ApiLink.domain + "/product/top/search"}`,
        keyword_ob,
        {
          withCredentials: true,
        }
      );
      setProductList(response.data.data);
    }
    searchProduct();
  }, [keyword]);
  return <SearchLayout fishList={productList} keyword = {keyword} />;
}
