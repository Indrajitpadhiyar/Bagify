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

export const createOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return { loading: true };
    case CREATE_ORDER_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case CREATE_ORDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case GET_MY_ORDERS_REQUEST:
    case CANCEL_ORDER_REQUEST:
      return { ...state, loading: true };

    case GET_MY_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };

    case GET_MY_ORDERS_FAIL:
      return { loading: false, error: action.payload };

    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.filter((order) => order._id !== action.payload),
      };

    case CANCEL_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_ERRORS":
      return { ...state, error: null };

    default:
      return state;
  }
};

export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case "ORDER_DETAILS_REQUEST":
      return { ...state, loading: true };

    case "ORDER_DETAILS_SUCCESS":
      return { loading: false, order: action.payload };

    case "ORDER_DETAILS_FAIL":
      return { loading: false, error: action.payload };

    case "CLEAR_ERRORS":
      return { ...state, error: null };

    default:
      return state;
  }
};