import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho một bộ phim
interface Cinema {
  id: number;
  title: string;
  description: string;
  // Thêm các thuộc tính khác nếu cần
}

// Cinema by location interface
export interface CinemaByLocation {
  id: number;
  name: string;
  address: string;
  phone: string;
  image: string;
  facilities: string[];
  screens: number;
}

// Định nghĩa state
export interface MovieState {
  cinemaList: {
    data: [];
    loading: boolean;
    error: string | null;
  };
  mockShowtimes: {
    data: [];
    loading: boolean;
    error: string | null;
  };
  bookingInfo: {
    data: {};
    loading: boolean;
    error: string | null;
  };
  cinemaByLocation: {
    data: CinemaByLocation[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
  };
}

// State ban đầu
const initialState: MovieState = {
  cinemaList: {
    data: [],
    loading: false,
    error: null,
  },
  mockShowtimes: {
    data: [],
    loading: false,
    error: null,
  },
  bookingInfo: {
    data: {},
    loading: false,
    error: null,
  },
  cinemaByLocation: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
};

// Slice
const cinemaSlice = createSlice({
  name: "cinema",
  initialState,
  reducers: {
    getCinemaListRequest: (state) => {
      state.cinemaList.loading = true;
      state.cinemaList.error = null;
    },
    getCinemaListSuccess: (state, action: any) => {
      state.cinemaList.loading = false;
      state.cinemaList.data = action.payload.data;
    },
    getCinemaListFailure: (state, action: PayloadAction<string>) => {
      state.cinemaList.loading = false;
      state.cinemaList.error = action.payload;
    },

    //get show time cinema
    getMockShowtimeRequest: (state, action) => {
      state.mockShowtimes.loading = true;
      state.mockShowtimes.error = null;
    },
    getMockShowtimeSuccess: (state, action: any) => {
      state.mockShowtimes.loading = false;
      state.mockShowtimes.data = action.payload.data;
    },
    getMockShowtimeFailure: (state, action: PayloadAction<string>) => {
      state.mockShowtimes.loading = false;
      state.mockShowtimes.error = action.payload;
    },

    //getBooking
    getInfoBookingRequest: (state, action) => {
      state.bookingInfo.loading = true;
      state.bookingInfo.error = null;
    },
    getInfoBookingSuccess: (state, action: any) => {
      state.bookingInfo.loading = false;
      state.bookingInfo.data = action.payload.data;
      console.log(action.payload);
    },
    getInfoBookingFailure: (state, action: PayloadAction<string>) => {
      state.bookingInfo.loading = false;
      state.bookingInfo.error = action.payload;
    },

    // Get cinemas by location
    getCinemasByLocationRequest: (
      state,
      action: PayloadAction<{ location: string; page: number }>
    ) => {
      state.cinemaByLocation.loading = true;
      state.cinemaByLocation.error = null;
    },
    getCinemasByLocationSuccess: (
      state,
      action: PayloadAction<{
        data: CinemaByLocation[];
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      console.log("action.payload", action.payload);
      state.cinemaByLocation.loading = false;
      state.cinemaByLocation.data = action.payload.data;
      state.cinemaByLocation.currentPage = action.payload.currentPage;
      state.cinemaByLocation.totalPages = action.payload.totalPages;
    },
    getCinemasByLocationFailure: (state, action: PayloadAction<string>) => {
      state.cinemaByLocation.loading = false;
      state.cinemaByLocation.error = action.payload;
    },
  },
});

// Export actions
export const {
  getCinemaListRequest,
  getCinemaListSuccess,
  getCinemaListFailure,
  getMockShowtimeFailure,
  getMockShowtimeRequest,
  getMockShowtimeSuccess,
  getInfoBookingRequest,
  getInfoBookingSuccess,
  getInfoBookingFailure,
  getCinemasByLocationRequest,
  getCinemasByLocationSuccess,
  getCinemasByLocationFailure,
} = cinemaSlice.actions;

// Export reducer
export default cinemaSlice.reducer;
