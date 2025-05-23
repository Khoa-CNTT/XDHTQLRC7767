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
  searchShowtimesRequest,
  searchShowtimesSuccess,
  searchShowtimesFailure,
  ShowtimeParams,
} from "../slices/showtimeSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Lấy danh sách lịch chiếu
function* getShowtimeListSaga(
  action?: PayloadAction<ShowtimeParams>
): Generator<unknown, void, unknown> {
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
  } catch (error) {
    const err = error as AxiosError;
    yield put(
      getShowtimeListFailure(
        err.response?.data?.message || "Không thể lấy danh sách lịch chiếu"
      )
    );
  }
}

// Lấy showtime với danh sách ghế
function* getShowtimeWithChairsSaga(
  action: PayloadAction<{ id: number }>
): Generator<unknown, void, unknown> {
  try {
    const { id } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `/api/showtime/${id}/with-chairs`
    );
    yield put(getShowtimeWithChairsSuccess(response.data));
  } catch (error) {
    const err = error as AxiosError;
    yield put(
      getShowtimeWithChairsFailure(
        err.response?.data?.message || "Không thể lấy thông tin ghế ngồi"
      )
    );
  }
}

// Tạo lịch chiếu mới
function* createShowtimeSaga(
  action: PayloadAction<ShowListDTO>
): Generator<unknown, void, unknown> {
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
  } catch (error) {
    const err = error as AxiosError;
    yield put(
      createShowtimeFailure(
        err.response?.data?.message || "Không thể tạo lịch chiếu mới"
      )
    );
  }
}

// Tìm kiếm lịch chiếu
function* searchShowtimeSaga(
  action?: PayloadAction<ShowtimeParams>
): Generator<unknown, void, unknown> {
  try {
    const params = action?.payload || {};

    // Always use the search-showtime endpoint with params object
    const axiosParams: Record<string, string> = {};
    // Make sure to pass empty strings rather than undefined
    axiosParams.movieName = params.movieName || "";
    axiosParams.roomName = params.roomName || "";
    axiosParams.date = params.date || "";

    const response = yield call(
      axiosInstance.get,
      "/api/showtime/search-showtime",
      {
        params: axiosParams,
      }
    );
    yield put(searchShowtimesSuccess(response.data));
  } catch (error) {
    const err = error as AxiosError;
    yield put(
      searchShowtimesFailure(
        err.response?.data?.message || "Không thể tìm kiếm lịch chiếu"
      )
    );
  }
}

export default function* showtimeSaga() {
  yield takeEvery(getShowtimeListRequest.type, getShowtimeListSaga);
  yield takeEvery(createShowtimeRequest.type, createShowtimeSaga);
  yield takeEvery(getShowtimeWithChairsRequest.type, getShowtimeWithChairsSaga);
  yield takeEvery(searchShowtimesRequest.type, searchShowtimeSaga);
}
