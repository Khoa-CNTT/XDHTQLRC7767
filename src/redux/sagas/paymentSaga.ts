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
} from "../slices/paymentSlice";
import { createTicketRequest } from "../slices/ticketSlice";
import { vnpayService } from "../../utils/vnpayService";
import { notificationUtils } from "../../utils/notificationConfig";
import { RootState } from "../store";

// Helper function to create ticket
function* createTicket(bookingData: any) {
  try {
    console.log(
      "[PAYMENT_SAGA] Creating ticket with bookingData:",
      bookingData
    );

    // Lấy ID ghế từ bookingData
    const chairIds: string[] = [];
    const showtimeId = bookingData.showtime?.id;

    if (!showtimeId) {
      throw new Error("Không tìm thấy thông tin suất chiếu");
    }

    // Ưu tiên sử dụng seatsInfo từ BookingPage
    if (bookingData.seatsInfo && bookingData.seatsInfo.length > 0) {
      for (const seatInfo of bookingData.seatsInfo) {
        if (seatInfo && seatInfo.id) {
          chairIds.push(seatInfo.id.toString());
        }
      }
    } else {
      // Fallback: Lấy dữ liệu ghế từ showtime state
      const showtimeState = yield select((state: RootState) => state.showtime);
      const chairs = showtimeState.showtimeWithChairs?.data?.chairs || [];

      for (const seatName of bookingData.seats) {
        const chair = chairs.find(
          (c: { name: string; id: number }) => c.name === seatName
        );
        if (chair) {
          chairIds.push(chair.id.toString());
        }
      }
    }

    if (chairIds.length === 0) {
      throw new Error("Không tìm thấy ID của ghế đã chọn!");
    }

    // Xác định loại vé (VIP hoặc Standard)
    const vipSeats = bookingData.seatsInfo
      ? bookingData.seatsInfo.filter((seat: any) => seat.type === "vip")
      : [];

    const ticketType = vipSeats.length > 0 ? "VIP" : "Standard";

    // Tạo payload cho request tạo vé
    const ticketRequestData = {
      type: ticketType,
      price: bookingData.pricing.ticketPrice,
      id_showTime: parseInt(showtimeId),
      id_customer: bookingData.customerId || "",
      chairIds: chairIds,
    };

    console.log("[PAYMENT_SAGA] Creating ticket with data:", ticketRequestData);

    // Dispatch action để tạo vé
    yield put(createTicketRequest(ticketRequestData));
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

// Saga xử lý tạo URL thanh toán
function* createPaymentSaga(
  action: PayloadAction<PaymentRequest>
): Generator<any, void, any> {
  try {
    const { amount, orderInfo, bookingData } = action.payload;

    const response = yield call(vnpayService.createPayment, amount, orderInfo);

    // Lưu bookingData vào response để sử dụng sau khi thanh toán thành công
    yield put(
      createPaymentSuccess({
        paymentUrl: response.paymentUrl,
        bookingData,
      }) as any
    );

    // Chuyển hướng đến URL thanh toán VNPay
    if (response.paymentUrl) {
      window.location.href = response.paymentUrl;
    } else {
      throw new Error("Không nhận được URL thanh toán từ VNPay");
    }
  } catch (error: any) {
    yield put(
      createPaymentFailure(error.message || "Không thể tạo thanh toán") as any
    );

    notificationUtils.error({
      message: "Lỗi thanh toán",
      description:
        error.message || "Không thể tạo thanh toán. Vui lòng thử lại sau.",
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
    const {
      result,
      timeout,
    }: {
      result?: Record<string, string>;
      timeout?: boolean;
    } = yield race({
      result: call(vnpayService.handleVnPayReturn, action.payload),
      timeout: delay(30000), // 30 seconds timeout
    });

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

// Saga chính
export default function* paymentSaga() {
  yield takeEvery(createPaymentRequest.type, createPaymentSaga);
  yield takeEvery(handlePaymentReturnRequest.type, handlePaymentReturnSaga);
}
