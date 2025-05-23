import { takeEvery, put, call, all } from "redux-saga/effects";
import {
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
  Room,
  RoomDTO,
  RoomFilterParams,
} from "../slices/room.slice";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";

interface GetRoomListAction {
  type: string;
  payload?: number;
}

interface GetRoomDetailAction {
  type: string;
  payload: number;
}

// Admin room management actions
interface GetAdminRoomListAction {
  type: string;
  payload?: RoomFilterParams;
}

interface AddRoomAction {
  type: string;
  payload: RoomDTO;
}

interface UpdateRoomAction {
  type: string;
  payload: {
    id: number;
    data: Partial<Room>;
  };
}

interface DeleteRoomAction {
  type: string;
  payload: number;
}

interface BulkDeleteRoomsAction {
  type: string;
  payload: number[];
}

interface BulkUpdateStatusAction {
  type: string;
  payload: {
    ids: number[];
    status: string;
  };
}

// Get room list saga
export function* getRoomListSaga(
  action: GetRoomListAction
): Generator<any, void, any> {
  try {
    const cinemaId = action.payload;
    const url = cinemaId ? `/api/rooms/${cinemaId.id}` : "/api/rooms";
    const response = yield call(axiosInstance.get, url);
    yield put(getRoomListSuccess(response.data));
  } catch (error: any) {
    yield put(
      getRoomListFailure(
        error.response?.data?.message || "Không thể lấy danh sách phòng chiếu"
      )
    );
  }
}

// Get room detail saga
export function* getRoomDetailSaga(
  action: GetRoomDetailAction
): Generator<any, void, any> {
  try {
    const id = action.payload;
    const response = yield call(axiosInstance.get, `/api/rooms/detail/${id}`);
    yield put(getRoomDetailSuccess(response.data));
  } catch (error: any) {
    yield put(
      getRoomDetailFailure(
        error.response?.data?.message || "Không thể lấy thông tin phòng chiếu"
      )
    );
  }
}

// Admin room list saga
export function* getAdminRoomListSaga(
  action: GetAdminRoomListAction
): Generator<any, void, any> {
  try {
    const filterParams = action.payload;
    let url = "/api/rooms";

    if (filterParams) {
      const params = new URLSearchParams();

      if (filterParams.name) params.append("name", filterParams.name);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.cinemaId)
        params.append("cinemaId", filterParams.cinemaId.toString());

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = yield call(axiosInstance.get, url);

    // Process the rooms from the response
    // Rooms now have a nested cinema object
    const rooms = response.data.map((room: any) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      type: room.type,
      status: room.status,
      cinema: room.cinema,
      cinemaId: room.cinema?.id, // Extract cinemaId from the nested cinema object
      isActive: room.status === "ACTIVE",
    }));

    yield put(getAdminRoomListSuccess(rooms));
  } catch (error: any) {
    yield put(
      getAdminRoomListFailure(
        error.response?.data?.message || "Không thể lấy danh sách phòng chiếu"
      )
    );
  }
}

// Add room saga
export function* addRoomSaga(action: AddRoomAction): Generator<any, void, any> {
  try {
    const roomDTO = action.payload;

    // Transform to match backend RoomDTO format
    // Send cinemaId as string
    const roomRequest = {
      name: roomDTO.name,
      type: roomDTO.type,
      capacity: roomDTO.capacity,
      status: roomDTO.status,
      cinemaId: roomDTO.cinemaId.toString(), // Convert to string
    };

    const response = yield call(axiosInstance.post, "/api/rooms", roomRequest);

    // Create a room object for the frontend state
    const newRoom: Room = {
      id: response.data?.id || Math.floor(Math.random() * 1000), // Fallback if API doesn't return ID
      name: roomDTO.name,
      capacity: roomDTO.capacity,
      type: roomDTO.type,
      status: roomDTO.status,
      cinemaId: roomDTO.cinemaId,
      // The API response will have the cinema object in a subsequent GET request
      isActive: roomDTO.status === "ACTIVE",
    };

    yield put(addRoomSuccess(newRoom));

    // Refresh the room list to get the complete cinema objects
    yield put(getAdminRoomListRequest(undefined));

    notificationUtils.success({
      message: "Thành công",
      description: "Thêm phòng chiếu mới thành công",
    });
  } catch (error: any) {
    yield put(
      addRoomFailure(
        error.response?.data?.message || "Không thể thêm phòng chiếu mới"
      )
    );
  }
}

