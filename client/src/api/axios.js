import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - dodajemy debugging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('🚀 Request:', {
            method: config.method,
            url: config.url,
            headers: config.headers,
            withCredentials: config.withCredentials,
            data: config.data instanceof FormData ? 'FormData' : config.data
        });
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    async (error) => {
        console.error('❌ Response Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.message || error.message,
            headers: error.response?.headers
        });

        const originalRequest = error.config;

        // Don't try to refresh token for login/register requests
        if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/register') {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('🔄 Attempting token refresh...');
                await axios.post(`${API_URL}/auth/refresh-token`, {}, {withCredentials: true});
                console.log('✅ Token refreshed successfully');
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                // Don't redirect if on landing page or auth page
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