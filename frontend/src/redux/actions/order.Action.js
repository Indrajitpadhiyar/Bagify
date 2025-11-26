import axios from "axios";
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  GET_MY_ORDERS_REQUEST,
  GET_MY_ORDERS_SUCCESS,
  GET_MY_ORDERS_FAIL,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER_FAIL,
} from "../constans/order.Constants";

const API = axios.create({
  baseURL: [
    "http://localhost:4000",
    "https://bagify-48n8.onrender.com",
  ].includes(window.location.origin)
    ? window.location.origin
    : "https://bagifybackend-g2ty.onrender.com",
  withCredentials: true,
});

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
    const { data } = await API.post("/api/v1/order/new", order);
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MY_ORDERS_REQUEST });
    const { data } = await API.get("/api/v1/orders/me");
    dispatch({ type: GET_MY_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: GET_MY_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: CANCEL_ORDER_REQUEST });
    await API.delete(`/api/v1/order/cancel/${orderId}`);
    dispatch({ type: CANCEL_ORDER_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: CANCEL_ORDER_FAIL,
      payload: error.response?.data?.message || "Failed to cancel order",
    });
  }
};
