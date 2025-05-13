import { takeEvery, put, call } from "redux-saga/effects";
import {
  getShowtimeListRequest,
  getShowtimeListSuccess,
  getShowtimeListFailure,
  createShowtimeRequest,
  createShowtimeSuccess,
  createShowtimeFailure,
  ShowListDTO,
  getShowtimeWithChairsRequest,
  getShowtimeWithChairsSuccess,
  getShowtimeWithChairsFailure,
} from "../slices/showtimeSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";

interface ShowtimeParams {
  date?: string;
  cinemaId?: number;
  movieId?: number;
}

// Lấy danh sách lịch chiếu
function* getShowtimeListSaga(
  action?: PayloadAction<ShowtimeParams>
): Generator<any, void, any> {
  try {
    const params = action?.payload || {};
    let url = "/api/showtime";

    // Add query parameters if they exist
    const urlParams = new URLSearchParams();
    if (params.date) urlParams.append("date", params.date);
    if (params.cinemaId)
      urlParams.append("cinema_id", params.cinemaId.toString());
    if (params.movieId)
      urlParams.append("id_movies", params.movieId.toString());

    const queryString = urlParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = yield call(axiosInstance.get, url);
    yield put(getShowtimeListSuccess(response.data));
  } catch (error: any) {
    yield put(
      getShowtimeListFailure(
        error.response?.data?.message || "Không thể lấy danh sách lịch chiếu"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách lịch chiếu",
    });
  }
}

// Lấy showtime với danh sách ghế
function* getShowtimeWithChairsSaga(
  action: PayloadAction<{ id: number }>
): Generator<any, void, any> {
  try {
    const { id } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `/api/showtime/${id}/with-chairs`
    );
    yield put(getShowtimeWithChairsSuccess(response.data));
  } catch (error: any) {
    yield put(
      getShowtimeWithChairsFailure(
        error.response?.data?.message || "Không thể lấy thông tin ghế ngồi"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy thông tin ghế ngồi",
    });
  }
}

// Tạo lịch chiếu mới
function* createShowtimeSaga(
  action: PayloadAction<ShowListDTO>
): Generator<any, void, any> {
  try {
    const response = yield call(
      axiosInstance.post,
      "/api/showtime",
      action.payload
    );
    yield put(createShowtimeSuccess(response.data));
    notificationUtils.success({
      message: "Thành công",
      description: "Tạo lịch chiếu mới thành công",
    });
  } catch (error: any) {
    yield put(
      createShowtimeFailure(
        error.response?.data?.message || "Không thể tạo lịch chiếu mới"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description:
        error.response?.data?.message || "Không thể tạo lịch chiếu mới",
    });
  }
}

// Saga gốc
export default function* showtimeSaga() {
  yield takeEvery(getShowtimeListRequest.type, getShowtimeListSaga);
  yield takeEvery(createShowtimeRequest.type, createShowtimeSaga);
  yield takeEvery(getShowtimeWithChairsRequest.type, getShowtimeWithChairsSaga);
}
