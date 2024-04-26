import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";

export default function FormAddProduct({ status, closeFormAdd, loadData }) {
  let [sizeList, setSizeList] = useState([]);
  let [CategoryList, setCategoryList] = useState([]);
  let navigate = useNavigate();
  let [itemState, setItemState] = useState({
    url_image: "",
    price: "",
    fish_remain: "",
    size: {
      size_id: -1,
      size_name: "",
    },
  });
  let [productState, setProductState] = useState({
    fish_name: "",
    fish_description: "",
    fish_status: true,
    ph: "",
    temperature: "",
    food: "",
    behavior: "",
    origin: "",
    category_id: -1,
  });
  let [FishPrices, setFishPrices] = useState([]);
  let [imageList, setImageList] = useState([]);
  let [addPriceStatus, setAddPriceStatus] = useState(true);
  useEffect(() => {
    async function getAllSize() {
      const response = await axios.get(`${ApiLink.domain + "/admin/size"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        setSizeList(response.data.data); // status, data
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        } else if (response.data.must === "permission") {
          return;
        }
      }
    }
    getAllSize();

    async function getAllCategory() {
      const response = await axios.get(
        `${ApiLink.domain + "/admin/category"}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        setCategoryList(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        } else if (response.data.must === "permission") {
          return;
        }
      }
    }
    getAllCategory();
  }, [navigate]);

  console.log(itemState);

  const handleOnChange = (e) => {
    let { name, value } = e.target;
    if (name === "size") {
      const size_find = sizeList.find(
        (item) => Number(item.size_id) === Number(value)
      );
      if (size_find) {
        value = size_find;
      } else {
        notify(false, "Không tìm thấy thông tin Size");
      }
    }
    setItemState({ ...itemState, [name]: value });
  };

  function checkURL(url) {
    return url.match(/\.(jpeg|jpg|png)$/) != null;
  }

  const handleAddImage = () => {
    const url_image = itemState.url_image.trim();
    if (url_image === "" || !checkURL(url_image)) {
      notify(
        false,
        "Bạn chưa nhập hình ảnh hoặc hình ảnh không hợp lệ (jpeg, jpg, png)"
      );
    } else {
      const newImage = {
        id: Date.now(),
        url_image: url_image,
      };
      setImageList([...imageList, newImage]);
    }
  };

  const handleChangeStatusPrice = (item) => {
    setItemState({
      ...itemState,
      fish_remain: item.fish_remain,
      size: { size_name: item.size_name, size_id: item.size_id },
      price: item.price,
    });
    setAddPriceStatus(!addPriceStatus);
  };

  const addPrice = (newPrice) => {
    setItemState({
      ...itemState,
      fish_remain: "",
      size: { size_id: -1, size_name: "" },
      price: "",
    });
    setFishPrices([...FishPrices, newPrice]);
    notify(true, "Thêm Size cho sản phẩm thành công");
  };

  const handleAddEditPrice = () => {
    const price = itemState.price;
    const fish_remain = itemState.fish_remain;
    const size = itemState.size;
    if (!size || Number(size.size_id === -1)) {
      notify(false, "Vui lòng chọn Size");
      return;
    } else if (
      price === "" ||
      !Number.isInteger(Number(price)) ||
      Number(price) < 0
    ) {
      notify(false, "Vui lòng nhập giá, giá là số nguyên >= 0");
      return;
    } else if (
      fish_remain === "" ||
      !Number.isInteger(Number(fish_remain)) ||
      Number(fish_remain) < 0
    ) {
      notify(
        false,
        "Vui lòng nhập số lượng tồn kho, tồn kho là số nguyên >= 0"
      );
      return;
    }
    const size_find = FishPrices.findIndex(
      (item) => Number(item.size_id) === Number(size.size_id)
    );
    if (addPriceStatus) {
      if (size_find !== -1) {
        notify(false, "Sản phẩm đã tồn tại Size này.");
      } else {
        const newPrice = {
          price: Number(price),
          fish_remain: Number(fish_remain),
          size_id: size.size_id,
          size_name: size.size_name,
        };
        addPrice(newPrice);
      }
    } else {
      if (size_find === -1) {
        notify(false, "Sản phẩm không tồn tại Size này.");
        setAddPriceStatus(true);
      } else {
        editPrice(size_find, size, fish_remain, price);
      }
    }
  };

  const editPrice = (index, size, fish_remain, price) => {
    FishPrices[index].size_id = size.size_id;
    FishPrices[index].size_name = size.size_name;
    FishPrices[index].fish_remain = Number(fish_remain);
    FishPrices[index].price = Number(price);
    setItemState({
      ...itemState,
      fish_remain: "",
      size: { size_id: -1, size_name: "" },
      price: "",
    });
    setFishPrices([...FishPrices]);
    setAddPriceStatus(true);
    notify(true, "Cập nhật Size cho sản phẩm thành công");
  };

  const handleRemovePrice = (size_id) => {
    const size_find = FishPrices.findIndex(
      (item) => Number(item.size_id) === Number(size_id)
    );
    if (size_find === -1) {
      notify(false, "Sản phẩm không tồn tại Size này.");
    } else {
      FishPrices.splice(size_find, 1);
      console.log(FishPrices);
      setFishPrices([...FishPrices]);
      setAddPriceStatus(true);
      notify(true, "Xóa Size cho sản phẩm thành công");
    }
  };

  const handleRemoveImage = (image_id) => {
    console.log(image_id);
    const image_index = imageList.findIndex(
      (item) => Number(item.id) === Number(image_id)
    );
    if (image_index === -1) {
      notify(false, "Sản phẩm không tồn tại hình ảnh này.");
    } else {
      imageList.splice(image_index, 1);
      setImageList([...imageList]);
    }
  };

  const handleChangeProductValue = (e) => {
    let { name, value } = e.target;
    if (name === "category_id") {
      value = Number(value);
    }
    setProductState({ ...productState, [name]: value });
  };

  const addProduct = async (newProduct) => {
    const response = await axios.post(
      `${ApiLink.domain + "/admin/product"}`,
      newProduct,
      {
        withCredentials: true,
      }
    );
    if (response.data.status) {
      notify(true, response.data.message);
      loadData(response.data.data);
      closeFormAdd();
    } else {
      notify(false, response.data.message);
      if (response.data.must === "login") {
        return navigate("/account/login", { replace: true });
      } else if (response.data.must === "permission") {
        return;
      }
    }
  };

  const handleAddProduct = async () => {
    if (productState.fish_name.trim() === "") {
      notify(false, "Vui lòng điền tên sản phẩm");
      return;
    } else if (productState.category_id === "") {
      notify(false, "Vui lòng chọn danh mục sản phẩm");
      return;
    } else if (productState.fish_status === "") {
      notify(false, "Vui lòng chọn trạng thái sản phẩm");
      return;
    } else if (productState.category_id === -1) {
      notify(false, "Vui lòng chọn danh mục sản phẩm");
      return;
    } else if (imageList.length === 0) {
      notify(false, "Vui lòng thêm ít nhất 1 hình ảnh");
      return;
    } else if (FishPrices.length === 0) {
      notify(false, "Vui lòng thêm ít nhất 1 size");
      return;
    }
    const newProduct = {
      fish_name: productState.fish_name.trim(),
      fish_description: productState.fish_description.trim(),
      fish_status: productState.fish_status,
      ph: productState.ph.trim(),
      temperature: productState.temperature.trim(),
      food: productState.food.trim(),
      behavior: productState.behavior.trim(),
      origin: productState.origin.trim(),
      category_id: productState.category_id,
      imageList: imageList,
      FishPrices: FishPrices,
    };
    console.log(newProduct);
    await addProduct(newProduct);
  };
  return (
    <div
      className="row col-9 add_edit_class sroll_form"
      style={{
        display: "block",
        backgroundColor: "rgb(242, 247, 255)",
        borderRadius: "3px 3px 0px 0px",
        boxShadow:
          "rgb(98, 176, 253) 0px 4px 8px, rgba(0, 0, 0, 0.08) 0px 4px 12px",
        padding: "0px !important",
        margin: 0,
      }}
    >
      <div
        className="bg-primary row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
          margin: 0,
        }}
      >
        <div className="text-white add_book_class_header">
          Thêm Sản Phẩm Mới
        </div>
        <i
          onClick={() => closeFormAdd()}
          className="far fa-times-circle btn_close_form"
          style={{ color: "white", fontSize: 25 }}
        />
      </div>

      <div
        className="row col-12"
        style={{
          padding: "0px !important",
          display: "flex",
          flexDirection: "row",
          margin: 0,
        }}
      >
        <div className="row col-8">
          <div
            className="row col-12"
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
              display: "flex",
            }}
          >
            <div className="col-6">
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Tên Sản Phẩm</label>
                <input
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-control showordisable"
                  name="fish_name"
                  type="text"
                  defaultValue={productState.fish_name}
                  placeholder="VD: Cá Betta Halfmoon"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Danh mục</label>
                <select
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-select"
                  name="category_id"
                  defaultValue={productState.category_id}
                  aria-label="Default select example"
                >
                  <option value={-1}>Vui lòng chọn danh mục</option>
                  {CategoryList.map((category, index) => {
                    return (
                      <option key={index} value={Number(category.category_id)}>
                        {category.category_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Độ pH</label>
                <input
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-control"
                  name="ph"
                  type="text"
                  defaultValue={productState.ph}
                  placeholder="VD: Từ 7 - 10"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Thức Ăn Chính</label>
                <textarea
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-control"
                  name="food"
                  type="text"
                  rows="2"
                  defaultValue={productState.food}
                  placeholder="VD: Cám, trùn chỉ"
                />
              </div>
            </div>
            <div className="col-6">
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Trạng thái</label>
                <select
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-select"
                  name="fish_status"
                  defaultValue={productState.fish_status}
                  aria-label="Default select example"
                >
                  <option value={true}>Kinh doanh</option>
                  <option value={false}>Ngừng kinh doanh</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Nhiệt Độ</label>
                <input
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-control"
                  name="temperature"
                  defaultValue={productState.temperature}
                  placeholder="VD: Từ 28 - 30"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Nguồn gốc</label>
                <input
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-control"
                  name="origin"
                  defaultValue={productState.origin}
                  type="text"
                  placeholder="VD: Việt Nam"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Tập Tính</label>
                <textarea
                  onChange={(e) => handleChangeProductValue(e)}
                  className="form-control showordisable"
                  name="behavior"
                  type="text"
                  defaultValue={productState.behavior}
                  rows={2}
                  placeholder="VD: Sống theo bầy đàn"
                />
              </div>
            </div>
            <div
              className="row col-12"
              style={{
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 20,
              }}
            >
              <label className="form-label">Mô tả</label>
              <textarea
                onChange={(e) => handleChangeProductValue(e)}
                className="form-control"
                name="fish_description"
                defaultValue={productState.fish_description}
                type="text"
                rows="2"
                placeholder="VD: Cá rất đẹp, nhiều màu sắc, dễ lựa chọn"
              />
            </div>
          </div>
        </div>
        <div className="row col-4" style={{ padding: 20, display: "flex" }}>
          <div
            className="row"
            style={{
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">- Hình Ảnh Sản Phẩm</label>
              <div className="image_group">
                {imageList.map((image, index) => {
                  return (
                    <span key={index} className="one_image">
                      <img src={image.url_image} alt="anh" />
                      <p
                        onClick={() => handleRemoveImage(image.id)}
                        className="remove_image"
                      >
                        X
                      </p>
                    </span>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  onChange={(e) => handleOnChange(e)}
                  className="form-control showordisable noborderRadius"
                  name="url_image"
                  type="text"
                  placeholder="Đường dẫn hình ảnh"
                />
                <button
                  onClick={() => handleAddImage()}
                  style={{
                    padding: "0.45rem 0.75rem",
                  }}
                  className="btn btn-success noborderRadius"
                >
                  Thêm
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label"> - Quản Lý Giá Sản Phẩm</label>
              <div className="size_group">
                {FishPrices.map((item, index) => {
                  return (
                    <span key={index} className="one_size">
                      <div onClick={() => handleChangeStatusPrice(item)}>
                        {item.size_name} :{" "}
                        {Number(item.price).toLocaleString("vi")}đ :{" "}
                        {item.fish_remain}{" "}
                      </div>

                      <p
                        onClick={() => handleRemovePrice(item.size_id)}
                        className="remove_size"
                      >
                        X
                      </p>
                    </span>
                  );
                })}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ flex: 3 }} className="form-label">
                    Chọn Size:
                  </div>
                  <select
                    disabled={addPriceStatus ? false : true}
                    onChange={(e) => handleOnChange(e)}
                    style={{ flex: 7, marginLeft: 6 }}
                    className="form-select"
                    name="size"
                    value={itemState.size.size_id}
                    aria-label="Default select example"
                  >
                    <option value={-1}>Vui lòng chọn Size</option>
                    {sizeList.map((size, index) => {
                      return (
                        <option key={index} value={size.size_id}>
                          {size.size_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ flex: 3 }} className="form-label">
                    Nhập Giá:
                  </div>
                  <input
                    onChange={(e) => handleOnChange(e)}
                    style={{ flex: 7 }}
                    className="form-control"
                    name="price"
                    type="number"
                    value={itemState.price}
                    placeholder="VD: 200.000đ"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ flex: 3 }} className="form-label">
                    Tồn kho:
                  </div>
                  <input
                    onChange={(e) => handleOnChange(e)}
                    style={{ flex: 7 }}
                    className="form-control"
                    name="fish_remain"
                    value={itemState.fish_remain}
                    type="number"
                    placeholder="VD: 1000"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={() => handleAddEditPrice()}
                    style={{
                      padding: "0.45rem 0.75rem",
                    }}
                    className="btn btn-success noborderRadius"
                  >
                    {addPriceStatus ? "Thêm" : "Lưu"}
                  </button>
                </div>

                {/* <div style={{ marginTop: 20 }}>
                  <span style={{ color: "red" }}>Ghi chú:</span>
                  <li>Nếu chưa thêm Size, sẽ thêm Size mới</li>
                  <li>Nếu Size đã tồn tại sẽ cập nhật giá mới</li>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}
      >
        <button
          onClick={() => handleAddProduct()}
          className="btn btn-success btn_add_edit_customer_submit"
        >
          Xác Nhận
        </button>
      </div>
    </div>
  );
}
