import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import ProfileForm from '../components/profile/ProfileForm';
import CompanyInfo from '../components/profile/CompanyInfo';
import userService from '../services/user.service';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading, setUser } = useAuth();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!authLoading && !isAuthenticated) {
            navigate('/auth');
            return;
        }

        if (isAuthenticated && user) {
            loadProfile();
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const profileData = await userService.getUserProfile();
            setProfile(profileData);
        } catch (err) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updateData) => {
        try {
            setUpdating(true);
            setError(null);
            setSuccess('');

            const result = await userService.updateProfile(updateData);

            setProfile(prev => ({
                ...prev,
                user: result.user
            }));

            setUser(result.user);

            setSuccess('Profile updated successfully!');

            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (authLoading || loading) {
        return <PageLoader message="Loading profile..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (error && !profile) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Container maxWidth="md" sx={{ flex: 1, py: 3 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
                <Fade in timeout={600}>
                    <Box>
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
                                My Profile
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
                                Manage your account settings and company information
                            </Typography>
                        </Box>

                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {success}
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {profile && (
                            <ProfileForm
                                user={profile.user}
                                onUpdate={handleUpdateProfile}
                                loading={updating}
                            />
                        )}

                        {profile && (
                            <CompanyInfo
                                company={profile.company}
                                userRole={profile.user?.role}
                            />
                        )}
                    </Box>
                </Fade>
            </Container>

            <Footer />
        </Box>
    );
}