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

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    userInfo: {
        loading: boolean;
        error: string | null;
    };
    login: {
        loading: boolean;
        error: string | null;
    };
    register: {
        loading: boolean;
        error: string | null;
        verificationCode: string | null;
    };
    changePassword: {
        loading: boolean;
        error: string | null;
        isSuccess: boolean;
    };
    updateProfile: {
        loading: boolean;
        error: string | null;
    };
    forgotPassword: {
        loading: boolean;
        error: string | null;
    };
    resetPassword: {
        loading: boolean;
        error: string | null;
        isSuccess: boolean;
    };
    activeTab: string;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    userInfo: {
        loading: false,
        error: null,
    },
    login: {
        loading: false,
        error: null,
    },
    register: {
        loading: false,
        error: null,
        verificationCode: null,
    },
    changePassword: {
        loading: false,
        error: null,
        isSuccess: false,
    },
    updateProfile: {
        loading: false,
        error: null,
    },
    forgotPassword: {
        loading: false,
        error: null,
    },
    resetPassword: {
        loading: false,
        error: null,
        isSuccess: false,
    },
    activeTab: "1"
};

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Register actions
        registerStart: (state, action: PayloadAction<RegisterPayload>) => {
            state.register.loading = true;
            state.register.error = null;
        },
        registerSuccess: (state, action: PayloadAction<{ user: User; verificationCode: string }>) => {
            state.register.loading = false;
            state.user = action.payload.user;
            state.register.verificationCode = action.payload.verificationCode;
        },
        registerFailure: (state, action: PayloadAction<string>) => {
            state.register.loading = false;
            state.register.error = action.payload;
        },

        // Get user info actions
        getUserInfoRequest: (state) => {
            state.userInfo.loading = true;
            state.userInfo.error = null;
        },
        getUserInfoSuccess: (state, action: PayloadAction<User>) => {
            state.userInfo.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.userInfo.error = null;
        },
        getUserInfoFailure: (state, action: PayloadAction<string>) => {
            state.userInfo.loading = false;
            state.userInfo.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },

        // Login actions
        loginRequest: (state, action: PayloadAction<LoginPayload>) => {
            state.login.loading = true;
            state.login.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.login.loading = false;
            state.login.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.login.loading = false;
            state.login.error = action.payload;
        },

        // Update user actions
        updateUserStart: (state, action: PayloadAction<Partial<User>>) => {
            state.updateProfile.loading = true;
            state.updateProfile.error = null;
        },
        updateUserSuccess: (state, action: PayloadAction<User>) => {
            state.updateProfile.loading = false;
            state.user = action.payload;
        },
        updateUserFailure: (state, action: PayloadAction<string>) => {
            state.updateProfile.loading = false;
            state.updateProfile.error = action.payload;
        },

        // Change password actions
        changePasswordStart: (state, action: PayloadAction<ChangePasswordPayload>) => {
            state.changePassword.loading = true;
            state.changePassword.error = null;
            state.changePassword.isSuccess = false;
        },
        changePasswordSuccess: (state) => {
            state.changePassword.loading = false;
            state.changePassword.error = null;
            state.changePassword.isSuccess = true;
        },
        changePasswordFailure: (state, action: PayloadAction<string>) => {
            state.changePassword.loading = false;
            state.changePassword.error = action.payload;
            state.changePassword.isSuccess = false;
        },

        // Forgot password actions
        forgotPasswordStart: (state, action: PayloadAction<string>) => {
            state.forgotPassword.loading = true;
            state.forgotPassword.error = null;
        },
        forgotPasswordSuccess: (state) => {
            state.forgotPassword.loading = false;
        },
        forgotPasswordFailure: (state, action: PayloadAction<string>) => {
            state.forgotPassword.loading = false;
            state.forgotPassword.error = action.payload;
        },

        // Reset password actions
        resetPasswordStart: (state, action: PayloadAction<{ token: string; newPassword: string }>) => {
            state.resetPassword.loading = true;
            state.resetPassword.error = null;
            state.resetPassword.isSuccess = false;
        },
        resetPasswordSuccess: (state) => {
            state.resetPassword.loading = false;
            state.resetPassword.error = null;
            state.resetPassword.isSuccess = true;
        },
        resetPasswordFailure: (state, action: PayloadAction<string>) => {
            state.resetPassword.loading = false;
            state.resetPassword.error = action.payload;
            state.resetPassword.isSuccess = false;
        },

        // Set active tab action
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
            state.changePassword.isSuccess = false;
        },

        // Logout action
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.userInfo.loading = false;
            state.userInfo.error = null;
            state.activeTab = "1";
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
    resetPasswordStart,
    resetPasswordSuccess,
    resetPasswordFailure,
    logout,
    setActiveTab,
} = authSlice.actions;

export default authSlice.reducer; 