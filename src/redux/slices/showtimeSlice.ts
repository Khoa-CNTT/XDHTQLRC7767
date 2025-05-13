import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho lịch chiếu
export interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  roomId: number;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
}

// Định nghĩa kiểu cho showtime DTOs
export interface ShowListDTO {
  movieId: number;
  roomId: number;
  showDate: string;
  startTime: string;
  pricePerShowTime: number;
}

export interface ShowListCreatedResponeDTO {
  id: number;
  movieId: number;
  movieTitle: string;
  roomId: number;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
}

// Định nghĩa kiểu cho Chair (ghế)
export interface Chair {
  id: number;
  name: string;
  type: string;
  status: string;
  price: number;
}

// Định nghĩa kiểu cho ShowTimeWithChairsDTO
export interface ShowTimeWithChairsDTO {
  id: number;
  movieId: number;
  movieTitle: string;
  roomId: number;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  chairs: Chair[];
}

// Định nghĩa kiểu cho filter params
export interface ShowtimeParams {
  date?: string;
  cinemaId?: number;
  movieId?: number;
}

// Định nghĩa kiểu trạng thái
interface ShowtimeState {
  showtimeList: {
    data: Showtime[];
    loading: boolean;
    error: string | null;
  };
  createShowtime: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  showtimeWithChairs: {
    data: ShowTimeWithChairsDTO | null;
    loading: boolean;
    error: string | null;
  };
}

// State ban đầu
const initialState: ShowtimeState = {
  showtimeList: {
    data: [],
    loading: false,
    error: null,
  },
  createShowtime: {
    loading: false,
    error: null,
    success: false,
  },
  showtimeWithChairs: {
    data: null,
    loading: false,
    error: null,
  },
};

// Slice
const showtimeSlice = createSlice({
  name: "showtime",
  initialState,
  reducers: {
    // Lấy danh sách lịch chiếu
    getShowtimeListRequest: {
      reducer: (state) => {
        state.showtimeList.loading = true;
        state.showtimeList.error = null;
      },
      prepare: (params?: ShowtimeParams) => ({ payload: params }),
    },
    getShowtimeListSuccess: (state, action: PayloadAction<Showtime[]>) => {
      state.showtimeList.loading = false;
      state.showtimeList.data = action.payload;
    },
    getShowtimeListFailure: (state, action: PayloadAction<string>) => {
      state.showtimeList.loading = false;
      state.showtimeList.error = action.payload;
    },

    // Tạo lịch chiếu mới
    createShowtimeRequest: (state, action: PayloadAction<ShowListDTO>) => {
      state.createShowtime.loading = true;
      state.createShowtime.error = null;
      state.createShowtime.success = false;
    },
    createShowtimeSuccess: (
      state,
      action: PayloadAction<ShowListCreatedResponeDTO>
    ) => {
      state.createShowtime.loading = false;
      state.createShowtime.success = true;
      // Thêm vào danh sách hiện tại
      state.showtimeList.data.push(action.payload);
    },
    createShowtimeFailure: (state, action: PayloadAction<string>) => {
      state.createShowtime.loading = false;
      state.createShowtime.error = action.payload;
      state.createShowtime.success = false;
    },
    // Reset trạng thái create
    resetCreateShowtimeState: (state) => {
      state.createShowtime.loading = false;
      state.createShowtime.error = null;
      state.createShowtime.success = false;
    },

    // Lấy showtime với danh sách ghế
    getShowtimeWithChairsRequest: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.showtimeWithChairs.loading = true;
      state.showtimeWithChairs.error = null;
    },
    getShowtimeWithChairsSuccess: (
      state,
      action: PayloadAction<ShowTimeWithChairsDTO>
    ) => {
      state.showtimeWithChairs.loading = false;
      state.showtimeWithChairs.data = action.payload;
    },
    getShowtimeWithChairsFailure: (state, action: PayloadAction<string>) => {
      state.showtimeWithChairs.loading = false;
      state.showtimeWithChairs.error = action.payload;
    },
  },
});

// Export actions
export const {
  getShowtimeListRequest,
  getShowtimeListSuccess,
  getShowtimeListFailure,
  createShowtimeRequest,
  createShowtimeSuccess,
  createShowtimeFailure,
  resetCreateShowtimeState,
  getShowtimeWithChairsRequest,
  getShowtimeWithChairsSuccess,
  getShowtimeWithChairsFailure,
} = showtimeSlice.actions;

// Export reducer
export default showtimeSlice.reducer;
