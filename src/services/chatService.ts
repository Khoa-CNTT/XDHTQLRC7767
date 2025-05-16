import axiosInstance from "../utils/axiosConfig";

export const chatService = {
  async sendMessage(message: string) {
    try {
      const response = await axiosInstance.post("/api/chat", message, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      return {
        response: response.data,
      };
    } catch (error) {
      console.error("Error in chat service:", error);
      throw error;
    }
  },
};
