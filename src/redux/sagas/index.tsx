import { fork } from "redux-saga/effects";
import authSaga from "./authSaga";
import movieSaga from "./movieSaga";
import cinemaSaga from "./cinemaSaga";
import roomSaga from "./room.Saga";
import showtimeSaga from "./showtimeSaga";
import promotionSaga from "./promotionSaga";
import paymentSaga from "./paymentSaga";

export default function* rootSaga() {
  yield fork(authSaga);
  yield fork(movieSaga);
  yield fork(cinemaSaga);
  yield fork(roomSaga);
  yield fork(showtimeSaga);
  yield fork(promotionSaga);
  yield fork(paymentSaga);
}
