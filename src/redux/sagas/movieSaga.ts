import { takeEvery, put, call, all } from "redux-saga/effects";
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
  getShowTimesRequest,
  getShowTimesSuccess,
  getShowTimesFailure,
  ShowtimeParams,
  getCommentsRequest,
  getCommentsSuccess,
  getCommentsFailure,
  addCommentRequest,
  addCommentSuccess,
  addCommentFailure,
  CommentDto,
  // Admin movie management actions
  getAdminMovieListRequest,
  getAdminMovieListSuccess,
  getAdminMovieListFailure,
  addMovieRequest,
  addMovieSuccess,
  addMovieFailure,
  updateMovieRequest,
  updateMovieSuccess,
  updateMovieFailure,
  deleteMovieRequest,
  deleteMovieSuccess,
  deleteMovieFailure,
  bulkDeleteMoviesRequest,
  bulkDeleteMoviesSuccess,
  bulkDeleteMoviesFailure,
  bulkUpdateStatusRequest,
  bulkUpdateStatusSuccess,
  bulkUpdateStatusFailure,
  MovieFilterParams,
  Movie,
} from "../slices/movieSlice";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";

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

// Admin movie management actions
interface GetAdminMovieListAction {
  type: string;
  payload?: MovieFilterParams;
}

interface AddMovieAction {
  type: string;
  payload: Omit<Movie, "id">;
}

interface UpdateMovieAction {
  type: string;
  payload: {
    id: number;
    data: Partial<Movie>;
  };
}

interface DeleteMovieAction {
  type: string;
  payload: number;
}

interface BulkDeleteMoviesAction {
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

interface GetShowTimesAction {
  type: string;
  payload: ShowtimeParams;
}

// Get user info saga
function* getMovieListSaga(): Generator<any, void, any> {
  try {
    const response = yield axiosInstance.get("/api/movies");
    yield put(getMovieListSuccess(response.data));
  } catch (error: any) {
    yield put(
      getMovieListFailure(
        error.response?.data?.message || "Không thể lấy thông tin người dùng"
      )
    );
  }
}

export function* getMovieDetailSaga(
  action: GetMovieDetailAction
): Generator<any, void, any> {
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
        error: "Lỗi khi lấy chi tiết phim",
      })
    );
  }
}

export function* getBookingSaga(
  action: GetMovieDetailAction
): Generator<any, void, any> {
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
        error: "Lỗi khi lấy thông tin đặt vé",
      })
    );
  }
}

// Lấy danh sách phim đang chiếu
export function* getNowShowingMoviesSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axiosInstance.get, "/api/movies/now-showing");
    yield put(getNowShowingMoviesSuccess(response.data));
  } catch (error: any) {
    yield put(
      getNowShowingMoviesFailure(
        error.response?.data?.message ||
          "Không thể lấy danh sách phim đang chiếu"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách phim đang chiếu",
    });
  }
}

// Lấy danh sách phim sắp chiếu
export function* getUpcomingMoviesSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axiosInstance.get, "/api/movies/upcoming");
    yield put(getUpcomingMoviesSuccess(response.data));
  } catch (error: any) {
    yield put(
      getUpcomingMoviesFailure(
        error.response?.data?.message ||
          "Không thể lấy danh sách phim sắp chiếu"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách phim sắp chiếu",
    });
  }
}

// Lấy bình luận cho một bộ phim
export function* getCommentsSaga(
  action: GetCommentsAction
): Generator<any, void, any> {
  try {
    const { movieId, userId } = action.payload;
    const url = `/api/comments/commentByMovieAndUser?movieId=${movieId}${
      userId ? `&userId=${userId}` : ""
    }`;
    const response = yield call(axiosInstance.get, url);
    yield put(getCommentsSuccess(response.data));
  } catch (error: any) {
    yield put(
      getCommentsFailure(
        error.response?.data?.message || "Không thể lấy bình luận"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy bình luận cho bộ phim này",
    });
  }
}

