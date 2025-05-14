import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

// Cấu hình axios instance với timeout dài hơn
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 30000, // Tăng timeout lên 30 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm log cho các request và response
const enableDebugLogs = true;

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (enableDebugLogs) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
          headers: {
            ...config.headers,
            Authorization: config.headers.Authorization
              ? "Bearer [TOKEN]"
              : undefined,
          },
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (enableDebugLogs) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        {
          status: response.status,
          statusText: response.statusText,
          // Limiting data size in logs to avoid huge outputs
          data: response.data ? "[DATA]" : null,
        }
      );
    }
    return response;
  },
  (error) => {
    console.error("[API Response Error]", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      localStorage.removeItem("token");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
