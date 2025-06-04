import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        const checkCompanyStatus = async () => {
            if (!authLoading && isAuthenticated && user) {
                // If user is not an owner or trying to be one, redirect
                if (user.role !== 'owner') {
                    navigate('/home');
                    return;
                }

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

    const handleSwitchToRenter = async () => {
        try {
            await companyService.switchToRenter();
            navigate('/home');
        } catch (error) {
            console.error('Error switching to renter:', error);
        }
    };

    const handleCompanyCreated = () => {
        navigate('/home');
    };

    const handleBackToOptions = () => {
        setStep('options');
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    if (authLoading || loading) {
        return <PageLoader message="Setting up company profile..." />;
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
                                Complete Your Owner Profile
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
                                    ? 'To list venues as an owner, we need some additional information about your business.'
                                    : 'Please provide your company details to continue as a venue owner.'
                                }
                            </Typography>
                        </Box>

                        {/* Content */}
                        {step === 'options' ? (
                            <CompanySetupOptions
                                onProceedToForm={handleProceedToForm}
                                onSwitchToRenter={handleSwitchToRenter}
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