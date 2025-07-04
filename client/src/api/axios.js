import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh token for auth requests
        if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/register') {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(`${API_URL}/auth/refresh-token`, {}, {withCredentials: true});
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (!window.location.pathname.includes('/auth') && window.location.pathname !== '/') {
                    window.location.href = '/auth';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;