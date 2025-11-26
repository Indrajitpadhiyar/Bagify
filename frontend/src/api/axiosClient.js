import axios from "axios";

// Auto detect backend URL based on environment
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://bagifybackend-6sn1.onrender.com/api/v1";

// Create axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add token automatically for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
