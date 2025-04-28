import { takeEvery, put, call } from 'redux-saga/effects';
import {
    getShowtimeListRequest,
    getShowtimeListSuccess,
    getShowtimeListFailure,
    createShowtimeRequest,
    createShowtimeSuccess,
    createShowtimeFailure,
    ShowListDTO
} from '../slices/showtimeSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import { notificationUtils } from '../../utils/notificationConfig';

// Lấy danh sách lịch chiếu
function* getShowtimeListSaga(): Generator<any, void, any> {
    try {
        const response = yield call(axiosInstance.get, '/api/showtime');
        yield put(getShowtimeListSuccess(response.data));
    } catch (error: any) {
        yield put(getShowtimeListFailure(error.response?.data?.message || 'Không thể lấy danh sách lịch chiếu'));
        notificationUtils.error({
            message: 'Lỗi',
            description: 'Không thể lấy danh sách lịch chiếu'
        });
    }
}

// Tạo lịch chiếu mới
function* createShowtimeSaga(action: PayloadAction<ShowListDTO>): Generator<any, void, any> {
    try {
        const response = yield call(axiosInstance.post, '/api/showtime', action.payload);
        yield put(createShowtimeSuccess(response.data));
        notificationUtils.success({
            message: 'Thành công',
            description: 'Tạo lịch chiếu mới thành công'
        });
    } catch (error: any) {
        yield put(createShowtimeFailure(error.response?.data?.message || 'Không thể tạo lịch chiếu mới'));
        notificationUtils.error({
            message: 'Lỗi',
            description: error.response?.data?.message || 'Không thể tạo lịch chiếu mới'
        });
    }
}

// Saga gốc
export default function* showtimeSaga() {
    yield takeEvery(getShowtimeListRequest.type, getShowtimeListSaga);
    yield takeEvery(createShowtimeRequest.type, createShowtimeSaga);
} 