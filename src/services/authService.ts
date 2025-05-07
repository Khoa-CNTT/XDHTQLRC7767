import axiosInstance from "../utils/axiosConfig";
import axios from "axios";

export interface LoginPayload {
  username: string;
  password: string;
}

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await axiosInstance.post("/authenticate", data);
    if (response.data) {
      localStorage.setItem("token", response.data);
    }
    return response.data;
  },

  getInfoUser: async () => {
    const response = await axiosInstance.get("/getInfoUser");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

// Create axios instance with token
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default authService;
