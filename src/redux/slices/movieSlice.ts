import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho một bộ phim
export interface Movie {
  id: number;
  title: string; // Tương ứng với name từ backend
  name?: string; // Thêm trường name từ API
  description: string;
  director?: string;
  releaseDate?: string; // Thay đổi để phù hợp với string | null
  duration?: number;
  genre?: string[]; // Danh sách tên genre
  genreIds?: number[]; // Danh sách ID của genre
  genres?: { id: number; name: string }[]; // Thêm genres từ API response
  movieGenres?: { id: number; name: string }[]; // Thêm movieGenres từ API response
  status?: string | number; // Status có thể là chuỗi hoặc số (1, 2, 3)
  poster?: string; // Tương ứng với imageUrl từ backend
  backdrop?: string; // Hình ảnh nền
  rating?: number;
  actor?: string;
  country?: string;
  language?: string;
  subtitle?: string;
  ageLimit?: number;
  content?: string;
}

// Định nghĩa kiểu cho thống kê phim
export interface MovieStatisticsDTO {
  movieTitle: string;
  showtimesCount: number;
  ticketsSold: number;
  revenue: number;
}

// Định nghĩa kiểu cho phim ở trang chủ
export interface MovieHomeResponseDTO {
  id: number;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  image: string;
  // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa kiểu cho các filter
export interface MovieFilterParams {
  name?: string;
  director?: string;
  actor?: string;
  genreName?: string;
}

// Định nghĩa các kiểu cho showtimes
export interface Cinema {
  id?: number;
  name: string;
  address: string;
}

export interface ShowTime {
  id?: number;
  startTime: string;
  endTime?: string;
  pricePerShowTime?: number;
  roomName?: string;
  roomId?: number;
}

// Cập nhật interface để hỗ trợ cả hai định dạng API có thể trả về
export interface ShowTimeListByLocation {
  cinema?: Cinema;
  showTimes?: ShowTime[];
  // Format mới
  name?: string;
  address?: string;
  showtimes?: string[];
}

export interface ShowtimeParams {
  movieId: number | string;
  date: string;
}

// Định nghĩa kiểu cho comment
export interface Comment {
  id: number;
  content: string;
  userId: number;
  movieId: number;
  createdAt: string;
  isApproved: boolean;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

// Định nghĩa kiểu cho CommentDto
export interface CommentDto {
  movieId: number;
  userId: number;
  content: string;
}

// Định nghĩa state
export interface MovieState {
  movieList: {
    data: Movie[];
    loading: boolean;
    error: string | null;
  };
  movieDetail: {
    data: Movie | Record<string, unknown>;
    loading: boolean;
    error: string | null;
  };
  movieBooking: {
    data: Record<string, unknown>;
    loading: boolean;
    error: string | null;
  };
  nowShowingMovies: {
    data: MovieHomeResponseDTO[];
    loading: boolean;
    error: string | null;
  };
  upcomingMovies: {
    data: MovieHomeResponseDTO[];
    loading: boolean;
    error: string | null;
  };
  showTimes: {
    data: ShowTimeListByLocation[];
    loading: boolean;
    error: string | null;
  };
  comments: {
    data: Comment[];
    loading: boolean;
    error: string | null;
  };
  addComment: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  // Admin movie management
  adminMovieList: {
    data: Movie[];
    loading: boolean;
    error: string | null;
  };
  adminMovieAdd: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  adminMovieUpdate: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  adminMovieDelete: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  adminBulkActions: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  movieStatistics: {
    data: MovieStatisticsDTO[];
    loading: boolean;
    error: string | null;
  };
}

// State ban đầu
const initialState: MovieState = {
  movieList: {
    data: [],
    loading: false,
    error: null,
  },
  movieDetail: {
    data: {},
    loading: false,
    error: null,
  },
  movieBooking: {
    data: {},
    loading: false,
    error: null,
  },
  nowShowingMovies: {
    data: [],
    loading: false,
    error: null,
  },
  upcomingMovies: {
    data: [],
    loading: false,
    error: null,
  },
  showTimes: {
    data: [],
    loading: false,
    error: null,
  },
  comments: {
    data: [],
    loading: false,
    error: null,
  },
  addComment: {
    loading: false,
    error: null,
    success: false,
  },
  // Admin movie management
  adminMovieList: {
    data: [],
    loading: false,
    error: null,
  },
  adminMovieAdd: {
    loading: false,
    error: null,
    success: false,
  },
  adminMovieUpdate: {
    loading: false,
    error: null,
    success: false,
  },
  adminMovieDelete: {
    loading: false,
    error: null,
    success: false,
  },
  adminBulkActions: {
    loading: false,
    error: null,
    success: false,
  },
  movieStatistics: {
    data: [],
    loading: false,
    error: null,
  },
};

// Slice
const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    getMovieListRequest: (state) => {
      state.movieList.loading = true;
      state.movieList.error = null;
    },
    getMovieListSuccess: (state, action: PayloadAction<Movie[]>) => {
      state.movieList.loading = false;
      state.movieList.data = action.payload;
    },
    getMovieListFailure: (state, action: PayloadAction<string>) => {
      state.movieList.loading = false;
      state.movieList.error = action.payload;
    },
    // getMovieDetail
    getMovieDetailRequest: (state, action) => {
      state.movieDetail.loading = true;
      state.movieDetail.error = null;
    },
    getMovieDetailSuccess: (state, action) => {
      const { data } = action.payload;
      state.movieDetail.data = data;
      state.movieDetail.loading = false;
    },
    getMovieDetailFailure: (state, action) => {
      const { error } = action.payload;
      state.movieDetail.loading = false;
      state.movieDetail.error = error;
    },
    // getBooking
    getBookingRequest: (state, action) => {
      state.movieBooking.loading = true;
      state.movieBooking.error = null;
    },
    getBookingSuccess: (state, action) => {
      const { data } = action.payload;
      state.movieBooking.data = data;
      state.movieBooking.loading = false;
    },
    getBookingFailure: (state, action) => {
      const { error } = action.payload;
      state.movieBooking.loading = false;
      state.movieBooking.error = error;
    },
    // Lấy danh sách phim đang chiếu
    getNowShowingMoviesRequest: (state) => {
      state.nowShowingMovies.loading = true;
      state.nowShowingMovies.error = null;
    },
    getNowShowingMoviesSuccess: (
      state,
      action: PayloadAction<MovieHomeResponseDTO[]>
    ) => {
      state.nowShowingMovies.loading = false;
      state.nowShowingMovies.data = action.payload;
    },
    getNowShowingMoviesFailure: (state, action: PayloadAction<string>) => {
      state.nowShowingMovies.loading = false;
      state.nowShowingMovies.error = action.payload;
    },
    // Lấy danh sách phim sắp chiếu
    getUpcomingMoviesRequest: (state) => {
      state.upcomingMovies.loading = true;
      state.upcomingMovies.error = null;
    },
    getUpcomingMoviesSuccess: (
      state,
      action: PayloadAction<MovieHomeResponseDTO[]>
    ) => {
      state.upcomingMovies.loading = false;
      state.upcomingMovies.data = action.payload;
    },
    getUpcomingMoviesFailure: (state, action: PayloadAction<string>) => {
      state.upcomingMovies.loading = false;
      state.upcomingMovies.error = action.payload;
    },
    // Get showtimes for a movie by date
    getShowTimesRequest: (state, action: PayloadAction<ShowtimeParams>) => {
      state.showTimes.loading = true;
      state.showTimes.error = null;
    },
    getShowTimesSuccess: (
      state,
      action: PayloadAction<ShowTimeListByLocation[]>
    ) => {
      state.showTimes.loading = false;
      state.showTimes.data = action.payload;
    },
    getShowTimesFailure: (state, action: PayloadAction<string>) => {
      state.showTimes.loading = false;
      state.showTimes.error = action.payload;
    },
    // Get comments for a movie
    getCommentsRequest: (state, action) => {
      state.comments.loading = true;
      state.comments.error = null;
    },
    getCommentsSuccess: (state, action: PayloadAction<any[]>) => {
      state.comments.loading = false;
      state.comments.data = action.payload;
    },
    getCommentsFailure: (state, action: PayloadAction<string>) => {
      state.comments.loading = false;
      state.comments.error = action.payload;
    },
    // Add a comment
    addCommentRequest: (state, action) => {
      state.addComment.loading = true;
      state.addComment.error = null;
      state.addComment.success = false;
    },
    addCommentSuccess: (state, action: PayloadAction<Comment>) => {
      state.addComment.loading = false;
      state.addComment.success = true;
      // Add the new comment to the comments list
      state.comments.data = [action.payload, ...state.comments.data];
    },
    addCommentFailure: (state, action: PayloadAction<string>) => {
      state.addComment.loading = false;
      state.addComment.error = action.payload;
      state.addComment.success = false;
    },
    resetAddCommentState: (state) => {
      state.addComment.loading = false;
      state.addComment.error = null;
      state.addComment.success = false;
    },
    // Admin movie management - get list
    getAdminMovieListRequest: (
      state,
      action: PayloadAction<MovieFilterParams | undefined>
    ) => {
      state.adminMovieList.loading = true;
      state.adminMovieList.error = null;
    },
    getAdminMovieListSuccess: (state, action: PayloadAction<Movie[]>) => {
      state.adminMovieList.loading = false;
      state.adminMovieList.data = action.payload;
      console.log(action.payload);
    },
    getAdminMovieListFailure: (state, action: PayloadAction<string>) => {
      state.adminMovieList.loading = false;
      state.adminMovieList.error = action.payload;
    },
    // Admin movie management - add movie
    addMovieRequest: (state, action: PayloadAction<Omit<Movie, "id">>) => {
      state.adminMovieAdd.loading = true;
      state.adminMovieAdd.error = null;
      state.adminMovieAdd.success = false;
    },
    addMovieSuccess: (state, action: PayloadAction<Movie>) => {
      state.adminMovieAdd.loading = false;
      state.adminMovieAdd.success = true;
      state.adminMovieList.data = [
        action.payload,
        ...state.adminMovieList.data,
      ];
    },
    addMovieFailure: (state, action: PayloadAction<string>) => {
      state.adminMovieAdd.loading = false;
      state.adminMovieAdd.error = action.payload;
    },
    // Admin movie management - update movie
    updateMovieRequest: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Movie> }>
    ) => {
      state.adminMovieUpdate.loading = true;
      state.adminMovieUpdate.error = null;
      state.adminMovieUpdate.success = false;
    },
    updateMovieSuccess: (state, action: PayloadAction<Movie>) => {
      state.adminMovieUpdate.loading = false;
      state.adminMovieUpdate.success = true;
      state.adminMovieList.data = state.adminMovieList.data.map((movie) =>
        movie.id === action.payload.id ? action.payload : movie
      );
    },
    updateMovieFailure: (state, action: PayloadAction<string>) => {
      state.adminMovieUpdate.loading = false;
      state.adminMovieUpdate.error = action.payload;
    },
    // Admin movie management - delete movie
    deleteMovieRequest: (state, action: PayloadAction<number>) => {
      state.adminMovieDelete.loading = true;
      state.adminMovieDelete.error = null;
      state.adminMovieDelete.success = false;
    },
    deleteMovieSuccess: (state, action: PayloadAction<number>) => {
      state.adminMovieDelete.loading = false;
      state.adminMovieDelete.success = true;
      state.adminMovieList.data = state.adminMovieList.data.filter(
        (movie) => movie.id !== action.payload
      );
    },
    deleteMovieFailure: (state, action: PayloadAction<string>) => {
      state.adminMovieDelete.loading = false;
      state.adminMovieDelete.error = action.payload;
    },
    // Admin movie management - bulk delete
    bulkDeleteMoviesRequest: (state, action: PayloadAction<number[]>) => {
      state.adminBulkActions.loading = true;
      state.adminBulkActions.error = null;
      state.adminBulkActions.success = false;
    },
    bulkDeleteMoviesSuccess: (state, action: PayloadAction<number[]>) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.success = true;
      state.adminMovieList.data = state.adminMovieList.data.filter(
        (movie) => !action.payload.includes(movie.id)
      );
    },
    bulkDeleteMoviesFailure: (state, action: PayloadAction<string>) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.error = action.payload;
    },
    // Admin movie management - bulk update status
    bulkUpdateStatusRequest: (
      state,
      action: PayloadAction<{ ids: number[]; status: string }>
    ) => {
      state.adminBulkActions.loading = true;
      state.adminBulkActions.error = null;
      state.adminBulkActions.success = false;
    },
    bulkUpdateStatusSuccess: (
      state,
      action: PayloadAction<{ ids: number[]; status: string }>
    ) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.success = true;
      state.adminMovieList.data = state.adminMovieList.data.map((movie) => {
        if (action.payload.ids.includes(movie.id)) {
          return { ...movie, status: action.payload.status };
        }
        return movie;
      });
    },
    bulkUpdateStatusFailure: (state, action: PayloadAction<string>) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.error = action.payload;
    },
    // Reset states
    resetAdminMovieState: (state) => {
      state.adminMovieAdd.loading = false;
      state.adminMovieAdd.error = null;
      state.adminMovieAdd.success = false;
      state.adminMovieUpdate.loading = false;
      state.adminMovieUpdate.error = null;
      state.adminMovieUpdate.success = false;
      state.adminMovieDelete.loading = false;
      state.adminMovieDelete.error = null;
      state.adminMovieDelete.success = false;
      state.adminBulkActions.loading = false;
      state.adminBulkActions.error = null;
      state.adminBulkActions.success = false;
    },
    // Get movie statistics
    getMovieStatisticsRequest: (state) => {
      state.movieStatistics.loading = true;
      state.movieStatistics.error = null;
    },
    getMovieStatisticsSuccess: (
      state,
      action: PayloadAction<MovieStatisticsDTO[]>
    ) => {
      state.movieStatistics.loading = false;
      state.movieStatistics.data = action.payload;
    },
    getMovieStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.movieStatistics.loading = false;
      state.movieStatistics.error = action.payload;
    },
  },
});

