import { fork, all } from "redux-saga/effects";
import authSaga from "./authSaga";
import movieSaga from "./movieSaga";
import cinemaSaga from "./cinemaSaga";
import roomSaga from "./room.Saga";
import showtimeSaga from "./showtimeSaga";
import promotionSaga from "./promotionSaga";
import paymentSaga from "./paymentSaga";
import ticketSaga from "./ticketSaga";
import customerSaga from "./customerSaga";
import staffSaga from "./staffSaga";

export default function* rootSaga() {
  console.log("[ROOT_SAGA] Initializing all sagas");

  try {
    yield all([
      fork(authSaga),
      fork(movieSaga),
      fork(cinemaSaga),
      fork(roomSaga),
      fork(showtimeSaga),
      fork(promotionSaga),
      fork(paymentSaga),
      fork(ticketSaga),
      fork(customerSaga),
      fork(staffSaga),
    ]);
    console.log("[ROOT_SAGA] All sagas have been started successfully");
  } catch (error) {
    console.error("[ROOT_SAGA] Error starting sagas:", error);
  }
}
