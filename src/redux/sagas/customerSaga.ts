import { takeEvery, put, call } from "redux-saga/effects";
import {
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
  Customer,
} from "../slices/customerSlice";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";
import { AxiosResponse } from "axios";

// Action interfaces
interface DeleteCustomerAction {
  type: string;
  payload: number;
}

interface DisableCustomerAction {
  type: string;
  payload: number;
}

interface EnableCustomerAction {
  type: string;
  payload: number;
}

interface UpdateCustomerAction {
  type: string;
  payload: Customer;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Get all customers saga
function* getCustomerListSaga(): Generator<unknown, void, AxiosResponse> {
  try {
    const response = yield call(axiosInstance.get, "/api/customers");
    yield put(getCustomerListSuccess(response.data));
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(
      getCustomerListFailure(
        err.response?.data?.message || "Không thể lấy danh sách khách hàng"
      )
    );
  }
}

// Get customer count saga
function* getCustomerCountSaga(): Generator<unknown, void, AxiosResponse> {
  try {
    const response = yield call(axiosInstance.get, "/api/customers/sum");
    yield put(getCustomerCountSuccess(response.data));
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(
      getCustomerCountFailure(
        err.response?.data?.message || "Không thể lấy số lượng khách hàng"
      )
    );
    console.error("Không thể lấy số lượng khách hàng", error);
  }
}

// Delete customer saga
function* deleteCustomerSaga(
  action: DeleteCustomerAction
): Generator<unknown, void, AxiosResponse> {
  try {
    const id = action.payload;
    yield call(axiosInstance.delete, `/api/customers/${id}`);
    yield put(deleteCustomerSuccess(id));
    notificationUtils.success({
      message: "Thành công",
      description: "Xóa khách hàng thành công",
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(
      deleteCustomerFailure(
        err.response?.data?.message || "Không thể xóa khách hàng"
      )
    );
  }
}

// Disable customer account saga
function* disableCustomerSaga(
  action: DisableCustomerAction
): Generator<unknown, void, AxiosResponse> {
  try {
    const id = action.payload;
    yield call(axiosInstance.put, `/api/customers/${id}/disable`);
    yield put(disableCustomerSuccess(id));
    notificationUtils.success({
      message: "Thành công",
      description: "Vô hiệu hóa tài khoản khách hàng thành công",
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(
      disableCustomerFailure(
        err.response?.data?.message ||
          "Không thể vô hiệu hóa tài khoản khách hàng"
      )
    );
  }
}

// Enable customer account saga
function* enableCustomerSaga(
  action: EnableCustomerAction
): Generator<unknown, void, AxiosResponse> {
  try {
    const id = action.payload;
    yield call(axiosInstance.put, `/api/customers/${id}/enable`);
    yield put(enableCustomerSuccess(id));
    notificationUtils.success({
      message: "Thành công",
      description: "Kích hoạt tài khoản khách hàng thành công",
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(
      enableCustomerFailure(
        err.response?.data?.message ||
          "Không thể kích hoạt tài khoản khách hàng"
      )
    );
  }
}

// Update customer saga
function* updateCustomerSaga(
  action: UpdateCustomerAction
): Generator<unknown, void, AxiosResponse> {
  try {
    const customer = action.payload;
    const response = yield call(
      axiosInstance.put,
      "/api/customers/update-customer",
      customer
    );
    yield put(updateCustomerSuccess(response.data));
    notificationUtils.success({
      message: "Thành công",
      description: "Cập nhật thông tin khách hàng thành công",
    });
  } catch (error: unknown) {
    const err = error as ApiError;
    yield put(
      updateCustomerFailure(
        err.response?.data?.message || "Không thể cập nhật thông tin khách hàng"
      )
    );
    notificationUtils.error({
      message: "Cập nhật thất bại",
      description:
        err.response?.data?.message ||
        "Không thể cập nhật thông tin khách hàng",
    });
  }
}

// Root customer saga
export default function* customerSaga() {
  yield takeEvery(getCustomerListRequest.type, getCustomerListSaga);
  yield takeEvery(getCustomerCountRequest.type, getCustomerCountSaga);
  yield takeEvery(deleteCustomerRequest.type, deleteCustomerSaga);
  yield takeEvery(disableCustomerRequest.type, disableCustomerSaga);
  yield takeEvery(enableCustomerRequest.type, enableCustomerSaga);
  yield takeEvery(updateCustomerRequest.type, updateCustomerSaga);
}
