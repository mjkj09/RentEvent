import userApi from '../api/user.api';

const favoritesService = {
    getFavorites: async () => {
        try {
            const response = await userApi.getFavorites();
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
        }
    },

    addFavorite: async (venueId) => {
        try {
            const response = await userApi.addFavorite(venueId);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add favorite');
        }
    },

    removeFavorite: async (venueId) => {
        try {
            const response = await userApi.removeFavorite(venueId);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to remove favorite');
        }
    },

    checkFavorite: async (venueId) => {
        try {
            const response = await userApi.checkFavorite(venueId);
            return Boolean(response.data?.isFavorite);
        } catch (error) {
            console.warn('Failed to check favorite status:', error);
            return false;
        }
    },

    toggleFavorite: async (venueId, currentStatus) => {
        try {
            if (currentStatus) {
                await favoritesService.removeFavorite(venueId);
                return false;
            } else {
                await favoritesService.addFavorite(venueId);
                return true;
            }
        } catch (error) {
            throw new Error(error.message || 'Failed to toggle favorite');
        }
    }
};

export default favoritesService;