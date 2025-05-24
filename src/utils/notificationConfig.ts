import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationConfig {
  message: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}

const defaultConfig: Partial<NotificationConfig> = {
  placement: "topRight",
  duration: 3,
};

export const showNotification = (
  type: NotificationType,
  config: NotificationConfig
) => {
  notification[type]({
    ...defaultConfig,
    ...config, 
  });
};

export const notificationUtils = {
  success: (config: NotificationConfig) => showNotification("success", config),
  error: (config: NotificationConfig) => showNotification("error", config),
  info: (config: NotificationConfig) => showNotification("info", config),
  warning: (config: NotificationConfig) => showNotification("warning", config),

  // Các hàm tiện ích phổ biến
  successMessage: (message: string, description?: string) =>
    showNotification("success", { message, description }),

  errorMessage: (message: string, description?: string) =>
    showNotification("error", { message, description }),

  warningMessage: (message: string, description?: string) =>
    showNotification("warning", { message, description }),

  infoMessage: (message: string, description?: string) =>
    showNotification("info", { message, description }),

  registerSuccess: () =>
    showNotification("success", {
      message: "Đăng ký thành công",
      description: "Vui lòng kiểm tra email để xác thực tài khoản.",
    }),

  registerError: (description: string = "Đăng ký thất bại") =>
    showNotification("error", {
      message: "Đăng ký thất bại",
      description,
    }),

  updateProfileSuccess: () =>
    showNotification("success", {
      message: "Cập nhật thành công",
      description: "Thông tin của bạn đã được cập nhật",
    }),

  updateProfileError: (description: string = "Cập nhật thông tin thất bại") =>
    showNotification("error", {
      message: "Lỗi cập nhật",
      description,
    }),
};
