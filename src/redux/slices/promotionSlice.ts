import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Promotion {
    id: number;
    title: string;
    description: string;
    image: string;
    startDate: string;
    endDate: string;
    discount: number;
    code: string;
    status: boolean;
}

interface PromotionPageResponse {
    content: Promotion[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

interface PromotionState {
    promotions: {
        data: PromotionPageResponse | null;
        loading: boolean;
        error: string | null;
    };
    searchTitle: string;
    currentPage: number;
}

const initialState: PromotionState = {
    promotions: {
        data: null,
        loading: false,
        error: null
    },
    searchTitle: '',
    currentPage: 0
};

const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {
        // Get promotions with pagination
        getPromotionsRequest: (state, action: PayloadAction<{ title?: string, page?: number }>) => {
            state.promotions.loading = true;
            state.promotions.error = null;
            if (action.payload.title !== undefined) {
                state.searchTitle = action.payload.title;
            }
            if (action.payload.page !== undefined) {
                state.currentPage = action.payload.page;
            }
        },
        getPromotionsSuccess: (state, action: PayloadAction<PromotionPageResponse>) => {
            state.promotions.data = action.payload;
            state.promotions.loading = false;
        },
        getPromotionsFailure: (state, action: PayloadAction<string>) => {
            state.promotions.loading = false;
            state.promotions.error = action.payload;
        },
        // Reset state
        resetPromotions: (state) => {
            state.promotions.data = null;
            state.promotions.loading = false;
            state.promotions.error = null;
            state.searchTitle = '';
            state.currentPage = 0;
        }
    }
});

export const {
    getPromotionsRequest,
    getPromotionsSuccess,
    getPromotionsFailure,
    resetPromotions
} = promotionSlice.actions;

export default promotionSlice.reducer; 