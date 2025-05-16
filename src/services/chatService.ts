import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const chatService = {
  async sendMessage(message: string) {
    try {
      const response = await axios.post(`${API_URL}api/chat`, message);
      return {
        response: response.data,
      };
    } catch (error) {
      console.error("Error in chat service:", error);
      throw error;
    }
  },
};
