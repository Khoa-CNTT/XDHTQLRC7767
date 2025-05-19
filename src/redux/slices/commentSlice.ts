import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for comments
export interface Comment {
  id: number;
  movieId: number;
  userId: number;
  content: string;
  approved: boolean;
  createdAt: string;
  userName?: string;
  movieTitle?: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    gender?: string | null;
    birthday?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    cardId?: string | null;
    account?: {
      username: string;
      role: string;
      loginType: string;
    };
    isDelete: boolean;
  };
}

// Define sentiment statistics interface
export interface SentimentStatistics {
  "10011001": number; // Negative
  "10011002": number; // Neutral
  "10011003": number; // Positive
}

// Define state interface
export interface CommentState {
  unapprovedComments: {
    data: Comment[];
    loading: boolean;
    error: string | null;
  };
  movieComments: {
    data: Comment[];
    loading: boolean;
    error: string | null;
  };
  sentimentStats: {
    data: SentimentStatistics | null;
    loading: boolean;
    error: string | null;
  };
}

// Initial state
const initialState: CommentState = {
  unapprovedComments: {
    data: [],
    loading: false,
    error: null,
  },
  movieComments: {
    data: [],
    loading: false,
    error: null,
  },
  sentimentStats: {
    data: null,
    loading: false,
    error: null,
  },
};

// Create comment slice
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // Get unapproved comments
    getUnapprovedCommentsRequest: (state) => {
      state.unapprovedComments.loading = true;
      state.unapprovedComments.error = null;
    },
    getUnapprovedCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.unapprovedComments.loading = false;
      state.unapprovedComments.data = action.payload;
    },
    getUnapprovedCommentsFailure: (state, action: PayloadAction<string>) => {
      state.unapprovedComments.loading = false;
      state.unapprovedComments.error = action.payload;
    },

    // Get comments by movie for admin
    getMovieCommentsRequest: (
      state,
      action: PayloadAction<{ movieId: number }>
    ) => {
      state.movieComments.loading = true;
      state.movieComments.error = null;
    },
    getMovieCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.movieComments.loading = false;
      state.movieComments.data = action.payload;
    },
    getMovieCommentsFailure: (state, action: PayloadAction<string>) => {
      state.movieComments.loading = false;
      state.movieComments.error = action.payload;
    },

    // Get sentiment statistics
    getSentimentStatsRequest: (
      state,
      action: PayloadAction<{ movieId: number }>
    ) => {
      state.sentimentStats.loading = true;
      state.sentimentStats.error = null;
    },
    getSentimentStatsSuccess: (
      state,
      action: PayloadAction<SentimentStatistics>
    ) => {
      state.sentimentStats.loading = false;
      state.sentimentStats.data = action.payload;
    },
    getSentimentStatsFailure: (state, action: PayloadAction<string>) => {
      state.sentimentStats.loading = false;
      state.sentimentStats.error = action.payload;
    },

    // Approve comment
    approveCommentRequest: (state, action: PayloadAction<{ id: number }>) => {
      state.unapprovedComments.loading = true;
    },
    approveCommentSuccess: (state, action: PayloadAction<{ id: number }>) => {
      state.unapprovedComments.loading = false;
      // Filter out the approved comment from unapproved list
      state.unapprovedComments.data = state.unapprovedComments.data.filter(
        (comment) => comment.id !== action.payload.id
      );
    },
    approveCommentFailure: (state, action: PayloadAction<string>) => {
      state.unapprovedComments.loading = false;
      state.unapprovedComments.error = action.payload;
    },

    // Delete comment
    deleteCommentRequest: (state, action: PayloadAction<{ id: number }>) => {
      state.unapprovedComments.loading = true;
    },
    deleteCommentSuccess: (state, action: PayloadAction<{ id: number }>) => {
      state.unapprovedComments.loading = false;
      // Filter out the deleted comment
      state.unapprovedComments.data = state.unapprovedComments.data.filter(
        (comment) => comment.id !== action.payload.id
      );
      state.movieComments.data = state.movieComments.data.filter(
        (comment) => comment.id !== action.payload.id
      );
    },
    deleteCommentFailure: (state, action: PayloadAction<string>) => {
      state.unapprovedComments.loading = false;
      state.unapprovedComments.error = action.payload;
    },
  },
});

// Export actions
export const {
  getUnapprovedCommentsRequest,
  getUnapprovedCommentsSuccess,
  getUnapprovedCommentsFailure,
  getMovieCommentsRequest,
  getMovieCommentsSuccess,
  getMovieCommentsFailure,
  getSentimentStatsRequest,
  getSentimentStatsSuccess,
  getSentimentStatsFailure,
  approveCommentRequest,
  approveCommentSuccess,
  approveCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
} = commentSlice.actions;

// Export reducer
export default commentSlice.reducer;
