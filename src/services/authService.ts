import axiosInstance from '../utils/axiosConfig';

export interface LoginPayload {
    username: string;
    password: string;
}

export const authService = {
    login: async (data: LoginPayload) => {
        const response = await axiosInstance.post('/authenticate', data);
        console.log(response.data);
        if (response.data) {
            localStorage.setItem('token', response.data);
            // Sau khi lưu token, cập nhật Authorization header cho các request tiếp theo
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        }
        return response.data;
    },

    getInfoUser: async () => {
        const response = await axiosInstance.get('/getInfoUser');
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        // Xóa Authorization header khi logout
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    getToken: () => {
        return localStorage.getItem('token');
    },
};

export default authService; 