// Thêm bình luận mới
export function* addCommentSaga(
  action: AddCommentAction
): Generator<any, void, any> {
  try {
    const response = yield call(
      axiosInstance.post,
      "/api/comments",
      action.payload
    );
    yield put(addCommentSuccess(response.data));
    notificationUtils.success({
      message: "Thành công",
      description: "Đã gửi bình luận của bạn",
    });
  } catch (error: any) {
    yield put(
      addCommentFailure(
        error.response?.data?.message || "Không thể thêm bình luận"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể gửi bình luận. Vui lòng thử lại sau.",
    });
  }
}

// Admin movie list saga
export function* getAdminMovieListSaga(
  action: GetAdminMovieListAction
): Generator<any, void, any> {
  try {
    const filterParams = action.payload;
    let url = "/api/movies";

    if (filterParams) {
      const params = new URLSearchParams();

      if (filterParams.name) params.append("name", filterParams.name);
      if (filterParams.director)
        params.append("director", filterParams.director);
      if (filterParams.actor) params.append("actor", filterParams.actor);
      if (filterParams.genreName)
        params.append("genreName", filterParams.genreName);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = yield call(axiosInstance.get, url);

    // Transform backend data to match frontend Movie interface
    const movies = response.data.map((movie: any) => ({
      id: movie.id,
      title: movie.name,
      director: movie.director || "",
      releaseDate:
        movie.releaseDate ||
        (movie.releaseYear ? `${movie.releaseYear}-01-01` : undefined),
      duration: movie.duration || 0,
      genre: movie.movieGenres?.map((g: any) => g.name) || [],
      status: movie.status || 1,
      poster: movie.imageUrl || "https://via.placeholder.com/150x225",
      backdrop: movie.backdrop || "",
      description: movie.description || "",
      rating: movie.rating || 0,
      actor: movie.actor || "",
      country: movie.country || "",
      language: movie.language || "",
      subtitle: movie.subtitle || "",
      ageLimit: movie.ageLimit || 0,
      content: movie.content || "",
    }));

    yield put(getAdminMovieListSuccess(movies));
  } catch (error: any) {
    yield put(
      getAdminMovieListFailure(
        error.response?.data?.message || "Không thể lấy danh sách phim"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách phim",
    });
  }
}

// Add movie saga
export function* addMovieSaga(
  action: AddMovieAction
): Generator<any, void, any> {
  try {
    const movie = action.payload;

    // Get genres mapping from the API
    const genresResponse = yield call(axiosInstance.get, "/api/genres");
    const genresMapping = genresResponse.data.reduce((acc: any, genre: any) => {
      acc[genre.name] = genre.id;
      return acc;
    }, {});

    // Map genre names to IDs
    const genreIds =
      movie.genre
        ?.map((genreName) => genresMapping[genreName] || null)
        .filter((id) => id !== null) || [];

    // Extract year from releaseDate, or use the full date if available
    const releaseYear = movie.releaseDate
      ? parseInt(movie.releaseDate.substring(0, 4))
      : new Date().getFullYear();

    // Transform frontend Movie interface to backend MovieRequestDTO
    const movieRequest = {
      name: movie.title,
      description: movie.description || "",
      imageUrl: movie.poster || "",
      backdrop: movie.backdrop || "",
      director: movie.director || "",
      actor: movie.actor || "",
      duration: movie.duration || 0,
      releaseYear: releaseYear, // Keep releaseYear as it's required by the backend
      releaseDate: movie.releaseDate || "", // Also include full releaseDate
      rating: movie.rating || 0,
      country: movie.country || "",
      language: movie.language || "",
      subtitle: movie.subtitle || "",
      ageLimit: movie.ageLimit || 0,
      content: movie.content || "",
      genreIds: genreIds,
      status: movie.status || 1,
    };

    const response = yield call(
      axiosInstance.post,
      "/api/movies",
      movieRequest
    );

    // Transform response to frontend Movie format
    // Prioritize the full releaseDate if available, otherwise create from releaseYear
    const newMovie = {
      id: response.data.id,
      title: response.data.name,
      director: response.data.director || "",
      releaseDate:
        response.data.releaseDate ||
        (response.data.releaseYear
          ? `${response.data.releaseYear}-01-01`
          : undefined),
      duration: response.data.duration || 0,
      genre: response.data.movieGenres?.map((g: any) => g.name) || [],
      status: response.data.status || 1,
      poster: response.data.imageUrl || "https://via.placeholder.com/150x225",
      backdrop: response.data.backdrop || "",
      description: response.data.description || "",
      rating: response.data.rating || 0,
      actor: response.data.actor || "",
      country: response.data.country || "",
      language: response.data.language || "",
      subtitle: response.data.subtitle || "",
      ageLimit: response.data.ageLimit || 0,
      content: response.data.content || "",
    };

    yield put(addMovieSuccess(newMovie));
    notificationUtils.success({
      message: "Thành công",
      description: "Thêm phim mới thành công",
    });
  } catch (error: any) {
    yield put(
      addMovieFailure(
        error.response?.data?.message || "Không thể thêm phim mới"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể thêm phim mới",
    });
  }
}

// Update movie saga
export function* updateMovieSaga(
  action: UpdateMovieAction
): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;

    // Get existing movie data
    const movieResponse = yield call(axiosInstance.get, `/api/movies/${id}`);
    const existingMovie = movieResponse.data;

    // Get genres mapping from the API
    const genresResponse = yield call(axiosInstance.get, "/api/genres");
    const genresMapping = genresResponse.data.reduce((acc: any, genre: any) => {
      acc[genre.name] = genre.id;
      return acc;
    }, {});

    // Map genre names to IDs if genre is provided in update data
    const genreIds = data.genre
      ? data.genre
          .map((genreName) => genresMapping[genreName] || null)
          .filter((id) => id !== null)
      : existingMovie.movieGenres?.map((g: any) => g.id) || [];

    // Extract year from releaseDate
    const releaseYear = data.releaseDate
      ? parseInt(data.releaseDate.substring(0, 4))
      : existingMovie.releaseYear;

    // Merge with updates
    const movieRequest = {
      id: id,
      name: data.title || existingMovie.name,
      description: data.description || existingMovie.description,
      imageUrl: data.poster || existingMovie.imageUrl,
      backdrop: data.backdrop || existingMovie.backdrop || "",
      director: data.director || existingMovie.director,
      actor: data.actor || existingMovie.actor || "",
      duration: data.duration || existingMovie.duration,
      releaseYear: releaseYear, // Keep releaseYear as it's required by the backend
      releaseDate: data.releaseDate || existingMovie.releaseDate || "", // Also include full releaseDate
      rating: data.rating !== undefined ? data.rating : existingMovie.rating,
      country: data.country || existingMovie.country || "",
      language: data.language || existingMovie.language || "",
      subtitle: data.subtitle || existingMovie.subtitle || "",
      ageLimit: data.ageLimit || existingMovie.ageLimit || 0,
      content: data.content || existingMovie.content || "",
      genreIds: genreIds,
      status: data.status || existingMovie.status || 1,
    };

    // Update the movie
    const response = yield call(
      axiosInstance.post,
      "/api/movies",
      movieRequest
    );

    // Transform response to frontend Movie format
    // Prioritize the full releaseDate if available, otherwise create from releaseYear
    const updatedMovie = {
      id: response.data.id,
      title: response.data.name,
      director: response.data.director || "",
      releaseDate:
        response.data.releaseDate ||
        (response.data.releaseYear
          ? `${response.data.releaseYear}-01-01`
          : undefined),
      duration: response.data.duration || 0,
      genre: response.data.movieGenres?.map((g: any) => g.name) || [],
      status: response.data.status || data.status || existingMovie.status || 1,
      poster: response.data.imageUrl || "https://via.placeholder.com/150x225",
      backdrop: response.data.backdrop || "",
      description: response.data.description || "",
      rating: response.data.rating || 0,
      actor: response.data.actor || "",
      country: response.data.country || "",
      language: response.data.language || "",
      subtitle: response.data.subtitle || "",
      ageLimit: response.data.ageLimit || 0,
      content: response.data.content || "",
    };

    yield put(updateMovieSuccess(updatedMovie));
    notificationUtils.success({
      message: "Thành công",
      description: "Cập nhật phim thành công",
    });
  } catch (error: any) {
    yield put(
      updateMovieFailure(
        error.response?.data?.message || "Không thể cập nhật phim"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể cập nhật phim",
    });
  }
}

