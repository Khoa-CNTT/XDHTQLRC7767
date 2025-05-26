import { takeEvery, put, call, select, race, delay } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  createPaymentRequest,
  createPaymentSuccess,
  createPaymentFailure,
  handlePaymentReturnRequest,
  handlePaymentReturnSuccess,
  handlePaymentReturnFailure,
  PaymentRequest,
  getPaymentsPageRequest,
  getPaymentsPageSuccess,
  getPaymentsPageFailure,
  getYearlyRevenueRequest,
  getYearlyRevenueSuccess,
  getYearlyRevenueFailure,
  getDailyRevenueRequest,
  getDailyRevenueSuccess,
  getDailyRevenueFailure,
  getPaymentStatisticsRequest,
  getPaymentStatisticsSuccess,
  getPaymentStatisticsFailure,
  PaymentPageParams,
  YearlyRevenueParams,
  DailyRevenueParams,
  StatisticsParams,
  Payment,
  DailyRevenueDTO,
  getAllPaymentsRequest,
  getAllPaymentsSuccess,
  getAllPaymentsFailure,
  updatePaymentStatusRequest,
  updatePaymentStatusSuccess,
  updatePaymentStatusFailure,
  UpdatePaymentStatusParams,
  verifyTransactionRequest,
  verifyTransactionSuccess,
  verifyTransactionFailure,
  VerifyTransactionParams,
} from "../slices/paymentSlice";
import { createTicketRequest } from "../slices/ticketSlice";
import { vnpayService } from "../../utils/vnpayService";
import { notificationUtils } from "../../utils/notificationConfig";
import { RootState } from "../store";
import axiosInstance from "../../utils/axiosConfig";

interface BookingData {
  showtime?: {
    id: string | number;
  };
  seats?: string[];
  seatsInfo?: Array<{
    id: number;
    name: string;
    type?: string;
  }>;
  pricing?: {
    ticketPrice: number;
    seatTypes?: {
      standard: number;
      standardPrice: number;
      vip: number;
      vipPrice: number;
      couple: number;
      couplePrice: number;
    };
  };
  customerId?: string | number;
}

interface ChairType {
  id: number;
  name: string;
  type?: string;
}

