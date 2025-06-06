import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import requestApi from '../api/request.api';

export function useNotifications() {
    const { user, isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated || !user || user.role !== 'owner') {
            setUnreadCount(0);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await requestApi.getUnreadCount();
            setUnreadCount(response.data?.unreadCount || 0);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
            setError(err.message);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const markAllAsRead = useCallback(async () => {
        if (!isAuthenticated || !user || user.role !== 'owner') {
            return;
        }

        try {
            await requestApi.markAllAsRead();
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            setError(err.message);
        }
    }, [isAuthenticated, user]);

    const decrementUnreadCount = useCallback(() => {
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const incrementUnreadCount = useCallback(() => {
        setUnreadCount(prev => prev + 1);
    }, []);

    const resetUnreadCount = useCallback(() => {
        setUnreadCount(0);
    }, []);

    // Fetch unread count on mount and when auth changes
    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    // Poll for updates every 30 seconds when user is authenticated
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== 'owner') {
            return;
        }

        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [isAuthenticated, user, fetchUnreadCount]);

    return {
        unreadCount,
        loading,
        error,
        fetchUnreadCount,
        markAllAsRead,
        decrementUnreadCount,
        incrementUnreadCount,
        resetUnreadCount
    };
}