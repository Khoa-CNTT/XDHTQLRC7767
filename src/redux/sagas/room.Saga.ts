import { takeEvery, put, call } from 'redux-saga/effects';
import {
    getRoomListSuccess,
    getRoomListFailure,
    getRoomListRequest,
} from '../slices/room.slice';
import axiosInstance from '../../utils/axiosConfig';

interface GetRoomListlAction {
    type: string;
    payload: {
        id: number;
    };
}

export function* getRoomListSaga(action: GetRoomListlAction): Generator<any, void, any> {
    try {
        const { id } = action.payload;
        const response = yield call(axiosInstance.get, `/api/rooms/${id}`);
        yield put(
            getRoomListSuccess({
                data: response.data,
            })
        );
    } catch (e) {
        yield put(
            getRoomListFailure({
                error: 'Lỗi khi lấy chi tiết phòng',
            })
        );
    }
}

// Root auth saga
export default function* roomSaga() {
    yield takeEvery(getRoomListRequest, getRoomListSaga);
}