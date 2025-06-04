import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Chip,
    Button,
    Alert,
    Fade,
    IconButton,
    Fab
} from '@mui/material';
import {
    LocationOn,
    People,
    Star,
    Share,
    Favorite,
    FavoriteBorder,
    Send as SendIcon,
    ArrowBack,
    Phone,
    Email
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import VenueImageGallery from '../components/venue-details/VenueImageGallery';
import VenueInfo from '../components/venue-details/VenueInfo';
import VenueReviews from '../components/venue-details/VenueReviews';
import ContactForm from '../components/venue-details/ContactForm';

// Services
import venueService from '../services/venue.service';

export default function VenueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);

    useEffect(() => {
        // Auto-scroll to top when component mounts
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadVenueDetails();
    }, [id]);

    const loadVenueDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await venueService.getVenueDetails(id);
            setVenue(response.data);

            // TODO: Check if venue is in user's favorites
            // setIsFavorite(checkIfInFavorites(id));

        } catch (err) {
            console.error('Error loading venue details:', err);
            setError(err.message || 'Failed to load venue details');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Implement favorite toggle API call
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: venue.name,
                    text: venue.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            // TODO: Show toast notification
        }
    };

    const handleContactOwner = () => {
        setShowContactForm(true);
        // Smooth scroll to contact form
        setTimeout(() => {
            document.getElementById('contact-form')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    const handleCall = () => {
        if (venue.ownerCompany?.contactPhone) {
            window.location.href = `tel:${venue.ownerCompany.contactPhone}`;
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                    <Box
                        sx={{
                            minHeight: '60vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <PageLoader message="Loading venue details..." />
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Go Back
                    </Button>
                </Container>
                <Footer />
            </Box>
        );
    }

    if (!venue) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Venue not found
                    </Alert>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Go Back
                    </Button>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                <Fade in timeout={600}>
                    <Box>
                        {/* Back Button */}
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                            sx={{ mb: 3 }}
                            variant="outlined"
                        >
                            Back to Search
                        </Button>

                        {/* Venue Header */}
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: 2,
                                mb: 2
                            }}>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="h3"
                                        component="h1"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            fontSize: { xs: '2rem', md: '3rem' }
                                        }}
                                    >
                                        {venue.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={venue.category}
                                            color="primary"
                                            variant="outlined"
                                        />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOn color="action" fontSize="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                {venue.location.city}, {venue.location.region}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <People color="action" fontSize="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                Up to {venue.capacity} guests
                                            </Typography>
                                        </Box>

                                        {/* Rating moved here */}
                                        {venue.ratingStats.totalReviews > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Star color="warning" fontSize="small" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {venue.ratingStats.averageRating} ({venue.ratingStats.totalReviews} reviews)
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                                    <IconButton onClick={handleToggleFavorite} color="primary">
                                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
                                    </IconButton>
                                    <IconButton onClick={handleShare} color="primary">
                                        <Share />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<SendIcon />}
                                        onClick={handleContactOwner}
                                        size="large"
                                    >
                                        Contact Owner
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Image Gallery */}
                        <VenueImageGallery
                            images={venue.images}
                            bannerImage={venue.bannerImage}
                            venueName={venue.name}
                        />

                        {/* Venue Information (now includes pricing and owner) */}
                        <VenueInfo venue={venue} onContactOwner={handleContactOwner} />

                        {/* Reviews Section - moved to bottom */}
                        <VenueReviews
                            reviews={venue.reviews}
                            ratingStats={venue.ratingStats}
                            venueId={venue._id}
                        />

                        {/* Contact Form (conditionally rendered) */}
                        {showContactForm && (
                            <Box id="contact-form" sx={{ mt: 6 }}>
                                <ContactForm
                                    venue={venue}
                                    onClose={() => setShowContactForm(false)}
                                />
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Container>

            {/* Mobile Action Buttons */}
            <Box
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                    gap: 2,
                    zIndex: 1000
                }}
            >
                {venue.ownerCompany?.contactPhone && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Phone />}
                        onClick={handleCall}
                        fullWidth
                        size="large"
                    >
                        Call
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Email />}
                    onClick={handleContactOwner}
                    fullWidth
                    size="large"
                >
                    Message
                </Button>
            </Box>

            {/* Mobile Floating Action Buttons */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Fab
                    color="primary"
                    onClick={handleToggleFavorite}
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 16,
                        zIndex: 999
                    }}
                >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </Fab>

                <Fab
                    color="default"
                    onClick={handleShare}
                    sx={{
                        position: 'fixed',
                        bottom: 170,
                        right: 16,
                        zIndex: 999
                    }}
                >
                    <Share />
                </Fab>
            </Box>

            {/* Add bottom padding for mobile to avoid covering content */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, height: 80 }} />

            <Footer />
        </Box>
    );
}