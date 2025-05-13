import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho trạng thái thanh toán
interface PaymentState {
  paymentUrl: string | null;
  loading: boolean;
  success: boolean;
  error: string | null;
  paymentResult: any;
  bookingData: any | null;
}

// Định nghĩa kiểu dữ liệu cho request thanh toán
export interface PaymentRequest {
  amount: number;
  orderInfo: string;
  bookingData?: any; // Thông tin đặt vé để sử dụng sau khi thanh toán
}

// Định nghĩa kiểu dữ liệu cho response thanh toán thành công
interface PaymentSuccessResponse {
  paymentUrl: string;
  bookingData?: any;
}

// Trạng thái ban đầu
const initialState: PaymentState = {
  paymentUrl: null,
  loading: false,
  success: false,
  error: null,
  paymentResult: null,
  bookingData: null,
};

// Tạo slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // Yêu cầu tạo URL thanh toán
    createPaymentRequest: (state, action: PayloadAction<PaymentRequest>) => {
      state.loading = true;
      state.error = null;
      state.paymentUrl = null;
    },
    createPaymentSuccess: (
      state,
      action: PayloadAction<PaymentSuccessResponse>
    ) => {
      state.loading = false;
      state.paymentUrl = action.payload.paymentUrl;
      state.bookingData = action.payload.bookingData || null;
      state.success = true;
    },
    createPaymentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Xử lý kết quả từ VNPay callback
    handlePaymentReturnRequest: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.loading = true;
      state.error = null;
    },
    handlePaymentReturnSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.paymentResult = action.payload;
      state.success = true;
    },
    handlePaymentReturnFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Reset trạng thái thanh toán
    resetPaymentState: (state) => {
      state.paymentUrl = null;
      state.loading = false;
      state.success = false;
      state.error = null;
      state.paymentResult = null;
      state.bookingData = null;
    },
  },
});

// Export actions
export const {
  createPaymentRequest,
  createPaymentSuccess,
  createPaymentFailure,
  handlePaymentReturnRequest,
  handlePaymentReturnSuccess,
  handlePaymentReturnFailure,
  resetPaymentState,
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
