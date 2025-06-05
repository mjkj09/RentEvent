import axiosInstance from './axios';

const venueApi = {
    getAllVenues: async (params = {}) => {
        const response = await axiosInstance.get('/venues', { params });
        return response.data;
    },

    getVenueById: async (id) => {
        const response = await axiosInstance.get(`/venues/${id}`);
        return response.data;
    },

    getVenueDetails: async (id) => {
        const response = await axiosInstance.get(`/venues/${id}/details`);
        return response.data;
    },

    getCategoryStats: async () => {
        const response = await axiosInstance.get('/venues/stats/categories');
        return response.data;
    },

    getPopularVenues: async (limit = 6) => {
        const response = await axiosInstance.get('/venues/popular', {
            params: { limit }
        });
        return response.data;
    },

    getMyVenues: async () => {
        const response = await axiosInstance.get('/venues/my/venues');
        return response.data;
    },

    createVenue: async (venueData) => {
        const response = await axiosInstance.post('/venues', venueData);
        return response.data;
    },

    updateVenue: async (id, venueData) => {
        const response = await axiosInstance.put(`/venues/${id}`, venueData);
        return response.data;
    },

    deleteVenue: async (id) => {
        const response = await axiosInstance.delete(`/venues/${id}`);
        return response.data;
    },

    toggleVenueActive: async (id, isActive) => {
        const response = await axiosInstance.patch(`/venues/${id}/toggle-active`, { isActive });
        return response.data;
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axiosInstance.post('/venues/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
                timeout: 30000
            });

            return response.data;
        } catch (error) {
            try {
                const response = await axiosInstance.post('/venues/upload-image', formData, {
                    headers: {
                        // Don't set Content-Type - let axios handle it with proper boundary
                    },
                    withCredentials: true,
                    timeout: 30000
                });

                return response.data;
            } catch (secondError) {
                throw secondError;
            }
        }
    }
};

export default venueApi;