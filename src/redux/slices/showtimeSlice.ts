import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho lịch chiếu
export interface Showtime {
  id: number;
  startTime: string;
  endTime: string;
  pricePerShowTime: number;
  date: string;
  status: string;
  movie: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    director: string;
    actor: string;
    duration: number;
    releaseYear: number;
    rating: number;
    country: string;
    language: string;
    subtitle: string;
    ageLimit: number;
    content: string;
    releaseDate: string;
    status: number;
    backdrop: string;
    delete: boolean;
  };
  room: {
    id: number;
    name: string;
    type: string;
    capacity: number;
    status: string;
    cinema: {
      id: number;
      name: string;
      address: string;
      phone: string;
      email: string;
      imageUrl: string;
      delete: boolean;
    };
  };
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
  startTime: string;
  endTime: string;
  pricePerShowTime: number;
  date: string;
  status: string;
  movie: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    director: string;
    actor: string;
    duration: number;
    releaseYear: number;
    rating: number;
    country: string;
    language: string;
    subtitle: string;
    ageLimit: number;
    content: string;
    releaseDate: string;
    status: number;
    backdrop: string;
    delete: boolean;
  };
  room: {
    id: number;
    name: string;
    type: string;
    capacity: number;
    status: string;
    cinema: {
      id: number;
      name: string;
      address: string;
      phone: string;
      email: string;
      imageUrl: string;
      delete: boolean;
    };
  };
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
  movieName?: string;
  roomName?: string;
}

// Add ShowtimeStatisticsDTO interface
export interface ShowtimeStatisticsDTO {
  showtimeId: number;
  ticketsSold: number;
  totalRevenue: number;
  // These will be populated in the saga
  date?: string;
  time?: string;
  movieTitle?: string;
  roomName?: string;
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
  showtimeStatistics: {
    data: ShowtimeStatisticsDTO[];
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
  showtimeStatistics: {
    data: [],
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

    // Search showtimes
    searchShowtimesRequest: {
      reducer: (state) => {
        state.showtimeList.loading = true;
        state.showtimeList.error = null;
      },
      prepare: (params?: ShowtimeParams) => ({ payload: params }),
    },
    searchShowtimesSuccess: (state, action: PayloadAction<Showtime[]>) => {
      state.showtimeList.loading = false;
      state.showtimeList.data = action.payload;
    },
    searchShowtimesFailure: (state, action: PayloadAction<string>) => {
      state.showtimeList.loading = false;
      state.showtimeList.error = action.payload;
    },

    // Get showtime statistics
    getShowtimeStatisticsRequest: (state) => {
      state.showtimeStatistics.loading = true;
      state.showtimeStatistics.error = null;
    },
    getShowtimeStatisticsSuccess: (
      state,
      action: PayloadAction<ShowtimeStatisticsDTO[]>
    ) => {
      state.showtimeStatistics.loading = false;
      state.showtimeStatistics.data = action.payload;
    },
    getShowtimeStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.showtimeStatistics.loading = false;
      state.showtimeStatistics.error = action.payload;
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
  searchShowtimesRequest,
  searchShowtimesSuccess,
  searchShowtimesFailure,
  getShowtimeStatisticsRequest,
  getShowtimeStatisticsSuccess,
  getShowtimeStatisticsFailure,
} = showtimeSlice.actions;

// Export reducer
export default showtimeSlice.reducer;
