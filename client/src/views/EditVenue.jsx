import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Fade, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import VenueDetailsStep from '../components/create-listing/VenueDetailsStep';
import PricingCapacityStep from '../components/create-listing/PricingCapacityStep';
import ImagesStep from '../components/create-listing/ImagesStep';
import venueService from '../services/venue.service';

export default function EditVenue() {
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [venueData, setVenueData] = useState({
        name: '',
        category: '',
        location: { street: '', city: '', region: '' },
        description: '',
        capacity: '',
        pricing: { minPricePerPerson: '', maxPricePerPerson: '', isPriceHidden: false },
        images: [],
        bannerImage: null
    });

    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!authLoading) {
            if (!isAuthenticated || user?.role !== 'owner') {
                navigate('/auth');
                return;
            }
            loadVenue();
        }
    }, [id, isAuthenticated, authLoading, user, navigate]);

    const loadVenue = async () => {
        try {
            setLoading(true);
            setError(null);
            const venueData = await venueService.getVenueById(id);
            setVenue(venueData);

            // Populate form with existing data
            setVenueData({
                name: venueData.name || '',
                category: venueData.category || '',
                location: venueData.location || { street: '', city: '', region: '' },
                description: venueData.description || '',
                capacity: venueData.capacity?.toString() || '',
                pricing: {
                    minPricePerPerson: venueData.pricing?.minPricePerPerson?.toString() || '',
                    maxPricePerPerson: venueData.pricing?.maxPricePerPerson?.toString() || '',
                    isPriceHidden: venueData.pricing?.isPriceHidden || false
                },
                images: venueData.images || [],
                bannerImage: venueData.bannerImage || null
            });
        } catch (err) {
            setError(err.message || 'Failed to load venue details');
        } finally {
            setLoading(false);
        }
    };

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
        setUpdating(true);

        try {
            const updateData = {
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

            await venueService.updateVenue(id, updateData);
            navigate(`/venue/${id}`);
        } catch (error) {
            setError(error.message || 'Failed to update venue');
        } finally {
            setUpdating(false);
        }
    };

    if (authLoading || loading) {
        return <PageLoader message="Loading venue details..." />;
    }

    if (!isAuthenticated || user?.role !== 'owner') {
        return null;
    }

    if (error && !venue) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                </Container>
                <Footer />
            </Box>
        );
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <VenueDetailsStep
                        data={venueData}
                        onDataChange={handleDataChange}
                        onNext={handleNext}
                        isEditing={true}
                    />
                );
            case 1:
                return (
                    <PricingCapacityStep
                        data={venueData}
                        onDataChange={handleDataChange}
                        onNext={handleNext}
                        onBack={handleBack}
                        isEditing={true}
                    />
                );
            case 2:
                return (
                    <ImagesStep
                        data={venueData}
                        onDataChange={handleDataChange}
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                        isSubmitting={updating}
                        isEditing={true}
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
                                Edit Venue: {venue?.name}
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
                                Update your venue details to keep your listing current
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

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