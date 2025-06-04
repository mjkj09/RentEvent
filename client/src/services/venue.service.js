import venueApi from '../api/venue.api';

const venueService = {
    getAllVenues: async (params = {}) => {
        try {
            const response = await venueApi.getAllVenues(params);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to fetch venues. Please try again.';
            throw new Error(errorMessage);
        }
    },

    getVenueById: async (id) => {
        try {
            const response = await venueApi.getVenueById(id);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to fetch venue details.';
            throw new Error(errorMessage);
        }
    },

    createVenue: async (venueData) => {
        try {
            const response = await venueApi.createVenue(venueData);
            return {
                venue: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to create venue. Please try again.';
            throw new Error(errorMessage);
        }
    },

    updateVenue: async (id, venueData) => {
        try {
            const response = await venueApi.updateVenue(id, venueData);
            return {
                venue: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to update venue. Please try again.';
            throw new Error(errorMessage);
        }
    },

    deleteVenue: async (id) => {
        try {
            const response = await venueApi.deleteVenue(id);
            return {
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to delete venue. Please try again.';
            throw new Error(errorMessage);
        }
    },

    uploadImage: async (file) => {
        try {
            const response = await venueApi.uploadImage(file);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to upload image. Please try again.';
            throw new Error(errorMessage);
        }
    }
};

export default venueService;