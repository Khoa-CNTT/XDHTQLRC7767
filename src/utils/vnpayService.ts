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
      console.log("[VNPAY_SERVICE] Creating payment request", {
        amount,
        orderInfo,
      });

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
    let retryCount = 0;
    const maxRetries = 3;

    // Kiểm tra nếu có lỗi "Sai chữ ký" từ VNPay
    if (params.vnp_ResponseCode === "97") {
      console.warn("[VNPAY_SERVICE] Signature validation error detected");

      // Nếu phát hiện lỗi chữ ký nhưng giao dịch có thể đã thành công
      // Sử dụng vnp_TxnRef để truy vấn trạng thái giao dịch từ backend
      if (params.vnp_TxnRef) {
        try {
          console.log(
            `[VNPAY_SERVICE] Verifying transaction: ${params.vnp_TxnRef}`
          );
          const verifyResponse = await axiosInstance.get(
            "/api/payment/verify",
            {
              params: { txnRef: params.vnp_TxnRef },
              timeout: 10000,
            }
          );

          if (verifyResponse.data && verifyResponse.data.isSuccess) {
            console.log(
              `[VNPAY_SERVICE] Transaction verified successfully: ${params.vnp_TxnRef}`
            );
            return {
              ...params,
              vnp_ResponseCode: "00", // Ghi đè mã lỗi thành công công
              isSuccess: true,
              message: "Giao dịch đã được xác nhận thành công",
            };
          }
        } catch (verifyError) {
          console.error("[VNPAY_SERVICE] Verification error:", verifyError);
        }
      }
    }

    const tryRequest = async (): Promise<any> => {
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
          console.warn(
            "[VNPAY_SERVICE] Invalid response format:",
            response.data
          );

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
      } catch (error: any) {
        // Nếu là lỗi 400 với message chứa "chữ ký" hoặc "signature", thực hiện thử lại
        const isSignatureError =
          error.response?.status === 400 &&
          (error.response?.data?.message?.toLowerCase().includes("chữ ký") ||
            error.response?.data?.message?.toLowerCase().includes("signature"));

        if (isSignatureError && retryCount < maxRetries) {
          retryCount++;
          console.log(
            `[VNPAY_SERVICE] Signature error, retrying (${retryCount}/${maxRetries})...`
          );

          // Thêm độ trễ ngẫu nhiên trước khi thử lại (100-500ms)
          const delay = 100 + Math.random() * 400;
          await new Promise((resolve) => setTimeout(resolve, delay));

          return tryRequest(); // Thử lại
        }

        const endTime = Date.now();
        console.error(
          `[VNPAY_SERVICE] Payment processing error after ${
            endTime - startTime
          }ms:`,
          error
        );

        // Trường hợp đặc biệt cho lỗi chữ ký
        if (isSignatureError) {
          console.log(
            "[VNPAY_SERVICE] Handling signature error after max retries"
          );

          // Nếu vnp_ResponseCode là "00" trong URL nhưng bị lỗi chữ ký,
          // có khả năng giao dịch vẫn thành công
          if (params.vnp_ResponseCode === "00") {
            console.log(
              "[VNPAY_SERVICE] Transaction might be successful despite signature error"
            );
            return {
              ...params,
              isSuccess: true,
              message:
                "Giao dịch có thể đã thành công nhưng có lỗi xác thực. Vui lòng kiểm tra lịch sử giao dịch.",
            };
          }
        }

        // Nếu gặp lỗi (timeout, server error) tạo response mặc định từ params URL
        return {
          vnp_ResponseCode: params.vnp_ResponseCode || "99",
          vnp_TxnRef: params.vnp_TxnRef || "",
          vnp_Amount: params.vnp_Amount || "0",
          vnp_OrderInfo: params.vnp_OrderInfo || "",
          vnp_PayDate: params.vnp_PayDate || "",
          isSuccess: params.vnp_ResponseCode === "00",
          message:
            error.response?.data?.message ||
            "Không thể kết nối đến server. Sử dụng thông tin từ URL.",
        };
      }
    };

    return tryRequest();
  }

  /**
   * Phương thức mới để truy vấn trạng thái giao dịch
   * @param txnRef Mã tham chiếu giao dịch
   * @returns Trạng thái giao dịch từ server
   */
  async verifyTransaction(txnRef: string): Promise<any> {
    try {
      console.log(`[VNPAY_SERVICE] Verifying transaction: ${txnRef}`);
      const response = await axiosInstance.get("/api/payment/verify", {
        params: { txnRef },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error(
        `[VNPAY_SERVICE] Error verifying transaction ${txnRef}:`,
        error
      );
      throw error;
    }
  }
}

export const vnpayService = new VNPayService();
