import { takeEvery, put, call, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  createTicketRequest,
  createTicketSuccess,
  createTicketFailure,
  getTicketByIdRequest,
  getTicketByIdSuccess,
  getTicketByIdFailure,
  getTicketHistoryRequest,
  getTicketHistorySuccess,
  getTicketHistoryFailure,
} from "../slices/ticketSlice";
import {
  ticketService,
  TicketRequestDTO,
  TicketResponseDTO,
  TicketHistoryDTO,
} from "../../utils/ticketService";
import { notificationUtils } from "../../utils/notificationConfig";

// Ghi log action type để debug
if (typeof ticketService !== "undefined") {
  ticketService.logTicketRequestType(createTicketRequest.type);
}

// Saga for creating tickets
function* createTicketSaga(
  action: PayloadAction<TicketRequestDTO>
): Generator<any, void, any> {
  try {
    console.log("===== TICKET CREATION =====");
    console.log("Request Data:", JSON.stringify(action.payload, null, 2));
    console.log("Chair IDs:", action.payload.chairIds);
    console.log(
      "Chair IDs Type:",
      typeof action.payload.chairIds,
      Array.isArray(action.payload.chairIds)
    );
    console.log("===========================");

    // Call the API to create tickets - ensure correct binding of the method
    const response: TicketResponseDTO = yield call(
      [ticketService, ticketService.createTickets],
      action.payload
    );

    // Dispatch success action with the response
    yield put(createTicketSuccess(response));

    // Show success notification
    notificationUtils.success({
      message: "Đặt vé thành công",
      description: "Vé của bạn đã được tạo thành công!",
    });
  } catch (error: any) {
    console.error("❌ TICKET CREATION ERROR ❌");
    console.error("Error:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }

    console.error("Request Payload:", JSON.stringify(action.payload, null, 2));
    console.error("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌");

    // Dispatch failure action with error message
    yield put(
      createTicketFailure(
        error.message || "Đã xảy ra lỗi khi tạo vé. Vui lòng thử lại."
      )
    );
  }
}

// Saga for getting ticket by ID
function* getTicketByIdSaga(
  action: PayloadAction<number>
): Generator<any, void, any> {
  try {
    const ticketId = action.payload;

    // Call the API to get ticket by ID
    const response: any = yield call(ticketService.getTicketById, ticketId);

    // Dispatch success action with the response
    yield put(getTicketByIdSuccess(response));
  } catch (error: any) {
    console.error("Error fetching ticket:", error);

    // Dispatch failure action with error message
    yield put(
      getTicketByIdFailure(
        error.message || "Đã xảy ra lỗi khi lấy thông tin vé."
      )
    );
  }
}

// Saga for getting tickets by customer ID
function* getTicketHistorySaga(
  action: PayloadAction<number>
): Generator<any, void, any> {
  try {
    const customerId = action.payload;

    // Call the API to get tickets by customer ID
    const response: TicketHistoryDTO[] = yield call(
      [ticketService, ticketService.getTicketsByCustomerId],
      customerId
    );

    // Dispatch success action with the response
    yield put(getTicketHistorySuccess(response));
  } catch (error: any) {
    console.error("Error fetching ticket history:", error);

    // Dispatch failure action with error message
    yield put(
      getTicketHistoryFailure(
        error.message || "Đã xảy ra lỗi khi lấy lịch sử đặt vé."
      )
    );
  }
}

// Root ticket saga
export default function* ticketSaga() {
  // Manual listener for createTicketRequest action
  try {
    const createTicketType = createTicketRequest.type;
    const getTicketByIdType = getTicketByIdRequest.type;
    const getTicketHistoryType = getTicketHistoryRequest.type;

    yield all([
      takeEvery(createTicketType, createTicketSaga),
      takeEvery(getTicketByIdType, getTicketByIdSaga),
      takeEvery(getTicketHistoryType, getTicketHistorySaga),
    ]);

    console.log("[TICKET_SAGA] Watcher setup complete");
  } catch (error) {
    console.error("[TICKET_SAGA] Error in watcher setup:", error);
  }
}
