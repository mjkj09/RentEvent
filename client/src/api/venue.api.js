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
        // Debug file info
        console.log('📁 File to upload:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        });

        const formData = new FormData();
        formData.append('image', file);

        // Debug FormData contents
        for (let pair of formData.entries()) {
            console.log('📋 FormData entry:', pair[0], pair[1]);
        }

        try {
            // Try with explicit headers first
            console.log('🚀 Attempting upload with explicit multipart header...');
            const response = await axiosInstance.post('/venues/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
                timeout: 30000
            });

            console.log('📤 Upload response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Upload failed with explicit header, trying without...', error);

            // If that fails, try without Content-Type (let axios set it)
            try {
                const response = await axiosInstance.post('/venues/upload-image', formData, {
                    headers: {
                        // Don't set Content-Type - let axios handle it with proper boundary
                    },
                    withCredentials: true,
                    timeout: 30000
                });

                console.log('📤 Upload response (no header):', response.data);
                return response.data;
            } catch (secondError) {
                console.error('❌ Both upload attempts failed:', secondError);
                throw secondError;
            }
        }
    }
};

export default venueApi;