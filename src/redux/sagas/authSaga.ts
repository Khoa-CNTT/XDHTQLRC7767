import { takeEvery, put, call } from "redux-saga/effects";
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
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
} from "../slices/authSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { LoginPayload, authService } from "../../services/authService";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";

// API calls
const api = {
  register: (data: RegisterPayload) => axiosInstance.post("/signup", data),
  updateUser: (data: Partial<User>) =>
    axiosInstance.put("/api/customers/update-customer", data),
  changePassword: (data: ChangePasswordPayload) =>
    axiosInstance.post("/change-password", data),
  forgotPassword: (email: string) =>
    axiosInstance.post(`/forgot-password?email=${encodeURIComponent(email)}`),
  login: (data: LoginPayload) => axiosInstance.post("/authenticate", data),
  resetPassword: (data: { token: string; newPassword: string }) =>
    axiosInstance.post("/save-new-password", {
      token: data.token,
      newPassword: data.newPassword,
    }),
};

// Get user info saga
function* getUserInfoSaga(): Generator<any, void, any> {
  try {
    const userInfo = yield call(authService.getInfoUser);

    // Make sure the user has a role, default to "User" for regular users
    const userWithRole = {
      ...userInfo,
      role: userInfo.role || "User",
    };

    yield put(getUserInfoSuccess(userWithRole));
  } catch (error: any) {
    const errorMessage =
      error.response?.data || "Lấy thông tin người dùng thất bại";
    yield put(getUserInfoFailure(errorMessage));
  }
}

// Register saga
function* registerSaga(
  action: PayloadAction<RegisterPayload>
): Generator<any, void, any> {
  try {
    const result = yield call(api.register, action.payload);
    yield put(registerSuccess(result.data));
    notificationUtils.registerSuccess();
    window.location.href = "/verify-email";
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
    yield put(registerFailure(errorMessage));
    notificationUtils.registerError(errorMessage);
  }
}

// Login saga
function* loginSaga(
  action: PayloadAction<LoginPayload>
): Generator<any, void, any> {
  try {
    const response = yield call(api.login, action.payload);
    if (response.data) {
      localStorage.setItem("token", response.data);
      const userInfo = yield call(authService.getInfoUser);

      // Make sure the user has a role, default to "User" for regular users
      const userWithRole = {
        ...userInfo,
        // Kiểm tra role trong account.role nếu nó tồn tại
        role: action.payload.isUserLogin
          ? "User"
          : userInfo.account?.role || userInfo.role || "User",
      };

      yield put(
        loginSuccess({
          token: response.data,
          user: userWithRole,
        })
      );
    } else {
      throw new Error("Token không hợp lệ");
    }
  } catch (error: any) {
    localStorage.removeItem("token");
    const errorMessage = error.response?.data || "Đăng nhập thất bại";
    // Kiểm tra nếu tài khoản chưa verify
    if (errorMessage === "Account is not verified") {
      // Lưu email vào localStorage để hiển thị trên trang verify
      localStorage.setItem("pendingVerificationEmail", action.payload.username);
      yield put(loginFailure(errorMessage));
      // Chuyển hướng đến trang verify email
      window.location.href = "/verify-email";
      return;
    }

    yield put(loginFailure(errorMessage));
  }
}

// Update user saga
function* updateUserSaga(
  action: PayloadAction<Partial<User>>
): Generator<any, void, any> {
  try {
    const result = yield call(api.updateUser, action.payload);
    yield put(updateUserSuccess(result.data));
    notificationUtils.updateProfileSuccess();
  } catch (error: any) {
    yield put(
      updateUserFailure(
        error.response?.data?.message || "Cập nhật thông tin thất bại"
      )
    );
    notificationUtils.updateProfileError(error.response?.data?.message);
  }
}

// Change password saga
function* changePasswordSaga(
  action: PayloadAction<ChangePasswordPayload>
): Generator<any, void, any> {
  try {
    yield call(api.changePassword, action.payload);
    yield put(changePasswordSuccess());
    notificationUtils.successMessage("Thành công", "Mật khẩu đã được thay đổi");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Đổi mật khẩu thất bại";
    yield put(changePasswordFailure(errorMessage));
    notificationUtils.errorMessage("Thất bại", errorMessage);
  }
}

// Forgot password saga
function* forgotPasswordSaga(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    yield call(api.forgotPassword, action.payload);
    yield put(forgotPasswordSuccess());
    notificationUtils.successMessage(
      "Thành công",
      "Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "Không thể gửi yêu cầu khôi phục mật khẩu";
    yield put(forgotPasswordFailure(errorMessage));
    notificationUtils.errorMessage("Thất bại", errorMessage);
  }
}

// Reset password saga
function* resetPasswordSaga(
  action: PayloadAction<{ token: string; newPassword: string }>
): Generator<any, void, any> {
  try {
    yield call(api.resetPassword, action.payload);
    yield put(resetPasswordSuccess());
    notificationUtils.successMessage(
      "Thành công",
      "Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại."
    );
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Không thể đặt lại mật khẩu";
    yield put(resetPasswordFailure(errorMessage));
  }
}

// Logout saga
function* logoutSaga(): Generator<any, void, any> {
  try {
    yield call(authService.logout);
  } catch (error) {
    console.error("Logout error:", error);
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
  yield takeEvery(resetPasswordStart.type, resetPasswordSaga);
  yield takeEvery(logout.type, logoutSaga);
}
