import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho một bộ phim
export interface Movie {
    id: number;
    title: string;
    description: string;
    // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa kiểu cho phim ở trang chủ
export interface MovieHomeResponseDTO {
    id: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    poster: string;
    // Thêm các thuộc tính khác nếu cần
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
    },
    movieDetail: {
        data: {};
        loading: boolean;
        error: string | null;
    },
    movieBooking: {
        data: {},
        loading: boolean;
        error: string | null;
    },
    nowShowingMovies: {
        data: MovieHomeResponseDTO[];
        loading: boolean;
        error: string | null;
    },
    upcomingMovies: {
        data: MovieHomeResponseDTO[];
        loading: boolean;
        error: string | null;
    },
    comments: {
        data: Comment[];
        loading: boolean;
        error: string | null;
    },
    addComment: {
        loading: boolean;
        error: string | null;
        success: boolean;
    }
}

// State ban đầu
const initialState: MovieState = {
    movieList: {
        data: [],
        loading: false,
        error: null
    },
    movieDetail: {
        data: {},
        loading: false,
        error: null
    },
    movieBooking: {
        data: {},
        loading: false,
        error: null
    },
    nowShowingMovies: {
        data: [],
        loading: false,
        error: null
    },
    upcomingMovies: {
        data: [],
        loading: false,
        error: null
    },
    comments: {
        data: [],
        loading: false,
        error: null
    },
    addComment: {
        loading: false,
        error: null,
        success: false
    }
};

// Slice
const movieSlice = createSlice({
    name: 'movie',
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
        getNowShowingMoviesSuccess: (state, action: PayloadAction<MovieHomeResponseDTO[]>) => {
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
        getUpcomingMoviesSuccess: (state, action: PayloadAction<MovieHomeResponseDTO[]>) => {
            state.upcomingMovies.loading = false;
            state.upcomingMovies.data = action.payload;
        },
        getUpcomingMoviesFailure: (state, action: PayloadAction<string>) => {
            state.upcomingMovies.loading = false;
            state.upcomingMovies.error = action.payload;
        },
        // Get comments for a movie
        getCommentsRequest: (state, action) => {
            state.comments.loading = true;
            state.comments.error = null;
        },
        getCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
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
        }
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
    getCommentsRequest,
    getCommentsSuccess,
    getCommentsFailure,
    addCommentRequest,
    addCommentSuccess,
    addCommentFailure,
    resetAddCommentState
} = movieSlice.actions;

// Export reducer
export default movieSlice.reducer;
