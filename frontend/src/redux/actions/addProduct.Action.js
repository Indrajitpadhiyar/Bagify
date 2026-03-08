import API from "../../api/axiosClient";
import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  ADD_PRODUCT_RESET,
} from "../constans/addProduct.Constans";

export const addProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PRODUCT_REQUEST });

    const token = localStorage.getItem("token");
    if (!token) {
      const message = "Please login to add a product";
      console.error("Add product failed - no token:", message);
      dispatch({ type: ADD_PRODUCT_FAIL, payload: message });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };

    console.log("Add Product: sending request with token", token);

    // Do not set Content-Type manually — let the browser set multipart boundary
    const { data } = await API.post("/products/create", formData, config);
    console.log("Product added successfully:", data);

    dispatch({
      type: ADD_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Add product error:", error.response?.data || error.message);
    dispatch({
      type: ADD_PRODUCT_FAIL,
      payload: error.response?.data?.message || "Server Error",
    });
  }
};

export const addProductReset = () => (dispatch) => {
  dispatch({ type: ADD_PRODUCT_RESET });
};
