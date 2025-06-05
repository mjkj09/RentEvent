import venueApi from '../api/venue.api';

const venueService = {
    getAllVenues: async (filters = {}) => {
        try {
            const response = await venueApi.getAllVenues(filters);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch venues');
        }
    },

    getVenueById: async (id) => {
        try {
            const response = await venueApi.getVenueById(id);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch venue');
        }
    },

    getVenueDetails: async (id) => {
        try {
            const response = await venueApi.getVenueDetails(id);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch venue details');
        }
    },

    getCategoryStats: async () => {
        try {
            const response = await venueApi.getCategoryStats();
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch category statistics');
        }
    },

    getPopularVenues: async (limit = 6) => {
        try {
            const response = await venueApi.getPopularVenues(limit);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch popular venues');
        }
    },

    getMyVenues: async () => {
        try {
            const response = await venueApi.getMyVenues();
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch your venues');
        }
    },

    createVenue: async (venueData) => {
        try {
            const response = await venueApi.createVenue(venueData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create venue');
        }
    },

    updateVenue: async (id, venueData) => {
        try {
            const response = await venueApi.updateVenue(id, venueData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update venue');
        }
    },

    deleteVenue: async (id) => {
        try {
            const response = await venueApi.deleteVenue(id);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete venue');
        }
    },

    uploadImage: async (file) => {
        try {
            const response = await venueApi.uploadImage(file);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload image');
        }
    }
};

export default venueService;