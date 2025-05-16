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

    // Lấy giá vé từ bookingData (từ BookingPage)
    const bookingPrice = bookingData.pricing?.ticketPrice || 0;
    const seatCount = seatsToProcess.length;

    // Tính tổng giá = giá vé đơn vị * số ghế
    const totalPrice = bookingPrice * seatCount;

    console.log(
      `[PAYMENT_SAGA] Giá vé đơn vị: ${bookingPrice}, Số lượng ghế: ${seatCount}, Tổng giá: ${totalPrice}`
    );

    if (!bookingPrice || bookingPrice <= 0) {
      console.error("[PAYMENT_SAGA] Giá vé đơn vị không hợp lệ:", bookingPrice);
      throw new Error("Giá vé đơn vị không hợp lệ");
    }

    // Thu thập tất cả ID ghế
    const allChairIds = seatsToProcess.map((seat) => seat.id.toString());

    // Tạo một vé duy nhất cho tất cả các ghế
    const ticketRequestData = {
      type: "Standard", // Không phân biệt loại ghế
      price: totalPrice, // Sử dụng tổng giá thay vì giá đơn vị
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
function* createPaymentSaga(action: PayloadAction<PaymentRequest>) {
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo thanh toán";
    yield put(createPaymentFailure(errorMessage));

    notificationUtils.error({
      message: "Lỗi thanh toán",
      description:
        errorMessage || "Không thể tạo thanh toán. Vui lòng thử lại sau.",
    });
  }
}

// Saga xử lý kết quả trả về từ VNPay
export function* handlePaymentReturnSaga(
  action: PayloadAction<Record<string, string>>
) {
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
  } catch (error) {
    console.error("[PAYMENT_SAGA] Error in handlePaymentReturnSaga:", error);
    yield put(
      handlePaymentReturnFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

// New saga functions for payment statistics

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  number: number;
}

// Get payment page saga
function* getPaymentsPageSaga(action: PayloadAction<PaymentPageParams>) {
  try {
    const { page } = action.payload;
    // URL: http://localhost:8080/api/payment
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment?page=${page}`
    );
    const data = response.data as PagedResponse<Payment>;
    yield put(getPaymentsPageSuccess(data));
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể lấy danh sách thanh toán";
    yield put(getPaymentsPageFailure(errorMessage));
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách thanh toán. Vui lòng thử lại sau.",
    });
  }
}

type MonthlyRevenueData = Array<[number, number]>;

// Get yearly revenue saga
function* getYearlyRevenueSaga(action: PayloadAction<YearlyRevenueParams>) {
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
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể lấy doanh thu theo tháng";
    yield put(getYearlyRevenueFailure(errorMessage));
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy doanh thu theo tháng. Vui lòng thử lại sau.",
    });
  }
}

// Get daily revenue saga
function* getDailyRevenueSaga(action: PayloadAction<DailyRevenueParams>) {
  try {
    const { date } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment/daily-revenue/${date}`
    );
    const data = response.data as DailyRevenueDTO;
    yield put(getDailyRevenueSuccess(data));
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể lấy doanh thu theo ngày";
    yield put(getDailyRevenueFailure(errorMessage));
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy doanh thu theo ngày. Vui lòng thử lại sau.",
    });
  }
}

type StatisticsData = Array<[string, number, number]>;

// Get payment statistics saga
function* getPaymentStatisticsSaga(action: PayloadAction<StatisticsParams>) {
  try {
    const { startDate, endDate } = action.payload;
    // URL: http://localhost:8080/api/payment/statistics?startDate=2025-05-15&endDate=2025-06-15
    const response = yield call(
      axiosInstance.get,
      `http://localhost:8080/api/payment/statistics?startDate=${startDate}&endDate=${endDate}`
    );
    const data = response.data as StatisticsData;
    yield put(getPaymentStatisticsSuccess(data));
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể lấy thống kê thanh toán";
    yield put(getPaymentStatisticsFailure(errorMessage));
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy thống kê thanh toán. Vui lòng thử lại sau.",
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
}
