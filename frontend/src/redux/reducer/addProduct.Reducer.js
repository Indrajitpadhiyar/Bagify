import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  ADD_PRODUCT_RESET,
} from "../constans/addProduct.Constans";

const initialState = {
  loading: false,
  success: false,
  product: null,
  error: null,
};

export const createAddProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        product: action.payload,
        error: null,
      };

    case ADD_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        product: null,
        error: action.payload,
      };

    case ADD_PRODUCT_RESET:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
