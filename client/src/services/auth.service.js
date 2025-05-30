import authApi from '../api/auth.api';

const authService = {

  register: async (userData) => {
    try {
      const response = await authApi.register(userData);
      return {
        user: response.data,
        message: response.message
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  },

  login: async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      return {
        user: response.data,
        message: response.message
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      const response = await authApi.logout();
      return {
        message: response.message
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Logout failed. Please try again.';
      throw new Error(errorMessage);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authApi.getCurrentUser();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null;
      }
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to get user information.';
      throw new Error(errorMessage);
    }
  },

  isAuthenticated: async () => {
    try {
      const user = await authService.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
};

export default authService;
