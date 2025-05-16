import { takeEvery, put, call } from "redux-saga/effects";
import {
  getCustomerListRequest,
  getCustomerListSuccess,
  getCustomerListFailure,
  deleteCustomerRequest,
  deleteCustomerSuccess,
  deleteCustomerFailure,
  disableCustomerRequest,
  disableCustomerSuccess,
  disableCustomerFailure,
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
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách khách hàng",
    });
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
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể xóa khách hàng",
    });
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
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể vô hiệu hóa tài khoản khách hàng",
    });
  }
}

// Root customer saga
export default function* customerSaga() {
  yield takeEvery(getCustomerListRequest.type, getCustomerListSaga);
  yield takeEvery(deleteCustomerRequest.type, deleteCustomerSaga);
  yield takeEvery(disableCustomerRequest.type, disableCustomerSaga);
}
