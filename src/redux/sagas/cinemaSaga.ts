import { takeEvery, put, call } from "redux-saga/effects";
import {
  getCinemaListRequest,
  getCinemaListSuccess,
  getCinemaListFailure,
  getMockShowtimeFailure,
  getMockShowtimeRequest,
  getMockShowtimeSuccess,
  getInfoBookingRequest,
  getInfoBookingSuccess,
  getInfoBookingFailure,
} from "../slices/cinemaSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";

interface GetMovieDetailAction {
  type: string;
  payload: {
    id: number;
  };
}
interface GetShowTime {
  type: string;
  payload: {
    date: string;
    cinemaId: string;
    movieId: string;
  };
}

export function* getCinemaListSaga(
  action: GetMovieDetailAction
): Generator<any, void, any> {
  try {
    const response = yield call(axiosInstance.get, `/api/cinema/list-cinemas`);
    yield put(
      getCinemaListSuccess({
        data: response.data,
      }) as any
    );
  } catch (e) {
    yield put(getCinemaListFailure("Lỗi khi lấy thông tin đặt vé") as any);
  }
}

export function* getMockShowtimeSaga(
  action: GetShowTime
): Generator<any, void, any> {
  try {
    const { date, cinemaId, movieId } = action.payload;

    const response = yield call(axiosInstance.get, `/api/showtime`, {
      params: {
        date,
        cinema_id: cinemaId,
        id_movies: movieId,
      },
    });

    yield put(
      getMockShowtimeSuccess({
        data: response?.data,
      }) as any
    );
  } catch (e) {
    yield put(getMockShowtimeFailure("Lỗi khi lấy thông tin đặt vé") as any);
  }
}

export function* getBookingInfoSaga(
  action: GetMovieDetailAction
): Generator<any, void, any> {
  try {
    const { id } = action.payload;

    const response = yield call(axiosInstance.get, `/api/showtime/${id}`);

    yield put(
      getInfoBookingSuccess({
        data: response?.data,
      }) as any
    );
  } catch (e) {
    yield put(getInfoBookingFailure("Lỗi khi lấy thông tin đặt vé") as any);
  }
}

// Root auth saga
export default function* movieSaga() {
  yield takeEvery(getCinemaListRequest.type, getCinemaListSaga),
    yield takeEvery(getMockShowtimeRequest.type, getMockShowtimeSaga),
    yield takeEvery(getInfoBookingRequest.type, getBookingInfoSaga);
}
