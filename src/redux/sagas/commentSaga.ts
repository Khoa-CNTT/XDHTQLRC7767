import { takeEvery, put, call } from "redux-saga/effects";
import {
  getUnapprovedCommentsRequest,
  getUnapprovedCommentsSuccess,
  getUnapprovedCommentsFailure,
  getMovieCommentsRequest,
  getMovieCommentsSuccess,
  getMovieCommentsFailure,
  getSentimentStatsRequest,
  getSentimentStatsSuccess,
  getSentimentStatsFailure,
  approveCommentRequest,
  approveCommentSuccess,
  approveCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
  Comment,
  SentimentStatistics,
} from "../slices/commentSlice";
import axiosInstance from "../../utils/axiosConfig";
import { message } from "antd";
import { AxiosResponse } from "axios";

// Interfaces for action types
interface GetMovieCommentsAction {
  type: string;
  payload: {
    movieId: number;
  };
}

interface ApproveCommentAction {
  type: string;
  payload: {
    id: number;
  };
}

// Fetch unapproved comments
export function* getUnapprovedCommentsSaga(): Generator<
  unknown,
  void,
  AxiosResponse<Comment[]>
> {
  try {
    const response = yield call(axiosInstance.get, "/api/comments/unapproved");
    yield put(getUnapprovedCommentsSuccess(response.data));
  } catch (error: unknown) {
    const err = error as Error;
    yield put(
      getUnapprovedCommentsFailure(
        err.message || "Không thể tải bình luận chờ duyệt"
      )
    );
    message.error("Không thể tải bình luận chờ duyệt");
  }
}

// Fetch comments by movie for admin
export function* getMovieCommentsSaga(
  action: GetMovieCommentsAction
): Generator<unknown, void, AxiosResponse<Comment[]>> {
  try {
    const { movieId } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `/api/comments/admin/commentsByMovie?movieId=${movieId}`
    );
    yield put(getMovieCommentsSuccess(response.data));
  } catch (error: unknown) {
    const err = error as Error;
    yield put(
      getMovieCommentsFailure(err.message || "Không thể tải bình luận của phim")
    );
    message.error("Không thể tải bình luận của phim");
  }
}

// Fetch sentiment statistics by movie
export function* getSentimentStatsSaga(
  action: GetMovieCommentsAction
): Generator<unknown, void, AxiosResponse<SentimentStatistics>> {
  try {
    const { movieId } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `/api/comments/sentimentStatistics?movieId=${movieId}`
    );
    yield put(getSentimentStatsSuccess(response.data));
  } catch (error: unknown) {
    const err = error as Error;
    yield put(
      getSentimentStatsFailure(err.message || "Không thể tải thống kê cảm xúc")
    );
    message.error("Không thể tải thống kê cảm xúc");
  }
}

// Approve a comment
export function* approveCommentSaga(
  action: ApproveCommentAction
): Generator<unknown, void, AxiosResponse<void>> {
  try {
    const { id } = action.payload;
    yield call(axiosInstance.post, `/api/comments/approve/${id}`);
    yield put(approveCommentSuccess({ id }));
    message.success("Đã duyệt bình luận thành công");
  } catch (error: unknown) {
    const err = error as Error;
    yield put(
      approveCommentFailure(err.message || "Không thể duyệt bình luận")
    );
    message.error("Không thể duyệt bình luận");
  }
}

// Delete a comment
export function* deleteCommentSaga(
  action: ApproveCommentAction
): Generator<unknown, void, AxiosResponse<void>> {
  try {
    const { id } = action.payload;
    yield call(axiosInstance.delete, `/api/comments/${id}`);
    yield put(deleteCommentSuccess({ id }));
    message.success("Đã xóa bình luận thành công");
  } catch (error: unknown) {
    const err = error as Error;
    yield put(deleteCommentFailure(err.message || "Không thể xóa bình luận"));
    message.error("Không thể xóa bình luận");
  }
}

// Root comment saga
export default function* commentSaga() {
  yield takeEvery(getUnapprovedCommentsRequest.type, getUnapprovedCommentsSaga);
  yield takeEvery(getMovieCommentsRequest.type, getMovieCommentsSaga);
  yield takeEvery(getSentimentStatsRequest.type, getSentimentStatsSaga);
  yield takeEvery(approveCommentRequest.type, approveCommentSaga);
  yield takeEvery(deleteCommentRequest.type, deleteCommentSaga);
}
