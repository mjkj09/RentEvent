import reviewApi from '../api/review.api';

const reviewService = {
    getVenueReviews: async (venueId) => {
        try {
            const response = await reviewApi.getVenueReviews(venueId);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to fetch reviews.';
            throw new Error(errorMessage);
        }
    },

    createReview: async (reviewData) => {
        try {
            const response = await reviewApi.createReview(reviewData);
            return {
                review: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to create review. Please try again.';
            throw new Error(errorMessage);
        }
    },

    updateReview: async (reviewId, reviewData) => {
        try {
            const response = await reviewApi.updateReview(reviewId, reviewData);
            return {
                review: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to update review. Please try again.';
            throw new Error(errorMessage);
        }
    },

    deleteReview: async (reviewId) => {
        try {
            const response = await reviewApi.deleteReview(reviewId);
            return {
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to delete review. Please try again.';
            throw new Error(errorMessage);
        }
    }
};

export default reviewService;