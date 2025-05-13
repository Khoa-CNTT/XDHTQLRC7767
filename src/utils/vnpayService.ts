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
    try {
      const response = await axiosInstance.get("/api/payment/vnpay-return", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error handling VNPay return:", error);
      throw error;
    }
  }
}

export const vnpayService = new VNPayService();
