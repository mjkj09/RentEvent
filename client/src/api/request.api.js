import axiosInstance from './axios';

const requestApi = {
    createRequest: async (requestData) => {
        const response = await axiosInstance.post('/requests', requestData);
        return response.data;
    },

    getSentRequests: async (params = {}) => {
        const response = await axiosInstance.get('/requests/sent', { params });
        return response.data;
    },

    getReceivedRequests: async (params = {}) => {
        const response = await axiosInstance.get('/requests/received', { params });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await axiosInstance.get('/requests/unread-count');
        return response.data;
    },

    getRequestById: async (requestId) => {
        const response = await axiosInstance.get(`/requests/${requestId}`);
        return response.data;
    },

    markAsRead: async (requestId) => {
        const response = await axiosInstance.patch(`/requests/${requestId}/mark-read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await axiosInstance.patch('/requests/mark-all-read');
        return response.data;
    },

    updateStatus: async (requestId, status) => {
        const response = await axiosInstance.patch(`/requests/${requestId}/status`, { status });
        return response.data;
    },

    deleteRequest: async (requestId) => {
        const response = await axiosInstance.delete(`/requests/${requestId}`);
        return response.data;
    }
};

export default requestApi;