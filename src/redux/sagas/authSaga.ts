import { takeEvery, put, call } from 'redux-saga/effects';
import {
    registerStart,
    registerSuccess,
    registerFailure,
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
    getUserInfoRequest,
    getUserInfoSuccess,
    getUserInfoFailure,
    User,
    RegisterPayload,
    ChangePasswordPayload,
} from '../slices/authSlice';
import { message } from 'antd';
import { PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload, authService } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';

// API calls
const api = {
    register: (data: RegisterPayload) =>
        axiosInstance.post('/signup', data),
    updateUser: (data: Partial<User>) =>
        axiosInstance.put('/update-profile', data),
    changePassword: (data: ChangePasswordPayload) =>
        axiosInstance.post('/change-password', data),
    forgotPassword: (email: string) =>
        axiosInstance.post(`/forgot-password?email=${encodeURIComponent(email)}`),
    login: (data: LoginPayload) =>
        axiosInstance.post('/authenticate', data),
};

// Get user info saga
function* getUserInfoSaga(): Generator<any, void, any> {
    try {
        const response = yield call(authService.getInfoUser);
        yield put(getUserInfoSuccess(response));
    } catch (error: any) {
        yield put(getUserInfoFailure(error.response?.data?.message || 'Không thể lấy thông tin người dùng'));
        message.error('Không thể lấy thông tin người dùng');
    }
}

// Register saga
function* registerSaga(action: PayloadAction<RegisterPayload>): Generator<any, void, any> {
    try {
        message.loading({ content: 'Đang xử lý đăng ký...', key: 'register' });
        const result = yield call(api.register, action.payload);
        yield put(registerSuccess(result.data));
        message.success({
            content: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
            key: 'register',
            duration: 5
        });
        window.location.href = '/verify-email';
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
        yield put(registerFailure(errorMessage));
        message.error({
            content: errorMessage,
            key: 'register',
            duration: 3
        });
    }
}

// Login saga
function* loginSaga(action: PayloadAction<LoginPayload>): Generator<any, void, any> {
    try {
        const response = yield call(api.login, action.payload);
        if (response.data) {
            // Lưu token vào localStorage và cập nhật header
            localStorage.setItem('token', response.data);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;

            // Lấy thông tin user
            const userInfo = yield call(authService.getInfoUser);

            yield put(loginSuccess({
                token: response.data,
                user: userInfo
            }));
            message.success('Đăng nhập thành công!');
        } else {
            throw new Error('Token không hợp lệ');
        }
    } catch (error: any) {
        yield put(loginFailure(error.response?.data?.message || 'Đăng nhập thất bại'));
        message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
}

// Update user saga
function* updateUserSaga(action: PayloadAction<Partial<User>>): Generator<any, void, any> {
    try {
        const result = yield call(api.updateUser, action.payload);
        yield put(updateUserSuccess(result.data));
        message.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
        yield put(updateUserFailure(error.response?.data?.message || 'Cập nhật thông tin thất bại'));
        message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
}

// Change password saga
function* changePasswordSaga(action: PayloadAction<ChangePasswordPayload>): Generator<any, void, any> {
    try {
        yield call(api.changePassword, action.payload);
        yield put(changePasswordSuccess());
        message.success('Đổi mật khẩu thành công!');
    } catch (error: any) {
        yield put(changePasswordFailure(error.response?.data?.message || 'Đổi mật khẩu thất bại'));
        message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
}

// Forgot password saga
function* forgotPasswordSaga(action: PayloadAction<string>): Generator<any, void, any> {
    try {
        message.loading({ content: 'Đang xử lý yêu cầu...', key: 'forgotPassword' });
        yield call(api.forgotPassword, action.payload);
        yield put(forgotPasswordSuccess());
        message.success({
            content: 'Đã gửi email khôi phục mật khẩu!',
            key: 'forgotPassword',
            duration: 5
        });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Không thể gửi yêu cầu khôi phục mật khẩu';
        yield put(forgotPasswordFailure(errorMessage));
        message.error({
            content: errorMessage,
            key: 'forgotPassword',
            duration: 3
        });
    }
}

// Logout saga
function* logoutSaga(): Generator<any, void, any> {
    try {
        yield call(authService.logout);
        message.success('Đã đăng xuất!');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Root auth saga
export default function* authSaga() {
    yield takeEvery(registerStart.type, registerSaga);
    yield takeEvery(loginRequest.type, loginSaga);
    yield takeEvery(getUserInfoRequest.type, getUserInfoSaga);
    yield takeEvery(updateUserStart.type, updateUserSaga);
    yield takeEvery(changePasswordStart.type, changePasswordSaga);
    yield takeEvery(forgotPasswordStart.type, forgotPasswordSaga);
    yield takeEvery(logout.type, logoutSaga);
}