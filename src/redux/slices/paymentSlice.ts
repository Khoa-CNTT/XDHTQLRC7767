import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho trạng thái thanh toán
interface PaymentState {
  paymentUrl: string | null;
  loading: boolean;
  success: boolean;
  error: string | null;
  paymentResult: Record<string, unknown>;
  bookingData: Record<string, unknown> | null;
  // New states for payment statistics
  paymentsPage: {
    data: Payment[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
  };
  yearlyRevenue: {
    data: MonthlyRevenue[];
    loading: boolean;
    error: string | null;
  };
  dailyRevenue: {
    data: DailyRevenueDTO | null;
    loading: boolean;
    error: string | null;
  };
  statisticsData: {
    data: PaymentStatistic[];
    loading: boolean;
    error: string | null;
  };
  // New state for all payments
  allPayments: Payment[];
}

// Định nghĩa kiểu dữ liệu cho request thanh toán
export interface PaymentRequest {
  amount: number;
  orderInfo: string;
  bookingData?: Record<string, unknown>; // Thông tin đặt vé để sử dụng sau khi thanh toán
}

// Định nghĩa kiểu dữ liệu cho response thanh toán thành công
interface PaymentSuccessResponse {
  paymentUrl: string;
  bookingData?: Record<string, unknown>;
}

// New interfaces for payment statistics
export interface Payment {
  paymentId: number | null;
  paymentDate: string;
  paymentAmount: number;
  paymentStatus: string;
  ticketName: string[];
  cinemaName: string;
  roomName: string;
  showDate: string;
  showTime: string;
  movieName: string;
}

export type MonthlyRevenue = [number, number];

export interface DailyRevenueDTO {
  date: string;
  totalRevenue: number;
  ticketCount: number;
  totalCustomer: number;
}

export interface PaymentStatistic {
  date: string;
  amount: number;
  count: number;
}

export interface PaymentPageParams {
  page: number;
}

export interface YearlyRevenueParams {
  year: number;
}

export interface DailyRevenueParams {
  date: string;
}

export interface StatisticsParams {
  startDate: string;
  endDate: string;
}

// New interface for payment status update
export interface UpdatePaymentStatusParams {
  paymentId: number;
  status: string;
}

// Trạng thái ban đầu
const initialState: PaymentState = {
  paymentUrl: null,
  loading: false,
  success: false,
  error: null,
  paymentResult: {},
  bookingData: null,
  paymentsPage: {
    data: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
  },
  yearlyRevenue: {
    data: [],
    loading: false,
    error: null,
  },
  dailyRevenue: {
    data: null,
    loading: false,
    error: null,
  },
  statisticsData: {
    data: [],
    loading: false,
    error: null,
  },
  // Initialize all payments state
  allPayments: [],
};

// Tạo slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    // Yêu cầu tạo URL thanh toán
    createPaymentRequest: (state) => {
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
    handlePaymentReturnRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    handlePaymentReturnSuccess: (
      state,
      action: PayloadAction<Record<string, unknown>>
    ) => {
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
      state.paymentResult = {};
      state.bookingData = null;
    },

    // New reducers for payment statistics
    getPaymentsPageRequest: (state) => {
      state.paymentsPage.loading = true;
      state.paymentsPage.error = null;
    },
    getPaymentsPageSuccess: (
      state,
      action: PayloadAction<{
        content: Payment[];
        totalPages: number;
        number: number;
      }>
    ) => {
      state.paymentsPage.loading = false;
      state.paymentsPage.data = action.payload.content;
      state.paymentsPage.totalPages = action.payload.totalPages;
      state.paymentsPage.currentPage = action.payload.number;
    },
    getPaymentsPageFailure: (state, action: PayloadAction<string>) => {
      state.paymentsPage.loading = false;
      state.paymentsPage.error = action.payload;
    },

    getYearlyRevenueRequest: (state) => {
      state.yearlyRevenue.loading = true;
      state.yearlyRevenue.error = null;
    },
    getYearlyRevenueSuccess: (
      state,
      action: PayloadAction<Array<[number, number]>>
    ) => {
      state.yearlyRevenue.loading = false;
      // Raw data is already transformed in the saga to include all 12 months
      state.yearlyRevenue.data = action.payload;
    },
    getYearlyRevenueFailure: (state, action: PayloadAction<string>) => {
      state.yearlyRevenue.loading = false;
      state.yearlyRevenue.error = action.payload;
    },

    getDailyRevenueRequest: (state) => {
      state.dailyRevenue.loading = true;
      state.dailyRevenue.error = null;
    },
    getDailyRevenueSuccess: (state, action: PayloadAction<DailyRevenueDTO>) => {
      state.dailyRevenue.loading = false;
      state.dailyRevenue.data = action.payload;
    },
    getDailyRevenueFailure: (state, action: PayloadAction<string>) => {
      state.dailyRevenue.loading = false;
      state.dailyRevenue.error = action.payload;
    },

    getPaymentStatisticsRequest: (state) => {
      state.statisticsData.loading = true;
      state.statisticsData.error = null;
    },
    getPaymentStatisticsSuccess: (
      state,
      action: PayloadAction<Array<[string, number, number]>>
    ) => {
      state.statisticsData.loading = false;
      // Transform backend data to match frontend PaymentStatistic interface
      state.statisticsData.data = action.payload.map((item) => ({
        date: item[0],
        amount: item[1],
        count: item[2],
      }));
    },
    getPaymentStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.statisticsData.loading = false;
      state.statisticsData.error = action.payload;
    },

    // New reducers for all payments
    getAllPaymentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllPaymentsSuccess: (state, action: PayloadAction<Payment[]>) => {
      state.loading = false;
      state.allPayments = action.payload;
    },
    getAllPaymentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update payment status
    updatePaymentStatusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePaymentStatusSuccess: (state, action: PayloadAction<Payment>) => {
      state.loading = false;
      // Update the payment in the allPayments array
      const index = state.allPayments.findIndex(
        (p) => p.paymentId === action.payload.paymentId
      );
      if (index !== -1) {
        state.allPayments[index] = action.payload;
      }
    },
    updatePaymentStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
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
  // New exports for payment statistics
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
  // New exports for all payments
  getAllPaymentsRequest,
  getAllPaymentsSuccess,
  getAllPaymentsFailure,
  updatePaymentStatusRequest,
  updatePaymentStatusSuccess,
  updatePaymentStatusFailure,
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
