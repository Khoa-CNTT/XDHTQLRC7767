import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TicketRequestDTO, TicketResponseDTO } from "../../utils/ticketService";

// Define the ticket state structure
interface TicketState {
  createTicket: {
    data: TicketResponseDTO | null;
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  ticketDetails: {
    data: any | null;
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
};

// Create the ticket slice
const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    // Create ticket actions
    createTicketRequest: (state, action: PayloadAction<TicketRequestDTO>) => {
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
    getTicketByIdRequest: (state, action: PayloadAction<number>) => {
      state.ticketDetails.loading = true;
      state.ticketDetails.error = null;
    },
    getTicketByIdSuccess: (state, action: PayloadAction<any>) => {
      state.ticketDetails.loading = false;
      state.ticketDetails.data = action.payload;
    },
    getTicketByIdFailure: (state, action: PayloadAction<string>) => {
      state.ticketDetails.loading = false;
      state.ticketDetails.error = action.payload;
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
  resetCreateTicketState,
} = ticketSlice.actions;

// Export reducer
export default ticketSlice.reducer;
