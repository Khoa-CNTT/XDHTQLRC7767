import { takeEvery, put, call } from 'redux-saga/effects';
import {
    getMovieListRequest,
    getMovieListSuccess,
    getMovieListFailure,
    getMovieDetailRequest,
    getMovieDetailSuccess,
    getMovieDetailFailure,
    getBookingRequest,
    getBookingSuccess,
    getBookingFailure,
    getNowShowingMoviesRequest,
    getNowShowingMoviesSuccess,
    getNowShowingMoviesFailure,
    getUpcomingMoviesRequest,
    getUpcomingMoviesSuccess,
    getUpcomingMoviesFailure,
    getCommentsRequest,
    getCommentsSuccess,
    getCommentsFailure,
    addCommentRequest,
    addCommentSuccess,
    addCommentFailure,
    CommentDto
} from '../slices/movieSlice';
import axiosInstance from '../../utils/axiosConfig';
import { notificationUtils } from '../../utils/notificationConfig';

interface GetMovieDetailAction {
    type: string;
    payload: {
        id: number;
    };
}

interface GetCommentsAction {
    type: string;
    payload: {
        movieId: number;
        userId?: number;
    };
}

interface AddCommentAction {
    type: string;
    payload: CommentDto;
}

// Get user info saga
function* getMovieListSaga(): Generator<any, void, any> {
    try {
        const response = yield axiosInstance.get('/api/movies');
        yield put(getMovieListSuccess(response.data));
    } catch (error: any) {
        yield put(getMovieListFailure(error.response?.data?.message || 'Không thể lấy thông tin người dùng'));
    }
}

export function* getMovieDetailSaga(action: GetMovieDetailAction): Generator<any, void, any> {
    try {
        const { id } = action.payload;
        const response = yield call(axiosInstance.get, `/api/movies/detail/${id}`);
        yield put(
            getMovieDetailSuccess({
                data: response.data,
            })
        );
    } catch (e) {
        yield put(
            getMovieDetailFailure({
                error: 'Lỗi khi lấy chi tiết phim',
            })
        );
    }
}

export function* getBookingSaga(action: GetMovieDetailAction): Generator<any, void, any> {
    try {
        const { id } = action.payload;
        const response = yield call(axiosInstance.get, `/api/movies/booking/${id}`);
        yield put(
            getBookingSuccess({
                data: response.data,
            })
        );
    } catch (e) {
        yield put(
            getBookingFailure({
                error: 'Lỗi khi lấy thông tin đặt vé',
            })
        );
    }
}

// Lấy danh sách phim đang chiếu
export function* getNowShowingMoviesSaga(): Generator<any, void, any> {
    try {
        const response = yield call(axiosInstance.get, '/api/movies/now-showing');
        yield put(getNowShowingMoviesSuccess(response.data));
    } catch (error: any) {
        yield put(getNowShowingMoviesFailure(error.response?.data?.message || 'Không thể lấy danh sách phim đang chiếu'));
        notificationUtils.error({
            message: 'Lỗi',
            description: 'Không thể lấy danh sách phim đang chiếu'
        });
    }
}

// Lấy danh sách phim sắp chiếu
export function* getUpcomingMoviesSaga(): Generator<any, void, any> {
    try {
        const response = yield call(axiosInstance.get, '/api/movies/upcoming');
        yield put(getUpcomingMoviesSuccess(response.data));
    } catch (error: any) {
        yield put(getUpcomingMoviesFailure(error.response?.data?.message || 'Không thể lấy danh sách phim sắp chiếu'));
        notificationUtils.error({
            message: 'Lỗi',
            description: 'Không thể lấy danh sách phim sắp chiếu'
        });
    }
}

// Lấy bình luận cho một bộ phim
export function* getCommentsSaga(action: GetCommentsAction): Generator<any, void, any> {
    try {
        const { movieId, userId } = action.payload;
        const url = `/api/comments/commentByMovieAndUser?movieId=${movieId}${userId ? `&userId=${userId}` : ''}`;
        const response = yield call(axiosInstance.get, url);
        yield put(getCommentsSuccess(response.data));
    } catch (error: any) {
        yield put(getCommentsFailure(error.response?.data?.message || 'Không thể lấy bình luận'));
        notificationUtils.error({
            message: 'Lỗi',
            description: 'Không thể lấy bình luận cho bộ phim này'
        });
    }
}

// Thêm bình luận mới
export function* addCommentSaga(action: AddCommentAction): Generator<any, void, any> {
    try {
        const response = yield call(axiosInstance.post, '/api/comments', action.payload);
        yield put(addCommentSuccess(response.data));
        notificationUtils.success({
            message: 'Thành công',
            description: 'Đã gửi bình luận của bạn'
        });
    } catch (error: any) {
        yield put(addCommentFailure(error.response?.data?.message || 'Không thể thêm bình luận'));
        notificationUtils.error({
            message: 'Lỗi',
            description: 'Không thể gửi bình luận. Vui lòng thử lại sau.'
        });
    }
}

// Root auth saga
export default function* movieSaga() {
    yield takeEvery(getMovieListRequest.type, getMovieListSaga);
    yield takeEvery(getMovieDetailRequest.type, getMovieDetailSaga);
    yield takeEvery(getBookingRequest.type, getBookingSaga);
    yield takeEvery(getNowShowingMoviesRequest.type, getNowShowingMoviesSaga);
    yield takeEvery(getUpcomingMoviesRequest.type, getUpcomingMoviesSaga);
    yield takeEvery(getCommentsRequest.type, getCommentsSaga);
    yield takeEvery(addCommentRequest.type, addCommentSaga);
}