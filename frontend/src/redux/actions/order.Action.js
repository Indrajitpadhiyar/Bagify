import API from "../../api/axiosClient";
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
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
} from "../constans/order.Constants";


export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
    const { data } = await API.post("/order/new", order);
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
    const { data } = await API.get("/orders/me");
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
    await API.delete(`/order/cancel/${orderId}`);
    dispatch({ type: CANCEL_ORDER_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: CANCEL_ORDER_FAIL,
      payload: error.response?.data?.message || "Failed to cancel order",
    });
  }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: "ORDER_DETAILS_REQUEST" });
    const { data } = await API.get(`/order/${orderId}`);
    dispatch({ type: "ORDER_DETAILS_SUCCESS", payload: data.order });
  } catch (error) {
    dispatch({
      type: "ORDER_DETAILS_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_ORDERS_REQUEST });
    const { data } = await API.get("/admin/orders");
    dispatch({ type: GET_ALL_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ALL_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });
    const { data } = await API.put(`/admin/order/${id}`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "CLEAR_ERRORS" });
};
