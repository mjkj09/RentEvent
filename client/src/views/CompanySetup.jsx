import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Fade } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import CompanySetupForm from '../components/company/CompanySetupForm';
import CompanySetupOptions from '../components/company/CompanySetupOptions';
import PageLoader from '../components/common/PageLoader';
import companyService from '../services/company.service';

export default function CompanySetup() {
    const [step, setStep] = useState('options'); // 'options' or 'form'
    const [loading, setLoading] = useState(true);
    const [hasCompany, setHasCompany] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // Check if user came from registration or create listing
    const fromRegistration = location.state?.fromRegistration || false;
    const fromCreateListing = location.state?.fromCreateListing || false;
    const returnTo = location.state?.returnTo;

    useEffect(() => {
        const checkCompanyStatus = async () => {
            if (!authLoading && isAuthenticated && user) {
                try {
                    const companyExists = await companyService.checkCompanyExists();
                    if (companyExists) {
                        setHasCompany(true);
                        navigate('/home'); // Redirect if company already exists
                        return;
                    }
                } catch (error) {
                    console.error('Error checking company status:', error);
                }
            }
            setLoading(false);
        };

        checkCompanyStatus();
    }, [user, isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        // Auto-scroll to top when component mounts
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleProceedToForm = () => {
        setStep('form');
        // Smooth scroll to top when showing form
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const handleStayAsRenter = async () => {
        // Just redirect to home - user stays as renter
        navigate('/home');
    };

    const handleCompanyCreated = () => {
        if (fromCreateListing && returnTo) {
            navigate(returnTo);
        } else {
            navigate('/home');
        }
    };

    const handleBackToOptions = () => {
        setStep('options');
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    if (authLoading || loading) {
        return <PageLoader message="Loading account setup..." />;
    }

    if (!isAuthenticated) {
        navigate('/auth');
        return null;
    }

    if (hasCompany) {
        return <PageLoader message="Redirecting..." />;
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
                <Fade in timeout={600}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 3,
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                        }}
                    >
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
                                {fromRegistration ? 'Welcome to RentEvent!' :
                                    fromCreateListing ? 'Create Your First Listing' :
                                        'Account Upgrade'}
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
                                {step === 'options'
                                    ? (fromRegistration
                                            ? 'Would you like to upgrade your account to start listing venues, or continue as an event organizer?'
                                            : fromCreateListing
                                                ? 'To create venue listings, you need to upgrade your account. Would you like to provide your company details or continue browsing as an event organizer?'
                                                : 'Choose how you want to use your RentEvent account.'
                                    )
                                    : 'Please provide your company details to upgrade to venue owner.'
                                }
                            </Typography>
                        </Box>

                        {/* Content */}
                        {step === 'options' ? (
                            <CompanySetupOptions
                                onProceedToForm={handleProceedToForm}
                                onSwitchToRenter={handleStayAsRenter}
                                fromCreateListing={fromCreateListing}
                            />
                        ) : (
                            <CompanySetupForm
                                onCompanyCreated={handleCompanyCreated}
                                onBack={handleBackToOptions}
                            />
                        )}
                    </Paper>
                </Fade>
            </Container>

            <Footer />
        </Box>
    );
}