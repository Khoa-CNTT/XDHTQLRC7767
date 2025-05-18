import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Cinema interface for the nested object
export interface Cinema {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  delete?: boolean;
}

// Định nghĩa kiểu cho một phòng chiếu
export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: string;
  status: string;
  cinema?: Cinema;
  cinemaId?: number;
  isActive?: boolean;
}

// Định nghĩa DTO cho thêm/sửa phòng
export interface RoomDTO {
  name: string;
  type: string;
  capacity: number;
  status: string;
  cinemaId: number;
}

// Định nghĩa các tham số lọc phòng
export interface RoomFilterParams {
  name?: string;
  type?: string;
  cinemaId?: number;
}

// Định nghĩa state
export interface RoomState {
  roomList: {
    data: Room[];
    loading: boolean;
    error: string | null;
  };
  roomDetail: {
    data: Room | null;
    loading: boolean;
    error: string | null;
  };
  // Admin room management
  adminRoomList: {
    data: Room[];
    loading: boolean;
    error: string | null;
  };
  adminRoomAdd: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  adminRoomUpdate: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  adminRoomDelete: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  adminBulkActions: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

// State ban đầu
const initialState: RoomState = {
  roomList: {
    data: [],
    loading: false,
    error: null,
  },
  roomDetail: {
    data: null,
    loading: false,
    error: null,
  },
  // Admin room management
  adminRoomList: {
    data: [],
    loading: false,
    error: null,
  },
  adminRoomAdd: {
    loading: false,
    error: null,
    success: false,
  },
  adminRoomUpdate: {
    loading: false,
    error: null,
    success: false,
  },
  adminRoomDelete: {
    loading: false,
    error: null,
    success: false,
  },
  adminBulkActions: {
    loading: false,
    error: null,
    success: false,
  },
};

// Slice
const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    // Get room list
    getRoomListRequest: (state, action: PayloadAction<number | undefined>) => {
      state.roomList.loading = true;
      state.roomList.error = null;
    },
    getRoomListSuccess: (state, action: PayloadAction<Room[]>) => {
      state.roomList.loading = false;
      state.roomList.data = action.payload;
    },
    getRoomListFailure: (state, action: PayloadAction<string>) => {
      state.roomList.loading = false;
      state.roomList.error = action.payload;
    },
    // Get room detail
    getRoomDetailRequest: (state, action: PayloadAction<number>) => {
      state.roomDetail.loading = true;
      state.roomDetail.error = null;
    },
    getRoomDetailSuccess: (state, action: PayloadAction<Room>) => {
      state.roomDetail.loading = false;
      state.roomDetail.data = action.payload;
    },
    getRoomDetailFailure: (state, action: PayloadAction<string>) => {
      state.roomDetail.loading = false;
      state.roomDetail.error = action.payload;
    },
    // Admin room management - get list
    getAdminRoomListRequest: (
      state,
      action: PayloadAction<RoomFilterParams | undefined>
    ) => {
      state.adminRoomList.loading = true;
      state.adminRoomList.error = null;
    },
    getAdminRoomListSuccess: (state, action: PayloadAction<Room[]>) => {
      state.adminRoomList.loading = false;
      state.adminRoomList.data = action.payload;
    },
    getAdminRoomListFailure: (state, action: PayloadAction<string>) => {
      state.adminRoomList.loading = false;
      state.adminRoomList.error = action.payload;
    },
    // Admin room management - add room
    addRoomRequest: (state, action: PayloadAction<RoomDTO>) => {
      state.adminRoomAdd.loading = true;
      state.adminRoomAdd.error = null;
      state.adminRoomAdd.success = false;
    },
    addRoomSuccess: (state, action: PayloadAction<Room>) => {
      state.adminRoomAdd.loading = false;
      state.adminRoomAdd.success = true;
      state.adminRoomList.data = [action.payload, ...state.adminRoomList.data];
    },
    addRoomFailure: (state, action: PayloadAction<string>) => {
      state.adminRoomAdd.loading = false;
      state.adminRoomAdd.error = action.payload;
      state.adminRoomAdd.success = false;
    },
    // Admin room management - update room
    updateRoomRequest: (
      state,
      action: PayloadAction<{ id: number; data: Partial<Room> }>
    ) => {
      state.adminRoomUpdate.loading = true;
      state.adminRoomUpdate.error = null;
      state.adminRoomUpdate.success = false;
    },
    updateRoomSuccess: (state, action: PayloadAction<Room>) => {
      state.adminRoomUpdate.loading = false;
      state.adminRoomUpdate.success = true;
      state.adminRoomList.data = state.adminRoomList.data.map((room) =>
        room.id === action.payload.id ? action.payload : room
      );
    },
    updateRoomFailure: (state, action: PayloadAction<string>) => {
      state.adminRoomUpdate.loading = false;
      state.adminRoomUpdate.error = action.payload;
      state.adminRoomUpdate.success = false;
    },
    // Admin room management - delete room
    deleteRoomRequest: (state, action: PayloadAction<number>) => {
      state.adminRoomDelete.loading = true;
      state.adminRoomDelete.error = null;
      state.adminRoomDelete.success = false;
    },
    deleteRoomSuccess: (state, action: PayloadAction<number>) => {
      state.adminRoomDelete.loading = false;
      state.adminRoomDelete.success = true;
      state.adminRoomList.data = state.adminRoomList.data.filter(
        (room) => room.id !== action.payload
      );
    },
    deleteRoomFailure: (state, action: PayloadAction<string>) => {
      state.adminRoomDelete.loading = false;
      state.adminRoomDelete.error = action.payload;
      state.adminRoomDelete.success = false;
    },
    // Admin room management - bulk delete
    bulkDeleteRoomsRequest: (state, action: PayloadAction<number[]>) => {
      state.adminBulkActions.loading = true;
      state.adminBulkActions.error = null;
      state.adminBulkActions.success = false;
    },
    bulkDeleteRoomsSuccess: (state, action: PayloadAction<number[]>) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.success = true;
      state.adminRoomList.data = state.adminRoomList.data.filter(
        (room) => !action.payload.includes(room.id)
      );
    },
    bulkDeleteRoomsFailure: (state, action: PayloadAction<string>) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.error = action.payload;
      state.adminBulkActions.success = false;
    },
    // Admin room management - bulk update status
    bulkUpdateRoomStatusRequest: (
      state,
      action: PayloadAction<{ ids: number[]; status: string }>
    ) => {
      state.adminBulkActions.loading = true;
      state.adminBulkActions.error = null;
      state.adminBulkActions.success = false;
    },
    bulkUpdateRoomStatusSuccess: (
      state,
      action: PayloadAction<{ ids: number[]; status: string }>
    ) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.success = true;
      state.adminRoomList.data = state.adminRoomList.data.map((room) => {
        if (action.payload.ids.includes(room.id)) {
          return { ...room, status: action.payload.status };
        }
        return room;
      });
    },
    bulkUpdateRoomStatusFailure: (state, action: PayloadAction<string>) => {
      state.adminBulkActions.loading = false;
      state.adminBulkActions.error = action.payload;
      state.adminBulkActions.success = false;
    },
    // Reset states
    resetAdminRoomState: (state) => {
      state.adminRoomAdd.loading = false;
      state.adminRoomAdd.error = null;
      state.adminRoomAdd.success = false;
      state.adminRoomUpdate.loading = false;
      state.adminRoomUpdate.error = null;
      state.adminRoomUpdate.success = false;
      state.adminRoomDelete.loading = false;
      state.adminRoomDelete.error = null;
      state.adminRoomDelete.success = false;
      state.adminBulkActions.loading = false;
      state.adminBulkActions.error = null;
      state.adminBulkActions.success = false;
    },
  },
});

// Export actions
export const {
  getRoomListRequest,
  getRoomListSuccess,
  getRoomListFailure,
  getRoomDetailRequest,
  getRoomDetailSuccess,
  getRoomDetailFailure,
  getAdminRoomListRequest,
  getAdminRoomListSuccess,
  getAdminRoomListFailure,
  addRoomRequest,
  addRoomSuccess,
  addRoomFailure,
  updateRoomRequest,
  updateRoomSuccess,
  updateRoomFailure,
  deleteRoomRequest,
  deleteRoomSuccess,
  deleteRoomFailure,
  bulkDeleteRoomsRequest,
  bulkDeleteRoomsSuccess,
  bulkDeleteRoomsFailure,
  bulkUpdateRoomStatusRequest,
  bulkUpdateRoomStatusSuccess,
  bulkUpdateRoomStatusFailure,
  resetAdminRoomState,
} = roomSlice.actions;

// Export reducer
export default roomSlice.reducer;