// Helper function to create ticket
function* createTicket(bookingData: BookingData) {
  try {
    console.log(
      "[PAYMENT_SAGA] Creating ticket with bookingData:",
      bookingData
    );

    // Lấy ID ghế từ bookingData
    const showtimeId = bookingData.showtime?.id;

    if (!showtimeId) {
      throw new Error("Không tìm thấy thông tin suất chiếu");
    }

    // Danh sách ghế để tạo vé
    let seatsToProcess: ChairType[] = [];

    // Ưu tiên sử dụng seatsInfo từ BookingPage
    if (bookingData.seatsInfo && bookingData.seatsInfo.length > 0) {
      seatsToProcess = bookingData.seatsInfo.map(
        (seatInfo: { id: number; name: string; type?: string }) => ({
          id: seatInfo.id,
          name: seatInfo.name,
          type: seatInfo.type,
        })
      );
    } else {
      // Fallback: Lấy dữ liệu ghế từ showtime state
      const showtimeState: RootState = yield select();
      const chairs =
        showtimeState.showtime.showtimeWithChairs?.data?.chairs || [];

      if (bookingData.seats && bookingData.seats.length > 0) {
        const processed = bookingData.seats
          .map((seatName: string) => {
            const chair = chairs.find(
              (c: { id: number; name: string; type?: string }) =>
                c.name === seatName
            );
            return chair
              ? { id: chair.id, name: chair.name, type: chair.type }
              : null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        seatsToProcess = processed;
      }
    }

    if (seatsToProcess.length === 0) {
      throw new Error("Không tìm thấy thông tin ghế đã chọn!");
    }

    // Tính toán giá vé bằng cách thủ công
    let totalPrice = 0;

    // Ưu tiên sử dụng thông tin seatTypes nếu có
    if (bookingData.pricing?.seatTypes) {
      const seatTypes = bookingData.pricing.seatTypes;
      console.log(
        "[PAYMENT_SAGA] Using seat types for price calculation:",
        seatTypes
      );

      // Tính từng loại ghế
      const standardTotal =
        (seatTypes.standard || 0) * (seatTypes.standardPrice || 0);
      const vipTotal = (seatTypes.vip || 0) * (seatTypes.vipPrice || 0);
      const coupleTotal =
        (seatTypes.couple || 0) * (seatTypes.couplePrice || 0);

      totalPrice = standardTotal + vipTotal + coupleTotal;

      console.log(
        `[PAYMENT_SAGA] Tính giá vé:
        - Ghế thường: ${seatTypes.standard || 0} x ${
          seatTypes.standardPrice || 0
        } = ${standardTotal}
        - Ghế VIP: ${seatTypes.vip || 0} x ${
          seatTypes.vipPrice || 0
        } = ${vipTotal}
        - Ghế couple: ${seatTypes.couple || 0} x ${
          seatTypes.couplePrice || 0
        } = ${coupleTotal}
        - Tổng cộng: ${totalPrice}`
      );
    } else {
      // Sử dụng phương pháp tính giá cũ làm fallback
      const basePrice = bookingData.pricing?.ticketPrice || 0;
      const seatCount = seatsToProcess.length;

      // Tính phụ phí cho loại ghế đặc biệt
      const extraCharges = seatsToProcess.reduce((total, seat) => {
        if (seat.type?.toLowerCase() === "vip") {
          return total + 30000; // Ghế VIP thêm 30,000 VND
        } else if (seat.type?.toLowerCase() === "couple") {
          return total + 100000; // Ghế couple thêm 100,000 VND
        }
        return total;
      }, 0);

      // Tổng giá = giá vé cơ bản * số ghế + phụ phí
      totalPrice = basePrice * seatCount + extraCharges;

      console.log(
        `[PAYMENT_SAGA] Tính giá vé:
        - Giá vé cơ bản: ${basePrice}
        - Số ghế: ${seatCount}
        - Phụ phí ghế đặc biệt: ${extraCharges}
        - Tổng cộng: ${totalPrice}`
      );
    }

    if (totalPrice <= 0) {
      console.error("[PAYMENT_SAGA] Giá vé không hợp lệ:", totalPrice);
      totalPrice = 90000 * seatsToProcess.length; // Giá mặc định nếu tính giá lỗi
      console.log("[PAYMENT_SAGA] Sử dụng giá mặc định:", totalPrice);
    }

    // Thu thập tất cả ID ghế
    const allChairIds = seatsToProcess.map((seat) => seat.id.toString());

    // Tạo một vé duy nhất cho tất cả các ghế
    const ticketRequestData = {
      type: "Standard", // Không phân biệt loại ghế
      price: totalPrice, // Sử dụng tổng giá từ tính toán
      id_showTime: parseInt(showtimeId.toString()),
      id_customer: bookingData.customerId?.toString() || "",
      chairIds: allChairIds, // Tất cả ghế trong một vé
    };

    console.log(
      `[PAYMENT_SAGA] Creating single ticket for ${allChairIds.length} seats with price ${totalPrice}`,
      ticketRequestData
    );

    // Dispatch action để tạo vé - chỉ gọi một lần duy nhất
    yield put(createTicketRequest(ticketRequestData as any));

    console.log(
      `[PAYMENT_SAGA] Created a single ticket with ${allChairIds.length} seats`
    );
  } catch (error) {
    console.error(
      "[PAYMENT_SAGA] Error while processing ticket creation:",
      error
    );
    notificationUtils.warning({
      message: "Cảnh báo",
      description:
        "Thanh toán thành công nhưng có lỗi khi tạo vé. Vui lòng kiểm tra trong trang cá nhân.",
    });
  }
}

interface VnpayResponse {
  paymentUrl: string;
}

// Saga xử lý tạo URL thanh toán
export function* createPaymentSaga(
  action: PayloadAction<PaymentRequest>
): Generator<any, void, any> {
  try {
    const { amount, orderInfo, bookingData } = action.payload;

    const response: VnpayResponse = yield call(
      vnpayService.createPayment,
      amount,
      orderInfo
    );

    // Lưu bookingData vào response để sử dụng sau khi thanh toán thành công
    yield put(
      createPaymentSuccess({
        paymentUrl: response.paymentUrl,
        bookingData,
      })
    );

    // Chuyển hướng đến URL thanh toán VNPay
    if (response.paymentUrl) {
      window.location.href = response.paymentUrl;
    } else {
      throw new Error("Không nhận được URL thanh toán từ VNPay");
    }
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Create payment error:", error);
    yield put(
      createPaymentFailure(
        error.response?.data?.message || "Không thể tạo yêu cầu thanh toán"
      )
    );
    notificationUtils.error({
      message: "Tạo yêu cầu thanh toán thất bại",
      description:
        error.response?.data?.message ||
        "Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.",
    });
  }
}

// Saga xử lý kết quả trả về từ VNPay
export function* handlePaymentReturnSaga(
  action: PayloadAction<Record<string, string>>
): Generator<any, void, any> {
  try {
    const startTime = Date.now();
    console.log(
      "[PAYMENT_SAGA] Starting handlePaymentReturnSaga with params:",
      action.payload
    );

    // Race between the VNPay API call and a timeout
    const raceResult: {
      result?: Record<string, string>;
      timeout?: boolean;
    } = yield race({
      result: call(vnpayService.handleVnPayReturn, action.payload),
      timeout: delay(30000), // 30 seconds timeout
    });

    const { result, timeout } = raceResult;

    if (timeout) {
      console.error("[PAYMENT_SAGA] VNPay API call timed out after 30 seconds");
      throw new Error("VNPay API call timed out");
    }

    if (!result) {
      console.error("[PAYMENT_SAGA] No response received from VNPay");
      throw new Error("No response received from VNPay");
    }

    const responseCode = result.vnp_ResponseCode;
    console.log(
      `[PAYMENT_SAGA] VNPay response processed in ${
        Date.now() - startTime
      }ms. Response code: ${responseCode}, TxnRef: ${result.vnp_TxnRef}`
    );

    // Kiểm tra trạng thái giao dịch
    if (responseCode === "00") {
      console.log(
        "[PAYMENT_SAGA] Payment successful, proceeding with ticket creation"
      );
      // Thanh toán thành công
      yield put(handlePaymentReturnSuccess(result));

      // Lấy dữ liệu đặt vé từ state
      const state: RootState = yield select();
      const bookingData = state.payment.bookingData;

      if (!bookingData) {
        console.error("[PAYMENT_SAGA] Missing booking data in state");
        throw new Error("Missing booking data");
      }

      // Kiểm tra xem đã tạo vé chưa
      const ticketState = state.ticket;
      const ticketCreated = ticketState.createTicket.success;

      if (!ticketCreated) {
        console.log("[PAYMENT_SAGA] Ticket not created yet, creating ticket");
        // Tạo vé nếu chưa tạo
        yield call(createTicket, bookingData);
      } else {
        console.log("[PAYMENT_SAGA] Ticket already created, skipping creation");
      }
    } else {
      console.log("[PAYMENT_SAGA] Payment failed with code:", responseCode);
      // Thanh toán thất bại
      yield put(
        handlePaymentReturnFailure(
          result.vnp_ResponseMessage || "Thanh toán thất bại"
        )
      );
    }
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Handle payment return error:", error);
    yield put(
      handlePaymentReturnFailure(
        error.response?.data?.message || "Xử lý thanh toán thất bại"
      )
    );
    notificationUtils.error({
      message: "Xử lý kết quả thanh toán thất bại",
      description:
        error.response?.data?.message ||
        "Không thể xác nhận kết quả thanh toán. Vui lòng liên hệ quản trị viên.",
    });
  }
}

// New saga functions for payment statistics

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  number: number;
}

// Get payment page saga
export function* getPaymentsPageSaga(
  action: PayloadAction<PaymentPageParams>
): Generator<any, void, any> {
  try {
    const { page } = action.payload;
    // URL: http://localhost:8080/api/payment
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment?page=${page}`
    );
    const data = response.data as PagedResponse<Payment>;
    yield put(getPaymentsPageSuccess(data));
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Get payments page error:", error);
    yield put(
      getPaymentsPageFailure(
        error.response?.data?.message || "Không thể lấy danh sách thanh toán"
      )
    );
    notificationUtils.error({
      message: "Lỗi tải dữ liệu",
      description:
        error.response?.data?.message ||
        "Không thể lấy danh sách thanh toán. Vui lòng thử lại sau.",
    });
  }
}

type MonthlyRevenueData = Array<[number, number]>;

// Get yearly revenue saga
export function* getYearlyRevenueSaga(
  action: PayloadAction<YearlyRevenueParams>
): Generator<any, void, any> {
  try {
    const { year } = action.payload;
    // URL: http://localhost:8080/api/payment/total-revenue/2025
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment/total-revenue/${year}`
    );

    // Get data from response
    const apiData = response.data as Array<[number, number]>;

    // Create a map to easily access revenue by month
    const revenueByMonth = new Map<number, number>();
    apiData.forEach(([month, revenue]) => {
      revenueByMonth.set(month, revenue);
    });

    // Create an array with all 12 months, filling with 0 for missing months
    const completeData: Array<[number, number]> = [];
    for (let month = 1; month <= 12; month++) {
      completeData.push([month, revenueByMonth.get(month) || 0]);
    }

    yield put(getYearlyRevenueSuccess(completeData));
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Get yearly revenue error:", error);
    yield put(
      getYearlyRevenueFailure(
        error.response?.data?.message || "Không thể lấy doanh thu theo năm"
      )
    );
    notificationUtils.error({
      message: "Lỗi tải dữ liệu thống kê",
      description:
        error.response?.data?.message ||
        "Không thể lấy doanh thu theo năm. Vui lòng thử lại sau.",
    });
  }
}

