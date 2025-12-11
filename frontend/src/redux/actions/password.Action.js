import API from "../../api/axiosClient";

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: "FORGOT_PASSWORD_REQUEST" });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await API.post("/password/forgot", { email }, config);

        dispatch({ type: "FORGOT_PASSWORD_SUCCESS", payload: data.message });
    } catch (error) {
        dispatch({
            type: "FORGOT_PASSWORD_FAIL",
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: "RESET_PASSWORD_REQUEST" });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await API.put(
            `/password/reset/${token}`,
            passwords,
            config
        );

        dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: data.success });
    } catch (error) {
        dispatch({
            type: "RESET_PASSWORD_FAIL",
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCT_REQUEST });

    const { data } = await API.get("/admin/products"); // or "/admin/products" – both work now

    dispatch({
      type: ADMIN_PRODUCT_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: error.response?.data?.message || "Failed to load products",
    });
  }
};
// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: "CLEAR_ERRORS" });
};