// Export actions
export const {
  getMovieListRequest,
  getMovieListSuccess,
  getMovieListFailure,
  getMovieDetailRequest,
  getMovieDetailSuccess,
  getMovieDetailFailure,
  getBookingRequest,
  getBookingSuccess,
  getBookingFailure,
  getNowShowingMoviesRequest,
  getNowShowingMoviesSuccess,
  getNowShowingMoviesFailure,
  getUpcomingMoviesRequest,
  getUpcomingMoviesSuccess,
  getUpcomingMoviesFailure,
  getShowTimesRequest,
  getShowTimesSuccess,
  getShowTimesFailure,
  getCommentsRequest,
  getCommentsSuccess,
  getCommentsFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  resetAddCommentState,
  // Admin movie management
  getAdminMovieListRequest,
  getAdminMovieListSuccess,
  getAdminMovieListFailure,
  addMovieRequest,
  addMovieSuccess,
  addMovieFailure,
  updateMovieRequest,
  updateMovieSuccess,
  updateMovieFailure,
  deleteMovieRequest,
  deleteMovieSuccess,
  deleteMovieFailure,
  bulkDeleteMoviesRequest,
  bulkDeleteMoviesSuccess,
  bulkDeleteMoviesFailure,
  bulkUpdateStatusRequest,
  bulkUpdateStatusSuccess,
  bulkUpdateStatusFailure,
  resetAdminMovieState,
  getMovieStatisticsRequest,
  getMovieStatisticsSuccess,
  getMovieStatisticsFailure,
} = movieSlice.actions;

// Export reducer
export default movieSlice.reducer;