// Get daily revenue saga
export function* getDailyRevenueSaga(
  action: PayloadAction<DailyRevenueParams>
): Generator<any, void, any> {
  try {
    const { date } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment/daily-revenue/${date}`
    );
    const data = response.data as DailyRevenueDTO;
    yield put(getDailyRevenueSuccess(data));
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Get daily revenue error:", error);
    yield put(
      getDailyRevenueFailure(
        error.response?.data?.message || "Không thể lấy doanh thu theo ngày"
      )
    );
    notificationUtils.error({
      message: "Lỗi tải dữ liệu thống kê",
      description:
        error.response?.data?.message ||
        "Không thể lấy doanh thu theo ngày. Vui lòng thử lại sau.",
    });
  }
}

type StatisticsData = Array<[string, number, number]>;

// Get payment statistics saga
export function* getPaymentStatisticsSaga(
  action: PayloadAction<StatisticsParams>
): Generator<any, void, any> {
  try {
    const { startDate, endDate } = action.payload;
    // URL: http://localhost:8080/api/payment/statistics?startDate=2025-05-15&endDate=2025-06-15
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment/statistics?startDate=${startDate}&endDate=${endDate}`
    );
    const data = response.data as StatisticsData;
    yield put(getPaymentStatisticsSuccess(data));
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Get payment statistics error:", error);
    yield put(
      getPaymentStatisticsFailure(
        error.response?.data?.message || "Không thể lấy thống kê thanh toán"
      )
    );
    notificationUtils.error({
      message: "Lỗi tải dữ liệu thống kê",
      description:
        error.response?.data?.message ||
        "Không thể lấy thống kê thanh toán. Vui lòng thử lại sau.",
    });
  }
}

