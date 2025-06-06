import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel, Typography, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import VenueDetailsStep from '../components/create-listing/VenueDetailsStep';
import PricingCapacityStep from '../components/create-listing/PricingCapacityStep';
import ImagesStep from '../components/create-listing/ImagesStep';
import companyService from '../services/company.service';
import venueService from '../services/venue.service';
import { CREATE_LISTING_STEPS } from '../constants/venueConstants';

export default function CreateListing() {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [venueData, setVenueData] = useState({
        // Step 1: Details
        name: '',
        category: '',
        location: {
            street: '',
            city: '',
            region: ''
        },
        description: '',

        // Step 2: Pricing & Capacity
        capacity: '',
        pricing: {
            minPricePerPerson: '',
            maxPricePerPerson: '',
            isPriceHidden: false
        },

        // Step 3: Images
        images: [],
        bannerImage: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
       const checkAccess = async () => {
            if (!authLoading) {
                if (!isAuthenticated) {
                    navigate('/auth');
                    return;
                }

                if (user.role === 'renter') {
                    // Renter trying to create listing - redirect to company setup
                    navigate('/company-setup', {
                        state: {
                            fromCreateListing: true,
                            returnTo: '/create-listing'
                        }
                    });
                    return;
                }

                if (user.role === 'owner') {
                    try {
                        const hasCompany = await companyService.checkCompanyExists();
                        if (!hasCompany) {
                            // Owner without company - redirect to company setup
                            navigate('/company-setup', {
                                state: {
                                    fromCreateListing: true,
                                    returnTo: '/create-listing'
                                }
                            });
                            return;
                        }
                    } catch (error) {
                        navigate('/company-setup', {
                            state: {
                                fromCreateListing: true,
                                returnTo: '/create-listing'
                            }
                        });
                        return;
                    }
                }
                setLoading(false);
            }
        };

        checkAccess();
    }, [user, isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        // Auto-scroll to top when component mounts
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDataChange = (stepData) => {
        setVenueData(prev => ({
            ...prev,
            ...stepData
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Prepare venue data for submission
            const submitData = {
                name: venueData.name,
                category: venueData.category,
                location: venueData.location,
                description: venueData.description,
                capacity: parseInt(venueData.capacity),
                pricing: {
                    minPricePerPerson: venueData.pricing.minPricePerPerson ? parseFloat(venueData.pricing.minPricePerPerson) : null,
                    maxPricePerPerson: venueData.pricing.maxPricePerPerson ? parseFloat(venueData.pricing.maxPricePerPerson) : null,
                    isPriceHidden: venueData.pricing.isPriceHidden
                },
                images: venueData.images,
                bannerImage: venueData.bannerImage
            };

            const result = await venueService.createVenue(submitData);
            console.log('Create venue result:', result);

            // Get venue ID from result - check different possible structures
            const venueId = result.venue?._id || result._id || result.data?._id || result.data?.venue?._id;

            if (!venueId) {
                console.error('No venue ID found in result:', result);
                throw new Error('Failed to get venue ID from server response');
            }

            // Redirect to venue details page
            navigate(`/venue/${venueId}`);
        } catch (error) {
            console.error('Error creating venue:', error);
            // Re-throw error so ImagesStep can catch it
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };
    // Add event listener to detect navigation attempts
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isSubmitting) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        const handlePopState = (event) => {
            console.log('🔙 Browser back button pressed');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isSubmitting]);

    if (authLoading || loading) {
        return <PageLoader message="Loading create listing..." />;
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <VenueDetailsStep
                        data={venueData}
                        onDataChange={handleDataChange}
                        onNext={handleNext}
                    />
                );
            case 1:
                return (
                    <PricingCapacityStep
                        data={venueData}
                        onDataChange={handleDataChange}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 2:
                return (
                    <ImagesStep
                        data={venueData}
                        onDataChange={handleDataChange}
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
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
                                Create Your Venue Listing
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
                                Share your space with event organizers and start earning from your venue
                            </Typography>
                        </Box>

                        {/* Stepper */}
                        <Box sx={{ mb: 4 }}>
                            <Stepper
                                activeStep={activeStep}
                                alternativeLabel
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }
                                }}
                            >
                                {CREATE_LISTING_STEPS.map((step) => (
                                    <Step key={step.id}>
                                        <StepLabel>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {step.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {/* Step Content */}
                        <Box sx={{ mt: 4 }}>
                            {renderStepContent()}
                        </Box>
                    </Paper>
                </Fade>
            </Container>

            <Footer />
        </Box>
    );
}