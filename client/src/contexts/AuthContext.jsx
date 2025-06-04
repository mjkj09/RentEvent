import {createContext} from 'react';

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
    setUser: () => {}, // Dodajemy setUser do default context
    isAuthenticated: false
});