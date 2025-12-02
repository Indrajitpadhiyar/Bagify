
import API from "../../api/axiosClient";
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constans/product.Constans";

export const getProduct = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });

    let link = `/products`;

    const { data } = await API.get(link);

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.group("API Error: getProduct()");
    console.error("Message:", error.message);
    console.error("Response:", error.response?.data);
    console.groupEnd();

    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload:
        error.response?.data?.message ||
        "Something went wrong while fetching products.",
    });
  }
};

//
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await API.get(`/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response?.data?.message ||
        "Something went wrong while fetching products.",
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
