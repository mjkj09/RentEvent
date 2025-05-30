import axiosInstance from './axios';

const authApi = {
    register: async (userData) => {
        const serverData = {
            name: userData.firstName,
            surname: userData.lastName,
            email: userData.email,
            password: userData.password,
            role: userData.accountType === 'owner' ? 'owner' : 'renter'
        };

        const response = await axiosInstance.post('/auth/register', serverData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    },

    refreshToken: async () => {
        const response = await axiosInstance.post('/auth/refresh-token');
        return response.data;
    }
};

export default authApi;