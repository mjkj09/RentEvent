import React, {createContext, useState, useEffect} from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    register: async () => {
    },
    login: async () => {
    },
    logout: async () => {
    },
    isAuthenticated: false
});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (window.location.pathname.includes('/auth')) {
                    setLoading(false);
                    return;
                }
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const loadUserPromise = loadUser();
        return () => {
            loadUserPromise.catch(err => {
                console.error('Error loading user:', err);
            });
        };
    }, []);

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.register(userData);
            setUser(result.user);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.login(credentials);
            setUser(result.user);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.logout();
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
