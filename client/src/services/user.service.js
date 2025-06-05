import userApi from '../api/user.api';

const userService = {
    getUserProfile: async () => {
        try {
            const response = await userApi.getUserProfile();
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to fetch profile.';
            throw new Error(errorMessage);
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await userApi.updateProfile(profileData);
            return {
                user: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to update profile. Please try again.';
            throw new Error(errorMessage);
        }
    },

    deleteAccount: async (password) => {
        try {
            const response = await userApi.deleteAccount(password);
            return {
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to delete account. Please try again.';
            throw new Error(errorMessage);
        }
    }
};

export default userService;