// New saga to get all payments
export function* getAllPaymentsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axiosInstance.get, "/api/payment/all");
    yield put(getAllPaymentsSuccess(response.data));
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Get all payments error:", error);
    yield put(
      getAllPaymentsFailure(
        error.response?.data?.message || "Không thể lấy tất cả thanh toán"
      )
    );
    notificationUtils.error({
      message: "Lỗi tải dữ liệu",
      description:
        error.response?.data?.message ||
        "Không thể lấy tất cả dữ liệu thanh toán. Vui lòng thử lại sau.",
    });
  }
}

// New saga to update payment status
export function* updatePaymentStatusSaga(
  action: PayloadAction<UpdatePaymentStatusParams>
): Generator<any, void, any> {
  try {
    const { paymentId, status } = action.payload;
    // Call API to update payment status
    const response = yield call(
      axiosInstance.put,
      `/api/payment/${paymentId}/status`,
      { status }
    );
    yield put(updatePaymentStatusSuccess(response.data));
    // Refresh payments list after update
    yield put(getAllPaymentsRequest());
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Update payment status error:", error);
    yield put(
      updatePaymentStatusFailure(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái thanh toán"
      )
    );
    notificationUtils.error({
      message: "Cập nhật trạng thái thanh toán thất bại",
      description:
        error.response?.data?.message ||
        "Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại sau.",
    });
  }
}

