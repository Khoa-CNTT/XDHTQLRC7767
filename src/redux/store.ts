import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";
import cinemaReducer from "./slices/cinemaSlice";
import rootSaga from "./sagas/index";
import roomReducer from "./slices/room.slice";
import showtimeReducer from "./slices/showtimeSlice";
import paymentReducer from "./slices/paymentSlice";
import ticketReducer from "./slices/ticketSlice";
import customerReducer from "./slices/customerSlice";
import staffReducer from "./slices/staffSlice";
import commentReducer from "./slices/commentSlice";

const sagaMiddleware = createSagaMiddleware();

// Log middlewares để debug

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    cinema: cinemaReducer,
    room: roomReducer,
    showtime: showtimeReducer,
    payment: paymentReducer,
    ticket: ticketReducer,
    customer: customerReducer,
    staff: staffReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
