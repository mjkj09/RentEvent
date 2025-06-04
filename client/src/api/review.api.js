import axiosInstance from './axios';

const reviewApi = {
    getVenueReviews: async (venueId) => {
        const response = await axiosInstance.get(`/reviews/venue/${venueId}`);
        return response.data;
    },

    createReview: async (reviewData) => {
        const response = await axiosInstance.post('/reviews', reviewData);
        return response.data;
    },

    updateReview: async (reviewId, reviewData) => {
        const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    getReviewById: async (reviewId) => {
        const response = await axiosInstance.get(`/reviews/${reviewId}`);
        return response.data;
    }
};

export default reviewApi;