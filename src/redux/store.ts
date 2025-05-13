import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";
import cinemaReducer from "./slices/cinemaSlice";
import rootSaga from "./sagas/index";
import roomReducer from "./slices/room.slice";
import showtimeReducer from "./slices/showtimeSlice";
import promotionReducer from "./slices/promotionSlice";
import paymentReducer from "./slices/paymentSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    cinema: cinemaReducer,
    room: roomReducer,
    showtime: showtimeReducer,
    promotion: promotionReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
