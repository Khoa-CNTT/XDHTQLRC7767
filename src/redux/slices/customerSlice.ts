import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Customer interface based on CustomerDTO from Java backend
export interface Customer {
  id: number;
  fullName: string;
  gender: boolean;
  email: string;
  phoneNumber: string;
  address: string;
  cardId: string;
  username: string;
  isDelete: boolean;
  isEnable: boolean;
}

// State interface for customer management
export interface CustomerState {
  customerList: {
    data: Customer[];
    loading: boolean;
    error: string | null;
  };
  deleteCustomer: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  disableCustomer: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

// Initial state
const initialState: CustomerState = {
  customerList: {
    data: [],
    loading: false,
    error: null,
  },
  deleteCustomer: {
    loading: false,
    error: null,
    success: false,
  },
  disableCustomer: {
    loading: false,
    error: null,
    success: false,
  },
};

// Create the customer slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // Get all customers
    getCustomerListRequest: (state) => {
      state.customerList.loading = true;
      state.customerList.error = null;
    },
    getCustomerListSuccess: (state, action: PayloadAction<Customer[]>) => {
      state.customerList.loading = false;
      state.customerList.data = action.payload;
    },
    getCustomerListFailure: (state, action: PayloadAction<string>) => {
      state.customerList.loading = false;
      state.customerList.error = action.payload;
    },

    // Delete customer
    deleteCustomerRequest: {
      reducer: (state) => {
        state.deleteCustomer.loading = true;
        state.deleteCustomer.error = null;
        state.deleteCustomer.success = false;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    deleteCustomerSuccess: (state, action: PayloadAction<number>) => {
      state.deleteCustomer.loading = false;
      state.deleteCustomer.success = true;
      state.customerList.data = state.customerList.data.filter(
        (customer) => customer.id !== action.payload
      );
    },
    deleteCustomerFailure: (state, action: PayloadAction<string>) => {
      state.deleteCustomer.loading = false;
      state.deleteCustomer.error = action.payload;
      state.deleteCustomer.success = false;
    },

    // Disable customer account
    disableCustomerRequest: {
      reducer: (state) => {
        state.disableCustomer.loading = true;
        state.disableCustomer.error = null;
        state.disableCustomer.success = false;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    disableCustomerSuccess: (state, action: PayloadAction<number>) => {
      state.disableCustomer.loading = false;
      state.disableCustomer.success = true;
      // Update the customer status in the list
      state.customerList.data = state.customerList.data.map((customer) =>
        customer.id === action.payload
          ? { ...customer, isEnable: false }
          : customer
      );
    },
    disableCustomerFailure: (state, action: PayloadAction<string>) => {
      state.disableCustomer.loading = false;
      state.disableCustomer.error = action.payload;
      state.disableCustomer.success = false;
    },

    // Reset states
    resetCustomerState: (state) => {
      state.deleteCustomer.loading = false;
      state.deleteCustomer.error = null;
      state.deleteCustomer.success = false;
      state.disableCustomer.loading = false;
      state.disableCustomer.error = null;
      state.disableCustomer.success = false;
    },
  },
});

// Export actions
export const {
  getCustomerListRequest,
  getCustomerListSuccess,
  getCustomerListFailure,
  deleteCustomerRequest,
  deleteCustomerSuccess,
  deleteCustomerFailure,
  disableCustomerRequest,
  disableCustomerSuccess,
  disableCustomerFailure,
  resetCustomerState,
} = customerSlice.actions;

// Export reducer
export default customerSlice.reducer;