// Delete movie saga
export function* deleteMovieSaga(
  action: DeleteMovieAction
): Generator<any, void, any> {
  try {
    const id = action.payload;
    yield call(axiosInstance.delete, `/api/movies/${id}`);
    yield put(deleteMovieSuccess(id));
    notificationUtils.success({
      message: "Thành công",
      description: "Xóa phim thành công",
    });
  } catch (error: any) {
    yield put(
      deleteMovieFailure(error.response?.data?.message || "Không thể xóa phim")
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể xóa phim",
    });
  }
}

// Bulk delete movies saga
export function* bulkDeleteMoviesSaga(
  action: BulkDeleteMoviesAction
): Generator<any, void, any> {
  try {
    const ids = action.payload;
    // Make multiple delete requests
    yield all(ids.map((id) => call(axiosInstance.delete, `/api/movies/${id}`)));
    yield put(bulkDeleteMoviesSuccess(ids));
    notificationUtils.success({
      message: "Thành công",
      description: `Đã xóa ${ids.length} phim`,
    });
  } catch (error: any) {
    yield put(
      bulkDeleteMoviesFailure(
        error.response?.data?.message || "Không thể xóa phim hàng loạt"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể xóa phim hàng loạt",
    });
  }
}

// Bulk update status saga
export function* bulkUpdateStatusSaga(
  action: BulkUpdateStatusAction
): Generator<any, void, any> {
  try {
    const { ids, status } = action.payload;

    // Get all movies to update
    const moviesData = yield all(
      ids.map((id) => call(axiosInstance.get, `/api/movies/${id}`))
    );

    // Update each movie with the new status
    yield all(
      moviesData.map((response: any) => {
        const movie = response.data;
        const updateData = {
          ...movie,
          status: status,
        };
        return call(axiosInstance.post, "/api/movies", updateData);
      })
    );

    yield put(bulkUpdateStatusSuccess(action.payload));
    notificationUtils.success({
      message: "Thành công",
      description: `Đã cập nhật trạng thái cho ${ids.length} phim`,
    });
  } catch (error: any) {
    yield put(
      bulkUpdateStatusFailure(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái phim hàng loạt"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể cập nhật trạng thái phim hàng loạt",
    });
  }
}

