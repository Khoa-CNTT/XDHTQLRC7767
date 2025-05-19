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
  customerCount: {
    data: number;
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
  enableCustomer: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  updateCustomer: {
    loading: boolean;
    error: string | null;
    success: boolean;
    data: Customer | null;
  };
}

// Initial state
const initialState: CustomerState = {
  customerList: {
    data: [],
    loading: false,
    error: null,
  },
  customerCount: {
    data: 0,
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
  enableCustomer: {
    loading: false,
    error: null,
    success: false,
  },
  updateCustomer: {
    loading: false,
    error: null,
    success: false,
    data: null,
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

    // Get customer count
    getCustomerCountRequest: (state) => {
      state.customerCount.loading = true;
      state.customerCount.error = null;
    },
    getCustomerCountSuccess: (state, action: PayloadAction<number>) => {
      state.customerCount.loading = false;
      state.customerCount.data = action.payload;
    },
    getCustomerCountFailure: (state, action: PayloadAction<string>) => {
      state.customerCount.loading = false;
      state.customerCount.error = action.payload;
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

    // Enable customer account
    enableCustomerRequest: {
      reducer: (state) => {
        state.enableCustomer.loading = true;
        state.enableCustomer.error = null;
        state.enableCustomer.success = false;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    enableCustomerSuccess: (state, action: PayloadAction<number>) => {
      state.enableCustomer.loading = false;
      state.enableCustomer.success = true;
      // Update the customer status in the list
      state.customerList.data = state.customerList.data.map((customer) =>
        customer.id === action.payload
          ? { ...customer, isEnable: true }
          : customer
      );
    },
    enableCustomerFailure: (state, action: PayloadAction<string>) => {
      state.enableCustomer.loading = false;
      state.enableCustomer.error = action.payload;
      state.enableCustomer.success = false;
    },

    // Update customer
    updateCustomerRequest: {
      reducer: (state) => {
        state.updateCustomer.loading = true;
        state.updateCustomer.error = null;
        state.updateCustomer.success = false;
      },
      prepare: (customer: Customer) => ({ payload: customer }),
    },
    updateCustomerSuccess: (state, action: PayloadAction<Customer>) => {
      state.updateCustomer.loading = false;
      state.updateCustomer.success = true;
      state.updateCustomer.data = action.payload;
      // Update the customer in the list
      state.customerList.data = state.customerList.data.map((customer) =>
        customer.id === action.payload.id ? action.payload : customer
      );
    },
    updateCustomerFailure: (state, action: PayloadAction<string>) => {
      state.updateCustomer.loading = false;
      state.updateCustomer.error = action.payload;
      state.updateCustomer.success = false;
    },

    // Reset states
    resetCustomerState: (state) => {
      state.deleteCustomer.loading = false;
      state.deleteCustomer.error = null;
      state.deleteCustomer.success = false;
      state.disableCustomer.loading = false;
      state.disableCustomer.error = null;
      state.disableCustomer.success = false;
      state.enableCustomer.loading = false;
      state.enableCustomer.error = null;
      state.enableCustomer.success = false;
      state.updateCustomer.loading = false;
      state.updateCustomer.error = null;
      state.updateCustomer.success = false;
    },
  },
});

// Export actions
export const {
  getCustomerListRequest,
  getCustomerListSuccess,
  getCustomerListFailure,
  getCustomerCountRequest,
  getCustomerCountSuccess,
  getCustomerCountFailure,
  deleteCustomerRequest,
  deleteCustomerSuccess,
  deleteCustomerFailure,
  disableCustomerRequest,
  disableCustomerSuccess,
  disableCustomerFailure,
  enableCustomerRequest,
  enableCustomerSuccess,
  enableCustomerFailure,
  updateCustomerRequest,
  updateCustomerSuccess,
  updateCustomerFailure,
  resetCustomerState,
} = customerSlice.actions;

// Export reducer
export default customerSlice.reducer;
