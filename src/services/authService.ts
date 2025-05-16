import axiosInstance from "../utils/axiosConfig";
import { CredentialResponse } from "@react-oauth/google";
export interface LoginPayload {
  username: string;
  password: string;
  isUserLogin?: boolean;
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
    try {
      // Kiểm tra xem token có phải là token admin không
      const token = localStorage.getItem("token");

      if (token && token.startsWith("admin-auth-token-")) {
        // Nếu là token admin, trả về thông tin admin được gán sẵn
        return {
          id: "1",
          email: "admin@example.com",
          fullName: "Admin User",
          phoneNumber: "",
          points: 0,
          account: {
            role: "ADMIN",
          },
        };
      }

      // Nếu không phải token admin, gọi API để lấy thông tin user
      const response = await axiosInstance.get("/getInfoUser");

      // Đảm bảo response.data có định dạng đúng
      return response.data;
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
