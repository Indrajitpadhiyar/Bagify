// src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
  productDetailsReducer,
  productReducer,
} from "./redux/reducer/product.Reducer";
import cartReducer from "./redux/slices/cartSlice";
import { userReducer } from "./redux/reducer/user.Reducer";
import { myOrdersReducer, createOrderReducer } from "./redux/reducer/order.Reducer";
import wishlistReducer from "./redux/slices/wishlistSlice";
import { newReviewReducer } from "./redux/reducer/review.Reducer";
import { createAddProductReducer } from "./redux/reducer/addProduct.Reducer";

const reducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  myOrders: myOrdersReducer,
  createOrder: createOrderReducer,
  newReview: newReviewReducer,
  addProduct: createAddProductReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  wishlist: {
    wishlistItems: localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [],
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
