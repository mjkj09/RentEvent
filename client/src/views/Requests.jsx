import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Card,
    Fade,
    Alert
} from '@mui/material';
import {
    Send,
    Inbox
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import SentRequests from '../components/requests/SentRequests';
import ReceivedRequests from '../components/requests/ReceivedRequests';

export default function Requests() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { markAllAsRead, resetUnreadCount } = useNotifications();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/auth');
                return;
            }
            setLoading(false);
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleTabChange = async (event, newValue) => {
        setActiveTab(newValue);

        // If switching to received requests and user is owner, mark all as read
        if (newValue === 1 && user?.role === 'owner') {
            try {
                await markAllAsRead();
                resetUnreadCount();
            } catch (error) {
                // Handle error silently
            }
        }
    };

    if (authLoading || loading) {
        return <PageLoader message="Loading requests..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    const isOwner = user?.role === 'owner';

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
                <Fade in timeout={600}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: 'primary.main',
                                    fontSize: { xs: '2rem', md: '3rem' }
                                }}
                            >
                                Requests
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', md: '1.25rem' }
                                }}
                            >
                                {isOwner
                                    ? 'Manage your venue inquiries and track communication with potential clients'
                                    : 'Track your venue inquiries and communication with venue owners'
                                }
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Tabs for owners, direct content for renters */}
                        {isOwner ? (
                            <Card sx={{ mb: 4 }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={activeTab}
                                        onChange={handleTabChange}
                                        aria-label="request tabs"
                                        variant="fullWidth"
                                        sx={{
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                minHeight: 64
                                            }
                                        }}
                                    >
                                        <Tab
                                            label="Sent Requests"
                                            icon={<Send />}
                                            iconPosition="start"
                                        />
                                        <Tab
                                            label="Received Requests"
                                            icon={<Inbox />}
                                            iconPosition="start"
                                        />
                                    </Tabs>
                                </Box>

                                {/* Tab Content */}
                                <Box sx={{ p: 3 }}>
                                    {activeTab === 0 && <SentRequests />}
                                    {activeTab === 1 && <ReceivedRequests />}
                                </Box>
                            </Card>
                        ) : (
                            /* Direct content for renters */
                            <Card sx={{ mb: 4 }}>
                                <Box sx={{ p: 3 }}>
                                    <SentRequests />
                                </Box>
                            </Card>
                        )}
                    </Box>
                </Fade>
            </Container>

            <Footer />
        </Box>
    );
}