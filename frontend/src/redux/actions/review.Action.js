import API from "../../api/axiosClient";
import toast from "react-hot-toast";

export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: "NEW_REVIEW_REQUEST" });

    // DEBUG: Token check karo
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // <-- YE DEKHO CONSOLE MEIN

    if (!token) {
      toast.error("Token not found! Please login again.");
      dispatch({ type: "NEW_REVIEW_FAIL", payload: "No token found" });
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- YE ZAROORI HAI
      },
      withCredentials: true,
    };

    console.log("Sending review with token:", token);
    await API.put("/review", reviewData, config);

    dispatch({ type: "NEW_REVIEW_SUCCESS" });
    toast.success("Review submitted successfully!");
  } catch (error) {
    console.error("Review Error:", error.response?.data);
    const message = error.response?.data?.message || "Failed to submit review";
    toast.error(message);
    dispatch({
      type: "NEW_REVIEW_FAIL",
      payload: message,
    });
  }
};

export const deleteReview = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_REVIEW_REQUEST" });
    await API.delete(`/review?id=${reviewId}&productId=${productId}`);
    dispatch({ type: "DELETE_REVIEW_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "DELETE_REVIEW_FAIL",
      payload: error.response?.data?.message || "Failed to delete review",
    });
  }
};
