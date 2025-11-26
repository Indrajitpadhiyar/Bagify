import API from "../../api/axiosClient";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_LOAD_REQUEST,
  USER_LOAD_SUCCESS,
  USER_LOAD_FAIL,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
  CLEAR_ERRORS,
} from "../constans/user.Constans";

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LOAD_REQUEST });

    const { data } = await API.get("/me", {
      headers: getAuthHeader(),
      withCredentials: true,
    });

    dispatch({ type: USER_LOAD_SUCCESS, payload: data.user });
  } catch (error) {
    localStorage.removeItem("token");
    dispatch({
      type: USER_LOAD_FAIL,
      payload: error.response?.data?.message || "Failed to load user",
    });
  }
};

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const { data } = await API.post(
      "/login",
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    localStorage.setItem("token", data.token);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.message || "Login failed",
    });
  }
};

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const { data } = await API.post("/register", userData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    localStorage.setItem("token", data.token);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response?.data?.message || "Registration failed",
    });
  }
};

// Update Profile (Frontend Action)
export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const { data } = await axios.put("/api/v1/me/update", userData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      withCredentials: true,
    });

    dispatch({ type: USER_UPDATE_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.message || "Update failed",
    });
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    await API.get("/logout", { withCredentials: true });
    dispatch({ type: USER_LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_LOGOUT_FAIL,
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
