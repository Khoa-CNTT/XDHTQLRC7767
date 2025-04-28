import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho một bộ phim
interface Cinema {
    id: number;
    title: string;
    description: string;
    // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa state
export interface MovieState {
    cinemaList: {
        data: [];
        loading: boolean;
        error: string | null;
    },
    mockShowtimes: {
        data: [];
        loading: boolean;
        error: string | null;
    },
    bookingInfo: {
        data: {};
        loading: boolean;
        error: string | null;
    }
}

// State ban đầu
const initialState: MovieState = {
    cinemaList: {
        data: [],
        loading: false,
        error: null
    },
    mockShowtimes: {
        data: [],
        loading: false,
        error: null
    },
    bookingInfo: {
        data: {},
        loading: false,
        error: null
    },
};

// Slice
const cinemaSlice = createSlice({
    name: 'cinema',
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
        //getWithChair
        getWithChairRequest: (state, action) => {
            state.bookingInfo.loading = true;
            state.bookingInfo.error = null;
        },
        getWithChairSuccess: (state, action: any) => {
            state.bookingInfo.loading = false;
            state.bookingInfo.data = action.payload.data;
            console.log(action.payload);
        },
        getWithChairFailure: (state, action: PayloadAction<string>) => {
            state.bookingInfo.loading = false;
            state.bookingInfo.error = action.payload;
        }
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
    getWithChairRequest,
    getWithChairSuccess,
    getWithChairFailure
} = cinemaSlice.actions;

// Export reducer
export default cinemaSlice.reducer;
