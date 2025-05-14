import axiosInstance from "./axiosConfig";

/**
 * Service xử lý các yêu cầu thanh toán VNPay
 */
class VNPayService {
  /**
   * Tạo URL thanh toán VNPay
   * @param amount Số tiền thanh toán (VND)
   * @param orderInfo Thông tin đơn hàng
   * @returns Object chứa URL thanh toán
   */
  async createPayment(
    amount: number,
    orderInfo: string
  ): Promise<{ paymentUrl: string }> {
    try {
      const response = await axiosInstance.get("/api/payment/create", {
        params: {
          amount,
          orderInfo,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      throw error;
    }
  }

  /**
   * Xử lý kết quả trả về từ VNPay
   * @param params Các tham số trả về từ VNPay
   * @returns Dữ liệu xử lý từ server
   */
  async handleVnPayReturn(params: Record<string, string>): Promise<any> {
    console.log(
      "[VNPAY_SERVICE] Processing payment return with params:",
      params
    );
    const startTime = Date.now();

    try {
      // Thêm timeout ngắn hơn (15 giây) và thêm log để debug
      const response = await axiosInstance.get("/api/payment/vnpay-return", {
        params,
        timeout: 15000, // 15 seconds timeout
      });

      const endTime = Date.now();
      console.log(
        `[VNPAY_SERVICE] Payment processed in ${endTime - startTime}ms`,
        {
          responseCode: response.data?.vnp_ResponseCode,
          transactionId: response.data?.vnp_TxnRef,
        }
      );

      // Nếu server không trả về kết quả đúng định dạng, xử lý mặc định
      if (!response.data || typeof response.data !== "object") {
        console.warn("[VNPAY_SERVICE] Invalid response format:", response.data);

        // Tạo kết quả mặc định dựa vào params
        return {
          vnp_ResponseCode: params.vnp_ResponseCode || "99",
          vnp_TxnRef: params.vnp_TxnRef || "",
          vnp_Amount: params.vnp_Amount || "0",
          vnp_OrderInfo: params.vnp_OrderInfo || "",
          vnp_PayDate: params.vnp_PayDate || "",
          isSuccess: params.vnp_ResponseCode === "00",
          message:
            params.vnp_ResponseCode === "00"
              ? "Thanh toán thành công"
              : "Thanh toán thất bại",
        };
      }

      return {
        ...response.data,
        isSuccess: response.data.vnp_ResponseCode === "00",
      };
    } catch (error) {
      const endTime = Date.now();
      console.error(
        `[VNPAY_SERVICE] Payment processing error after ${
          endTime - startTime
        }ms:`,
        error
      );

      // Nếu gặp lỗi (timeout, server error) tạo response mặc định từ params URL
      return {
        vnp_ResponseCode: params.vnp_ResponseCode || "99",
        vnp_TxnRef: params.vnp_TxnRef || "",
        vnp_Amount: params.vnp_Amount || "0",
        vnp_OrderInfo: params.vnp_OrderInfo || "",
        vnp_PayDate: params.vnp_PayDate || "",
        isSuccess: params.vnp_ResponseCode === "00",
        message: "Không thể kết nối đến server. Sử dụng thông tin từ URL.",
      };
    }
  }
}

export const vnpayService = new VNPayService();
