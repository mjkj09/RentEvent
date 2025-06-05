import React, {useState, useEffect} from 'react';
import authService from '../services/auth.service';
import {AuthContext} from './AuthContext';

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);

                const userData = await authService.getCurrentUser();
                setUser(userData);
                console.log('✅ User loaded successfully:', userData);

            } catch (err) {
                console.log('ℹ️ No authenticated user found:', err.message);
                setUser(null);
                // Don't set error for 401s - just means user isn't logged in
                if (err.message && !err.message.includes('401')) {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.register(userData);
            setUser(result.user);
            console.log('✅ Registration successful:', result.user);

            return result;
        } catch (err) {
            console.error('❌ Registration failed:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.login(credentials);
            setUser(result.user);
            console.log('✅ Login successful:', result.user);

            return result;
        } catch (err) {
            console.error('❌ Login failed:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);

            await authService.logout();
            setUser(null);
            console.log('✅ Logout successful');

        } catch (err) {
            console.error('❌ Logout failed:', err);
            // Even if logout fails on server, clear user locally
            setUser(null);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                register,
                login,
                logout,
                setUser,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};