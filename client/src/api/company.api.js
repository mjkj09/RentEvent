import axiosInstance from './axios';

const companyApi = {
    createCompany: async (companyData) => {
        const response = await axiosInstance.post('/company', companyData);
        return response.data;
    },

    getMyCompany: async () => {
        const response = await axiosInstance.get('/company/my-company');
        return response.data;
    },

    updateMyCompany: async (companyData) => {
        const response = await axiosInstance.put('/company/my-company', companyData);
        return response.data;
    },

    deleteMyCompany: async () => {
        const response = await axiosInstance.delete('/company/my-company');
        return response.data;
    },

    switchToRenter: async () => {
        const response = await axiosInstance.post('/company/switch-to-renter');
        return response.data;
    },

    checkCompanyExists: async () => {
        const response = await axiosInstance.get('/company/check-exists');
        return response.data;
    },

    getCompanyById: async (id) => {
        const response = await axiosInstance.get(`/company/${id}`);
        return response.data;
    }
};

export default companyApi;