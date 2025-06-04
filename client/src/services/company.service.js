import companyApi from '../api/company.api';

const companyService = {
    createCompany: async (companyData) => {
        try {
            const response = await companyApi.createCompany(companyData);
            return {
                company: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to create company. Please try again.';
            throw new Error(errorMessage);
        }
    },

    getMyCompany: async () => {
        try {
            const response = await companyApi.getMyCompany();
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to get company information.';
            throw new Error(errorMessage);
        }
    },

    updateMyCompany: async (companyData) => {
        try {
            const response = await companyApi.updateMyCompany(companyData);
            return {
                company: response.data,
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to update company. Please try again.';
            throw new Error(errorMessage);
        }
    },

    deleteMyCompany: async () => {
        try {
            const response = await companyApi.deleteMyCompany();
            return {
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to delete company. Please try again.';
            throw new Error(errorMessage);
        }
    },

    switchToRenter: async () => {
        try {
            const response = await companyApi.switchToRenter();
            return {
                message: response.message
            };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to switch to renter. Please try again.';
            throw new Error(errorMessage);
        }
    },

    checkCompanyExists: async () => {
        try {
            const response = await companyApi.checkCompanyExists();
            return response.data.exists;
        } catch (error) {
            console.error('Error checking company existence:', error);
            return false;
        }
    },

    getCompanyById: async (id) => {
        try {
            const response = await companyApi.getCompanyById(id);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Failed to get company information.';
            throw new Error(errorMessage);
        }
    }
};

export default companyService;