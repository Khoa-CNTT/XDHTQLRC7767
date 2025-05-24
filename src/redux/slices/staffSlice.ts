import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define Position interface to match backend model
interface Position {
  id?: string;
  name?: string;
}

// Define the Employee interface
export interface Employee {
  id?: number;
  fullName: string;
  image?: string;
  gender?: boolean;
  birthday?: string | Date;
  email: string;
  phoneNumber: string;
  address?: string;
  cardId?: string;
  position?: string | Position;
  positionId?: string;
  department?: string;
  isDelete?: boolean;
  isActivated?: boolean;
  username?: string;
  role?: string;
}

// Define the RegisterEmployeeRequest interface to match RegisterEmployeeRq DTO
export interface RegisterEmployeeRequest {
  fullName: string;
  image?: string;
  gender?: boolean;
  birthday?: string | Date;
  email: string;
  phoneNumber: string;
  address?: string;
  cardId?: string;
  position?: Position;
  positionId?: string;
  department?: string;
  username: string;
  password: string;
  role: string;
}

// Define filter parameters
export interface EmployeeFilterParams {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

// Define state structure
export interface StaffState {
  employeeList: {
    data: Employee[];
    loading: boolean;
    error: string | null;
  };
  employeeDetail: {
    data: Employee | null;
    loading: boolean;
    error: string | null;
  };
  addEmployee: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  updateEmployee: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  deleteEmployee: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

// Initial state
const initialState: StaffState = {
  employeeList: {
    data: [],
    loading: false,
    error: null,
  },
  employeeDetail: {
    data: null,
    loading: false,
    error: null,
  },
  addEmployee: {
    loading: false,
    error: null,
    success: false,
  },
  updateEmployee: {
    loading: false,
    error: null,
    success: false,
  },
  deleteEmployee: {
    loading: false,
    error: null,
    success: false,
  },
};

// Create staff slice
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    // Get all employees
    getEmployeeListRequest: {
      reducer: (state) => {
        state.employeeList.loading = true;
        state.employeeList.error = null;
      },
      prepare: (payload?: EmployeeFilterParams) => ({ payload }),
    },
    getEmployeeListSuccess: (state, action: PayloadAction<Employee[]>) => {
      state.employeeList.loading = false;
      state.employeeList.data = action.payload;
    },
    getEmployeeListFailure: (state, action: PayloadAction<string>) => {
      state.employeeList.loading = false;
      state.employeeList.error = action.payload;
    },

    // Get employee by ID
    getEmployeeDetailRequest: {
      reducer: (state) => {
        state.employeeDetail.loading = true;
        state.employeeDetail.error = null;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    getEmployeeDetailSuccess: (state, action: PayloadAction<Employee>) => {
      state.employeeDetail.loading = false;
      state.employeeDetail.data = action.payload;
    },
    getEmployeeDetailFailure: (state, action: PayloadAction<string>) => {
      state.employeeDetail.loading = false;
      state.employeeDetail.error = action.payload;
    },

    // Add new employee
    addEmployeeRequest: {
      reducer: (state) => {
        state.addEmployee.loading = true;
        state.addEmployee.error = null;
        state.addEmployee.success = false;
      },
      prepare: (employee: RegisterEmployeeRequest) => ({ payload: employee }),
    },
    addEmployeeSuccess: (state) => {
      state.addEmployee.loading = false;
      state.addEmployee.success = true;
    },
    addEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.addEmployee.loading = false;
      state.addEmployee.error = action.payload;
      state.addEmployee.success = false;
    },

    // Update employee
    updateEmployeeRequest: {
      reducer: (state) => {
        state.updateEmployee.loading = true;
        state.updateEmployee.error = null;
        state.updateEmployee.success = false;
      },
      prepare: (id: number, data: RegisterEmployeeRequest) => ({
        payload: { id, data },
      }),
    },
    updateEmployeeSuccess: (state) => {
      state.updateEmployee.loading = false;
      state.updateEmployee.success = true;
    },
    updateEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.updateEmployee.loading = false;
      state.updateEmployee.error = action.payload;
      state.updateEmployee.success = false;
    },

    // Delete employee
    deleteEmployeeRequest: {
      reducer: (state) => {
        state.deleteEmployee.loading = true;
        state.deleteEmployee.error = null;
        state.deleteEmployee.success = false;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    deleteEmployeeSuccess: (state) => {
      state.deleteEmployee.loading = false;
      state.deleteEmployee.success = true;
    },
    deleteEmployeeFailure: (state, action: PayloadAction<string>) => {
      state.deleteEmployee.loading = false;
      state.deleteEmployee.error = action.payload;
      state.deleteEmployee.success = false;
    },

    // Reset states
    resetEmployeeState: (state) => {
      state.addEmployee.loading = false;
      state.addEmployee.error = null;
      state.addEmployee.success = false;
      state.updateEmployee.loading = false;
      state.updateEmployee.error = null;
      state.updateEmployee.success = false;
      state.deleteEmployee.loading = false;
      state.deleteEmployee.error = null;
      state.deleteEmployee.success = false;
    },
  },
});

// Export actions
export const {
  getEmployeeListRequest,
  getEmployeeListSuccess,
  getEmployeeListFailure,
  getEmployeeDetailRequest,
  getEmployeeDetailSuccess,
  getEmployeeDetailFailure,
  addEmployeeRequest,
  addEmployeeSuccess,
  addEmployeeFailure,
  updateEmployeeRequest,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeRequest,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  resetEmployeeState,
} = staffSlice.actions;

// Export reducer
export default staffSlice.reducer;
