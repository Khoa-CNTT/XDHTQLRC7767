import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
    getPromotionsRequest,
    getPromotionsSuccess,
    getPromotionsFailure
} from '../slices/promotionSlice';
import axiosInstance from '../../utils/axiosConfig';
import { notificationUtils } from '../../utils/notificationConfig';
import { RootState } from '../store';

interface GetPromotionsAction {
    type: string;
    payload: {
        title?: string;
        page?: number;
    };
}

// Define the expected promotion state structure for type safety
interface PromotionState {
    searchTitle: string;
    currentPage: number;
    promotions: {
        data: any;
        loading: boolean;
        error: string | null;
    };
}

function* getPromotionsSaga(action: GetPromotionsAction): Generator<any, void, any> {
    try {
        const response = yield call(
            axiosInstance.get,
            `/api/promotion`
        );

        yield put(getPromotionsSuccess(response.data));
    } catch (error: any) {
        yield put(getPromotionsFailure(error.response?.data?.message || 'Không thể lấy danh sách khuyến mãi'));
        notificationUtils.error({
            message: 'Lỗi',
            description: 'Không thể lấy danh sách khuyến mãi'
        });
    }
}

// Root promotion saga
export default function* promotionSaga() {
    yield takeEvery(getPromotionsRequest.type, getPromotionsSaga);
} 