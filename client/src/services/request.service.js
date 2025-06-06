import axiosInstance from '../api/axios';

const requestService = {
    // Create new request (venue inquiry)
    createRequest: async (requestData) => {
        const response = await axiosInstance.post('/requests', requestData);
        return response.data;
    },

    // Get sent requests
    getSentRequests: async (options = {}) => {
        const params = new URLSearchParams();

        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.status) params.append('status', options.status);

        const response = await axiosInstance.get(`/requests/sent?${params.toString()}`);
        return response.data;
    },

    // Get received requests
    getReceivedRequests: async (options = {}) => {
        const params = new URLSearchParams();

        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.status) params.append('status', options.status);
        if (options.unreadOnly) params.append('unreadOnly', 'true');

        const response = await axiosInstance.get(`/requests/received?${params.toString()}`);
        return response.data;
    },

    // Get unread count for notifications
    getUnreadCount: async () => {
        const response = await axiosInstance.get('/requests/unread-count');
        return response.data;
    },

    // Get request by ID
    getRequestById: async (requestId) => {
        const response = await axiosInstance.get(`/requests/${requestId}`);
        return response.data;
    },

    // Mark request as read
    markAsRead: async (requestId) => {
        const response = await axiosInstance.patch(`/requests/${requestId}/mark-read`);
        return response.data;
    },

    // Mark all requests as read
    markAllAsRead: async () => {
        const response = await axiosInstance.patch('/requests/mark-all-read');
        return response.data;
    },

    // Update request status
    updateStatus: async (requestId, status) => {
        const response = await axiosInstance.patch(`/requests/${requestId}/status`, { status });
        return response.data;
    },

    // Delete request (soft delete)
    deleteRequest: async (requestId) => {
        const response = await axiosInstance.delete(`/requests/${requestId}`);
        return response.data;
    }
};

export default requestService;