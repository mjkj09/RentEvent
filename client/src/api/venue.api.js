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

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post('/venues/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

export default venueApi;