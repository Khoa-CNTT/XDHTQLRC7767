import { useState } from "react";
import { chatService } from "../services/chatService";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to the list
    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(message);

      // Add assistant response to the list
      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage =
        "Sorry, I encountered an error. Please try again later.";
      setError(errorMessage);

      // Add error message as assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: errorMessage,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      return assistantMessage;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