// Lấy lịch chiếu theo phim và ngày
export function* getShowTimesSaga(
  action: GetShowTimesAction
): Generator<any, void, any> {
  try {
    const { movieId, date } = action.payload;
    const response = yield call(
      axiosInstance.get,
      `/api/showtime/${movieId}/times`,
      {
        params: { date },
      }
    );

    // Chuẩn hóa dữ liệu response nếu cần
    let showtimes = response.data;

    // Kiểm tra xem response có format mới hay cũ
    // Format mới: có [{ name, address, showtimes: ["05:20", "04:00", "07:00"] }]
    // Format cũ: [{ cinema: { id, name, address }, showTimes: [{ id, startTime, ... }] }]

    // Kiểm tra nếu đã có định dạng đúng thì trả về nguyên bản
    yield put(getShowTimesSuccess(showtimes));
  } catch (error: any) {
    yield put(
      getShowTimesFailure(
        error.response?.data?.message || "Không thể lấy lịch chiếu phim"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy lịch chiếu phim cho ngày đã chọn",
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
  yield takeEvery(getShowTimesRequest.type, getShowTimesSaga);
  yield takeEvery(getCommentsRequest.type, getCommentsSaga);
  yield takeEvery(addCommentRequest.type, addCommentSaga);

  // Admin movie management
  yield takeEvery(getAdminMovieListRequest.type, getAdminMovieListSaga);
  yield takeEvery(addMovieRequest.type, addMovieSaga);
  yield takeEvery(updateMovieRequest.type, updateMovieSaga);
  yield takeEvery(deleteMovieRequest.type, deleteMovieSaga);
  yield takeEvery(bulkDeleteMoviesRequest.type, bulkDeleteMoviesSaga);
  yield takeEvery(bulkUpdateStatusRequest.type, bulkUpdateStatusSaga);
}
