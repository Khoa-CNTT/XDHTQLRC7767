import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TicketResponseDTO, TicketHistoryDTO } from "../../utils/ticketService";

// Define the ticket state structure
interface TicketState {
  createTicket: {
    data: TicketResponseDTO | null;
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  ticketDetails: {
    data: TicketResponseDTO | null;
    loading: boolean;
    error: string | null;
  };
  ticketHistory: {
    data: TicketHistoryDTO[] | null;
    loading: boolean;
    error: string | null;
  };
}

// Initial state
const initialState: TicketState = {
  createTicket: {
    data: null,
    loading: false,
    error: null,
    success: false,
  },
  ticketDetails: {
    data: null,
    loading: false,
    error: null,
  },
  ticketHistory: {
    data: null,
    loading: false,
    error: null,
  },
};

// Create the ticket slice
const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    // Create ticket actions
    createTicketRequest: (state) => {
      state.createTicket.loading = true;
      state.createTicket.error = null;
      state.createTicket.success = false;
    },
    createTicketSuccess: (state, action: PayloadAction<TicketResponseDTO>) => {
      state.createTicket.loading = false;
      state.createTicket.data = action.payload;
      state.createTicket.success = true;
    },
    createTicketFailure: (state, action: PayloadAction<string>) => {
      state.createTicket.loading = false;
      state.createTicket.error = action.payload;
      state.createTicket.success = false;
    },

    // Get ticket by ID actions
    getTicketByIdRequest: (state) => {
      state.ticketDetails.loading = true;
      state.ticketDetails.error = null;
    },
    getTicketByIdSuccess: (state, action: PayloadAction<TicketResponseDTO>) => {
      state.ticketDetails.loading = false;
      state.ticketDetails.data = action.payload;
    },
    getTicketByIdFailure: (state, action: PayloadAction<string>) => {
      state.ticketDetails.loading = false;
      state.ticketDetails.error = action.payload;
    },

    // Get tickets by customer ID actions
    getTicketHistoryRequest: (state) => {
      state.ticketHistory.loading = true;
      state.ticketHistory.error = null;
    },
    getTicketHistorySuccess: (
      state,
      action: PayloadAction<TicketHistoryDTO[]>
    ) => {
      state.ticketHistory.loading = false;
      state.ticketHistory.data = action.payload;
    },
    getTicketHistoryFailure: (state, action: PayloadAction<string>) => {
      state.ticketHistory.loading = false;
      state.ticketHistory.error = action.payload;
    },

    // Reset create ticket state
    resetCreateTicketState: (state) => {
      state.createTicket.data = null;
      state.createTicket.loading = false;
      state.createTicket.error = null;
      state.createTicket.success = false;
    },
  },
});

// Export actions
export const {
  createTicketRequest,
  createTicketSuccess,
  createTicketFailure,
  getTicketByIdRequest,
  getTicketByIdSuccess,
  getTicketByIdFailure,
  getTicketHistoryRequest,
  getTicketHistorySuccess,
  getTicketHistoryFailure,
  resetCreateTicketState,
} = ticketSlice.actions;

// Export reducer
export default ticketSlice.reducer;
