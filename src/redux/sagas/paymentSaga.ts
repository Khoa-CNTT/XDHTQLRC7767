import { takeEvery, put, call, select } from "redux-saga/effects";
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
import { vnpayService } from "../../utils/vnpayService";
import { notificationUtils } from "../../utils/notificationConfig";
import axiosInstance from "../../utils/axiosConfig";
import { RootState } from "../store";

// Saga xử lý tạo URL thanh toán
function* createPaymentSaga(
  action: PayloadAction<PaymentRequest>
): Generator<any, void, any> {
  try {
    const { amount, orderInfo, bookingData } = action.payload;

    console.log("Creating payment with bookingData:", bookingData);

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
function* handlePaymentReturnSaga(
  action: PayloadAction<Record<string, string>>
): Generator<any, void, any> {
  try {
    console.log("Handling payment return with params:", action.payload);

    const response = yield call(vnpayService.handleVnPayReturn, action.payload);
    console.log("VNPay response:", response);

    // Get payment state to access bookingData
    const paymentState = yield select((state: RootState) => state.payment);
    const { bookingData } = paymentState;

    console.log("Current bookingData in state:", bookingData);

    // Kiểm tra xem thanh toán thành công và có bookingData hay không
    if (
      response.vnp_ResponseCode === "00" &&
      bookingData &&
      bookingData.seats &&
      bookingData.seats.length > 0
    ) {
      try {
        console.log("Payment successful, updating seat status...");

        // Gọi API để cập nhật trạng thái ghế thành "booked"
        const seatUpdatePayload = {
          showtimeId: bookingData.showtime?.id,
          seats: bookingData.seats.map((seat: string) => ({
            name: seat,
            status: "booked",
          })),
        };

        console.log("Seat update payload:", seatUpdatePayload);

        // Gọi API cập nhật trạng thái ghế
        const updateResponse = yield call(
          axiosInstance.post,
          "/api/booking/update-seats",
          seatUpdatePayload
        );

        console.log("Seat update response:", updateResponse);

        notificationUtils.success({
          message: "Cập nhật ghế thành công",
          description: "Ghế đã được đặt thành công.",
        });
      } catch (updateError: any) {
        console.error("Lỗi khi cập nhật trạng thái ghế:", updateError);

        notificationUtils.warning({
          message: "Cảnh báo",
          description:
            "Thanh toán thành công nhưng có lỗi khi cập nhật trạng thái ghế.",
        });
        // Vẫn tiếp tục xử lý thanh toán thành công ngay cả khi cập nhật ghế thất bại
      }
    }

    yield put(handlePaymentReturnSuccess(response) as any);

    // Hiển thị thông báo thành công
    notificationUtils.success({
      message: "Thanh toán thành công",
      description: "Đơn hàng của bạn đã được thanh toán thành công.",
    });
  } catch (error: any) {
    console.error("Payment return error:", error);

    yield put(
      handlePaymentReturnFailure(
        error.message || "Không thể xác nhận thanh toán"
      ) as any
    );

    notificationUtils.error({
      message: "Lỗi thanh toán",
      description:
        error.message ||
        "Không thể xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.",
    });
  }
}

// Saga chính
export default function* paymentSaga() {
  yield takeEvery(createPaymentRequest.type, createPaymentSaga);
  yield takeEvery(handlePaymentReturnRequest.type, handlePaymentReturnSaga);
}
