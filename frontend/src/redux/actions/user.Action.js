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
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAIL,
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
    // Don't remove token on load fail, just show error
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

    // Let axios/browser set Content-Type (includes multipart boundary)
    const { data } = await API.post("/register", userData, {
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

// Update Profile (Fixed Version with Debug Logging)
export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    // Debug: Log what we're sending
    console.log("🔍 updateUser called with FormData");
    for (let pair of userData.entries()) {
      console.log(`  ${pair[0]}:`, pair[1]);
    }

    const { data } = await API.put("/me/update", userData, {
      withCredentials: true,
      // DO NOT set Content-Type header → let browser set boundary
    });

    console.log("✅ Update response:", data);

    // Save new token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    dispatch({ type: USER_UPDATE_SUCCESS, payload: data.user });
    return data;
  } catch (error) {
    console.error("❌ Update error:", error.response?.data || error.message);
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: error.response?.data?.message || "Update failed",
    });
    throw error;
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    await API.get("/logout", { withCredentials: true });
    localStorage.removeItem("token");
    dispatch({ type: USER_LOGOUT_SUCCESS });
  } catch (error) {
    // Still logout even if API call fails
    localStorage.removeItem("token");
    dispatch({
      type: USER_LOGOUT_FAIL,
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};

// Get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    const { data } = await API.get("/admin/users");

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update User Role
export const updateUserRole = (id, role) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_ROLE_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await API.put(
      `/admin/user/${id}`,
      { role },
      config
    );

    dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_ROLE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete User
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const { data } = await API.delete(`/admin/user/${id}`);

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
