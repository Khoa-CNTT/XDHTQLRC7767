import { takeEvery, put, call } from "redux-saga/effects";
import {
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
  EmployeeFilterParams,
  RegisterEmployeeRequest,
} from "../slices/staffSlice";
import axiosInstance from "../../utils/axiosConfig";
import { notificationUtils } from "../../utils/notificationConfig";
import { AxiosResponse } from "axios";
import { SagaIterator } from "redux-saga";

// Action interfaces
interface GetEmployeeListAction {
  type: string;
  payload?: EmployeeFilterParams;
}

interface GetEmployeeDetailAction {
  type: string;
  payload: number;
}

interface AddEmployeeAction {
  type: string;
  payload: RegisterEmployeeRequest;
}

interface UpdateEmployeeAction {
  type: string;
  payload: {
    id: number;
    data: RegisterEmployeeRequest;
  };
}

interface DeleteEmployeeAction {
  type: string;
  payload: number;
}

// Error type
interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Get all employees saga
export function* getEmployeeListSaga(
  action: GetEmployeeListAction
): SagaIterator {
  try {
    const filterParams = action.payload;
    let url = "/api/employee";

    if (filterParams) {
      const params = new URLSearchParams();

      if (filterParams.fullName)
        params.append("fullName", filterParams.fullName);
      if (filterParams.email) params.append("email", filterParams.email);
      if (filterParams.phoneNumber)
        params.append("phoneNumber", filterParams.phoneNumber);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response: AxiosResponse = yield call(axiosInstance.get, url);
    yield put(getEmployeeListSuccess(response.data));
  } catch (error) {
    const apiError = error as ApiError;
    yield put(
      getEmployeeListFailure(
        apiError.response?.data?.message || "Không thể lấy danh sách nhân viên"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy danh sách nhân viên",
    });
  }
}

// Get employee detail saga
export function* getEmployeeDetailSaga(
  action: GetEmployeeDetailAction
): SagaIterator {
  try {
    const id = action.payload;
    const response: AxiosResponse = yield call(
      axiosInstance.get,
      `/api/employee/${id}`
    );
    yield put(getEmployeeDetailSuccess(response.data));
  } catch (error) {
    const apiError = error as ApiError;
    yield put(
      getEmployeeDetailFailure(
        apiError.response?.data?.message || "Không thể lấy thông tin nhân viên"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể lấy thông tin nhân viên",
    });
  }
}

// Add employee saga
export function* addEmployeeSaga(action: AddEmployeeAction): SagaIterator {
  try {
    yield call(axiosInstance.post, "/api/employee/register", action.payload);
    yield put(addEmployeeSuccess());
    notificationUtils.success({
      message: "Thành công",
      description: "Thêm nhân viên mới thành công",
    });

    // Refresh employee list after adding
    yield put(getEmployeeListRequest({}));
  } catch (error) {
    const apiError = error as ApiError;
    yield put(
      addEmployeeFailure(
        apiError.response?.data?.message || "Không thể thêm nhân viên mới"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description:
        apiError.response?.data?.message || "Không thể thêm nhân viên mới",
    });
  }
}

// Update employee saga
export function* updateEmployeeSaga(
  action: UpdateEmployeeAction
): SagaIterator {
  try {
    const { id, data } = action.payload;
    yield call(axiosInstance.put, `/api/employee/${id}`, data);
    yield put(updateEmployeeSuccess());
    notificationUtils.success({
      message: "Thành công",
      description: "Cập nhật thông tin nhân viên thành công",
    });

    // Refresh employee list after updating
    yield put(getEmployeeListRequest({}));
  } catch (error) {
    const apiError = error as ApiError;
    yield put(
      updateEmployeeFailure(
        apiError.response?.data?.message ||
          "Không thể cập nhật thông tin nhân viên"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể cập nhật thông tin nhân viên",
    });
  }
}

// Delete employee saga
export function* deleteEmployeeSaga(
  action: DeleteEmployeeAction
): SagaIterator {
  try {
    const id = action.payload;
    yield call(axiosInstance.delete, `/api/employee/${id}`);
    yield put(deleteEmployeeSuccess());
    notificationUtils.success({
      message: "Thành công",
      description: "Xóa nhân viên thành công",
    });

    // Refresh employee list after deleting
    yield put(getEmployeeListRequest({}));
  } catch (error) {
    const apiError = error as ApiError;
    yield put(
      deleteEmployeeFailure(
        apiError.response?.data?.message || "Không thể xóa nhân viên"
      )
    );
    notificationUtils.error({
      message: "Lỗi",
      description: "Không thể xóa nhân viên",
    });
  }
}

// Root staff saga
export default function* staffSaga() {
  yield takeEvery(getEmployeeListRequest.type, getEmployeeListSaga);
  yield takeEvery(getEmployeeDetailRequest.type, getEmployeeDetailSaga);
  yield takeEvery(addEmployeeRequest.type, addEmployeeSaga);
  yield takeEvery(updateEmployeeRequest.type, updateEmployeeSaga);
  yield takeEvery(deleteEmployeeRequest.type, deleteEmployeeSaga);
}
