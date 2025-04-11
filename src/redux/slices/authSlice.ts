import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload } from '../../services/authService';

export interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    avatar?: string;
    address?: string;
    birthday?: string;
    points: number;
    isVerified?: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
    verificationCode: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
    verificationCode: null,
};

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Register actions
        registerStart: (state, action: PayloadAction<RegisterPayload>) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action: PayloadAction<{ user: User; verificationCode: string }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.verificationCode = action.payload.verificationCode;
        },
        registerFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get user info actions
        getUserInfoRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        getUserInfoSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        getUserInfoFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },

        // Login actions
        loginRequest: (state, action: PayloadAction<LoginPayload>) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Update user actions
        updateUserStart: (state, action: PayloadAction<Partial<User>>) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        },
        updateUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Change password actions
        changePasswordStart: (state, action: PayloadAction<ChangePasswordPayload>) => {
            state.loading = true;
            state.error = null;
        },
        changePasswordSuccess: (state) => {
            state.loading = false;
        },
        changePasswordFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Forgot password actions
        forgotPasswordStart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.error = null;
        },
        forgotPasswordSuccess: (state) => {
            state.loading = false;
        },
        forgotPasswordFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Logout action
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
});

export const {
    registerStart,
    registerSuccess,
    registerFailure,
    getUserInfoRequest,
    getUserInfoSuccess,
    getUserInfoFailure,
    loginRequest,
    loginSuccess,
    loginFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    changePasswordStart,
    changePasswordSuccess,
    changePasswordFailure,
    forgotPasswordStart,
    forgotPasswordSuccess,
    forgotPasswordFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer; 