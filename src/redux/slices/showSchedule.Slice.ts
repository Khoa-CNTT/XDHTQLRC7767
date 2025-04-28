import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho một bộ phim
interface ShowSchedule {
    id: number;
    title: string;
    description: string;
    // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa state
export interface ShowScheduleState {
    showScheduleList: {
        data: ShowSchedule[];
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
    }
}

// State ban đầu
const initialState: ShowScheduleState = {
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
    }
};

// Slice
const showScheduleSlice = createSlice({
    name: 'showSchedule',
    initialState,
    reducers: {

    },
});

// Export actions
export const {
} = showScheduleSlice.actions;

// Export reducer
export default showScheduleSlice.reducer;
