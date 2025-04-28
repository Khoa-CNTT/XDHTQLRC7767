import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu cho một bộ phim
interface room {
    id: number;
    title: string;
    description: string;
    // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa state
export interface roomState {
    roomList: {
        data: room[];
        loading: boolean;
        error: string | null;
    }
}

// State ban đầu
const initialState: roomState = {
    roomList: {
        data: [],
        loading: false,
        error: null
    }
};

// Slice
const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        //get room list
        getRoomListRequest: (state, action) => {
            state.roomList.loading = true;
            state.roomList.error = null;
        },
        getRoomListSuccess: (state, action: any) => {
            state.roomList.loading = false;
            state.roomList.data = action.payload.data;
        },
        getRoomListFailure: (state, action: PayloadAction<string>) => {
            state.roomList.loading = false;
            state.roomList.error = action.payload;
        },

    },
});

// Export actions
export const {
    getRoomListRequest,
    getRoomListSuccess,
    getRoomListFailure,
} = roomSlice.actions;

// Export reducer
export default roomSlice.reducer;