// Saga to verify transaction status
export function* verifyTransactionSaga(
  action: PayloadAction<VerifyTransactionParams>
): Generator<any, void, any> {
  try {
    const { txnRef } = action.payload;
    console.log(`[PAYMENT_SAGA] Verifying transaction: ${txnRef}`);

    // Race between the verification call and a timeout
    const raceResult: {
      result?: any;
      timeout?: boolean;
    } = yield race({
      result: call([vnpayService, vnpayService.verifyTransaction], txnRef),
      timeout: delay(10000), // 10 seconds timeout
    });

    const { result, timeout } = raceResult;

    if (timeout) {
      throw new Error("Transaction verification timed out");
    }

    if (!result) {
      throw new Error("No response received from transaction verification");
    }

    console.log(`[PAYMENT_SAGA] Transaction verification result:`, result);

    // If verification is successful
    if (result.isSuccess) {
      console.log(
        `[PAYMENT_SAGA] Transaction verified as successful: ${txnRef}`
      );

      // Update state with verification result
      yield put(verifyTransactionSuccess(result));

      // Lấy dữ liệu đặt vé từ state
      const state: RootState = yield select();
      const bookingData = state.payment.bookingData;

      if (!bookingData) {
        console.error("[PAYMENT_SAGA] Missing booking data in state");
        throw new Error("Missing booking data");
      }

      // Kiểm tra xem đã tạo vé chưa
      const ticketState = state.ticket;
      const ticketCreated = ticketState.createTicket.success;

      if (!ticketCreated) {
        console.log(
          "[PAYMENT_SAGA] Ticket not created yet, creating ticket after verification"
        );
        // Tạo vé nếu chưa tạo
        yield call(createTicket, bookingData);
      }
    } else {
      console.log(`[PAYMENT_SAGA] Transaction verification failed: ${txnRef}`);
      yield put(
        verifyTransactionFailure(
          result.message || "Xác minh giao dịch thất bại"
        )
      );
    }
  } catch (error: any) {
    console.error("[PAYMENT_SAGA] Transaction verification error:", error);
    yield put(
      verifyTransactionFailure(
        error.response?.data?.message ||
          "Không thể xác minh trạng thái giao dịch"
      )
    );
    notificationUtils.error({
      message: "Xác minh giao dịch thất bại",
      description:
        error.response?.data?.message ||
        "Không thể xác minh trạng thái giao dịch. Vui lòng kiểm tra lịch sử thanh toán.",
    });
  }
}

// Saga chính
export default function* paymentSaga() {
  yield takeEvery(createPaymentRequest.type, createPaymentSaga);
  yield takeEvery(handlePaymentReturnRequest.type, handlePaymentReturnSaga);

  // Register new sagas
  yield takeEvery(getPaymentsPageRequest.type, getPaymentsPageSaga);
  yield takeEvery(getYearlyRevenueRequest.type, getYearlyRevenueSaga);
  yield takeEvery(getDailyRevenueRequest.type, getDailyRevenueSaga);
  yield takeEvery(getPaymentStatisticsRequest.type, getPaymentStatisticsSaga);

  // Register additional sagas for all payments
  yield takeEvery(getAllPaymentsRequest.type, getAllPaymentsSaga);
  yield takeEvery(updatePaymentStatusRequest.type, updatePaymentStatusSaga);

  // Register saga for transaction verification
  yield takeEvery(verifyTransactionRequest.type, verifyTransactionSaga);
}
