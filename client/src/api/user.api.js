import axiosInstance from './axios';

const userApi = {
    getUserProfile: async () => {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await axiosInstance.put('/users/profile', profileData);
        return response.data;
    },

    deleteAccount: async (password) => {
        const response = await axiosInstance.delete('/users/account', {
            data: { password }
        });
        return response.data;
    }
};

export default userApi;