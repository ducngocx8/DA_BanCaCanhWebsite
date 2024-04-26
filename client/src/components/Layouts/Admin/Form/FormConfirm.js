import React from "react";
import axios from "axios";
import { ApiLink, notify } from "../../../../Utils/Title";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
export default function FormConfirm({
  content,
  id_handle,
  status,
  closeFormConfirm,
  loadData,
  itemChoose,
}) {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  console.log(id_handle);
  const handleEvent = async () => {
    if (status === "user_cancel_order") {
      const orderStatus = {
        order_id: itemChoose.order_id,
        order_status: 4, // 4: Yêu cầu hủy
      };
      const response = await axios.post(
        `${ApiLink.domain + "/order/user"}`,
        orderStatus,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/account/login", { replace: true });
        }
      }
    } else if (status === "admin_delete_category") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/category/" + id_handle}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "admin_delete_size") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/size/" + id_handle}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "admin_delete_rate") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/rate/" + itemChoose.fish_id}`,
        {
          data: {
            user_id: itemChoose.user_id,
          },
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "admin_delete_role") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/role/" + itemChoose.role_id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "admin_delete_coupon") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/coupon/" + itemChoose.coupon_id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "admin_delete_otp") {
      const response = await axios.delete(`${ApiLink.domain + "/admin/otp"}`, {
        withCredentials: true,
      });
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
        closeFormConfirm();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          window.localStorage.clear();
          return navigate("/", { replace: true });
        } else if (response.data.must === "permission") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "customer_submit_order") {
      const order_user = {
        fullname: itemChoose.fullname,
        address: itemChoose.address,
        phonenumber: itemChoose.phonenumber,
        email: itemChoose.email,
        coupon_code: itemChoose.coupon_code,
        note: itemChoose.note
      };
      const response = await axios.post(
        `${ApiLink.domain + "/cart/addOrder"}`,
        order_user,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        dispatch({
          type: "load_cart",
          value: response.data.data,
        });
        loadData();
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
    } else if (status === "admin_edit_delete_price") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/price/" + id_handle}`,
        {
          data: {
            size_id: itemChoose.size_id,
          },
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
    } else if (status === "admin_edit_delete_image") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/image/" + id_handle}`,
        {
          data: {
            image_id: itemChoose.image_id,
          },
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/account/login", { replace: true });
        }
      }
    } else if (status === "admin_edit_delete_role") {
      const response = await axios.delete(
        `${ApiLink.domain + "/admin/roleuser/" + id_handle}`,
        {
          data: {
            role_id: itemChoose.role_id,
          },
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/", { replace: true });
        }
      }
    } else if (status === "delivery_order_success") {
      const orderStatus = {};
      const response = await axios.post(
        `${ApiLink.domain + "/delivery/orderSuccess/" + itemChoose.order_id}`,
        orderStatus,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        notify(true, response.data.message);
        loadData(response.data.data);
      } else {
        notify(false, response.data.message);
        if (response.data.must === "login") {
          return navigate("/", { replace: true });
        }
      }
    }
  };

  const handleCloseEvent = () => {
    closeFormConfirm();
  };
  return (
    <div className="confirm_container remove_customer_class bg-white">
      <div
        className="confirm_header text-white bg-primary"
        style={{ padding: 10, fontWeight: 700 }}
      >
        <i className="fas fa-check-circle" style={{ color: "#47f764" }} />
        <span style={{ marginLeft: 3 }}>Xác Nhận</span>
      </div>
      <div
        className="confirm_content"
        style={{ padding: 10, textAlign: "center" }}
      >
        {content} <b>{id_handle}</b>
      </div>
      <div className="confirm_buttons">
        <div id="formDelete">
          <input type="hidden" id="inputDelete" name="user_id" />
          <button
            onClick={() => handleEvent()}
            className="btn btn-success me-1 mb-2 btn_xacnhan_xoa"
            style={{ margin: "0px 10px" }}
            type="button"
          >
            Xác Nhận
          </button>
        </div>
        <button
          onClick={() => handleCloseEvent()}
          className="btn btn-danger me-1 mb-2 btn_huy_xoa"
          style={{ margin: "0px 10px" }}
          type="button"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
