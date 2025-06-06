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
    },

    // Favorites methods
    getFavorites: async () => {
        const response = await axiosInstance.get('/users/favorites');
        return response.data;
    },

    addFavorite: async (venueId) => {
        const response = await axiosInstance.post('/users/favorites', { venueId });
        return response.data;
    },

    removeFavorite: async (venueId) => {
        const response = await axiosInstance.delete(`/users/favorites/${venueId}`);
        return response.data;
    },

    checkFavorite: async (venueId) => {
        const response = await axiosInstance.get(`/users/favorites/${venueId}/check`);
        return response.data;
    }
};

export default userApi;