// Update room saga
export function* updateRoomSaga(
  action: UpdateRoomAction
): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;

    // Create the updated room DTO with cinemaId as string
    const roomRequest = {
      name: data.name,
      capacity: data.capacity,
      type: data.type,
      status: data.status,
      cinemaId: data.cinemaId ? data.cinemaId.toString() : undefined, // Convert to string if defined
    };

    // Use PUT endpoint with the ID in the URL
    yield call(axiosInstance.put, `/api/rooms/${id}`, roomRequest);

    // Create a success response to update UI immediately
    yield put(
      updateRoomSuccess({
        id: id,
        name: data.name || "",
        capacity: data.capacity || 0,
        type: data.type || "",
        status: data.status || "ACTIVE",
        cinemaId: data.cinemaId,
        isActive: data.status === "ACTIVE",
      })
    );

    // Also refresh the list to get updated data with cinema objects
    yield put(getAdminRoomListRequest(undefined));

    notificationUtils.success({
      message: "Thành công",
      description: "Cập nhật phòng chiếu thành công",
    });
  } catch (error: any) {
    yield put(
      updateRoomFailure(
        error.response?.data?.message || "Không thể cập nhật phòng chiếu"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể cập nhật phòng chiếu",
    });
  }
}

// Delete room saga
export function* deleteRoomSaga(
  action: DeleteRoomAction
): Generator<any, void, any> {
  try {
    const id = action.payload;
    // Delete endpoint is already correct
    yield call(axiosInstance.delete, `/api/rooms/${id}`);
    yield put(deleteRoomSuccess(id));
    notificationUtils.success({
      message: "Thành công",
      description: "Xóa phòng chiếu thành công",
    });
  } catch (error: any) {
    yield put(
      deleteRoomFailure(
        error.response?.data?.message || "Không thể xóa phòng chiếu"
      )
    );
  }
}

// Bulk delete rooms saga
export function* bulkDeleteRoomsSaga(
  action: BulkDeleteRoomsAction
): Generator<any, void, any> {
  try {
    const ids = action.payload;
    // Make multiple delete requests
    yield all(ids.map((id) => call(axiosInstance.delete, `/api/rooms/${id}`)));
    yield put(bulkDeleteRoomsSuccess(ids));
    notificationUtils.success({
      message: "Thành công",
      description: `Đã xóa ${ids.length} phòng chiếu`,
    });
  } catch (error: any) {
    yield put(
      bulkDeleteRoomsFailure(
        error.response?.data?.message || "Không thể xóa phòng chiếu hàng loạt"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể xóa phòng chiếu hàng loạt",
    });
  }
}

// Bulk update status saga
export function* bulkUpdateStatusSaga(
  action: BulkUpdateStatusAction
): Generator<any, void, any> {
  try {
    const { ids, status } = action.payload;

    // Update each room's status separately
    yield all(
      ids.map((id) => {
        const updateData = {
          status: status,
        };
        return call(axiosInstance.put, `/api/rooms/${id}`, updateData);
      })
    );

    yield put(bulkUpdateRoomStatusSuccess(action.payload));
    notificationUtils.success({
      message: "Thành công",
      description: `Đã cập nhật trạng thái cho ${ids.length} phòng chiếu`,
    });
  } catch (error: any) {
    yield put(
      bulkUpdateRoomStatusFailure(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái phòng chiếu hàng loạt"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể cập nhật trạng thái phòng chiếu hàng loạt",
    });
  }
}

// Root room saga
export default function* roomSaga() {
  yield takeEvery(getRoomListRequest.type, getRoomListSaga);
  yield takeEvery(getRoomDetailRequest.type, getRoomDetailSaga);
  yield takeEvery(getAdminRoomListRequest.type, getAdminRoomListSaga);
  yield takeEvery(addRoomRequest.type, addRoomSaga);
  yield takeEvery(updateRoomRequest.type, updateRoomSaga);
  yield takeEvery(deleteRoomRequest.type, deleteRoomSaga);
  yield takeEvery(bulkDeleteRoomsRequest.type, bulkDeleteRoomsSaga);
  yield takeEvery(bulkUpdateRoomStatusRequest.type, bulkUpdateStatusSaga);
}
