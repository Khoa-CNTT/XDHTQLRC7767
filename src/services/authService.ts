import axiosInstance from "../utils/axiosConfig";
import { CredentialResponse } from "@react-oauth/google";
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

  loginWithGoogle: async (credentialResponse: CredentialResponse) => {
    const response = await axiosInstance.post("/auth/google", {
      credential: credentialResponse.credential,
    });
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

export default authService;
