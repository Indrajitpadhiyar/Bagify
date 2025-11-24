import axios from "axios";
import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  ADD_PRODUCT_RESET,
} from "../constans/addProduct.Constans";

export const addProduct = (formData, token) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PRODUCT_REQUEST });

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `${token}`,
      },
    };
    console.log("Config headers:", config.headers);

    const { data } = await axios.post(
      "/api/v1/products/create",
      formData,
      config
    );
    console.log("Product added successfully:", data);

    dispatch({
      type: ADD_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const addProductReset = () => (dispatch) => {
  dispatch({ type: ADD_PRODUCT_RESET });
};
