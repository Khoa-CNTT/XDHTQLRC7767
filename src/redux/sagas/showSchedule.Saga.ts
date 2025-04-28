import { takeEvery, put, call } from 'redux-saga/effects';
import {
} from '../slices/movieSlice';
import axiosInstance from '../../utils/axiosConfig';

interface GetMovieDetailAction {
    type: string;
    payload: {
        id: number;
    };
}

// Root auth saga
export default function* showScheduleSaga() {

}