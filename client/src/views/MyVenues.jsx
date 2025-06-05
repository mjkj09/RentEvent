import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Alert,
    Fade,
    Card,
    CardContent
} from '@mui/material';
import {
    Add,
    BusinessCenter,
    TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import VenueCard from '../components/common/VenueCard'; // Using the adaptive VenueCard
import venueService from '../services/venue.service';
import { formatVenueForDisplay } from '../utils/searchUtils';

export default function MyVenues() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        // Auto-scroll to top when component mounts
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/auth');
                return;
            }

            if (user?.role !== 'owner') {
                navigate('/home');
                return;
            }

            loadVenues();
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    const loadVenues = async () => {
        try {
            setLoading(true);
            setError(null);
            const venuesData = await venueService.getMyVenues();
            // Ensure venuesData is an array
            setVenues(Array.isArray(venuesData) ? venuesData : []);
        } catch (err) {
            setError(err.message || 'Failed to load venues');
            setVenues([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVenue = async (venueId) => {
        try {
            await venueService.deleteVenue(venueId);
            setVenues(prev => prev.filter(venue => venue._id !== venueId));
            setSuccess('Venue deleted successfully!');

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.message || 'Failed to delete venue');
        }
    };

    const handleToggleActive = async (venueId, newActiveStatus) => {
        try {
            await venueService.toggleVenueActive(venueId, newActiveStatus);
            setVenues(prev =>
                prev.map(venue =>
                    venue._id === venueId
                        ? { ...venue, isActive: newActiveStatus }
                        : venue
                )
            );
            setSuccess(`Venue ${newActiveStatus ? 'activated' : 'deactivated'} successfully!`);

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            setError(err.message || 'Failed to update venue status');
        }
    };

    const handleViewVenue = (venueId) => {
        navigate(`/venue/${venueId}`);
    };

    const handleEditVenue = (venueId) => {
        navigate(`/edit-venue/${venueId}`);
    };

    const handleCreateVenue = () => {
        navigate('/create-listing');
    };

    const getStats = () => {
        // Ensure venues is an array before processing
        if (!Array.isArray(venues) || venues.length === 0) {
            return { totalVenues: 0, activeVenues: 0, totalReviews: 0, averageRating: 0 };
        }

        const totalVenues = venues.length;
        const activeVenues = venues.filter(v => v.isActive).length;
        const totalReviews = venues.reduce((sum, v) => sum + (v.ratingStats?.totalReviews || 0), 0);
        const averageRating = venues.length > 0
            ? venues.reduce((sum, v) => sum + (v.ratingStats?.averageRating || 0), 0) / venues.length
            : 0;

        return { totalVenues, activeVenues, totalReviews, averageRating };
    };

    if (authLoading || loading) {
        return <PageLoader message="Loading your venues..." />;
    }

    if (!isAuthenticated || user?.role !== 'owner') {
        return null; // Will redirect in useEffect
    }

    const stats = getStats();
    // Ensure venues is an array before formatting
    const formattedVenues = Array.isArray(venues) ? venues.map(formatVenueForDisplay) : [];

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
                <Fade in timeout={600}>
                    <Box>
                        {/* Header */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                            mb: 4
                        }}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        color: 'primary.main',
                                        fontSize: { xs: '2rem', md: '3rem' }
                                    }}
                                >
                                    My Venues
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                                >
                                    Manage your venue listings and track performance
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleCreateVenue}
                                size="large"
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Create New Venue
                            </Button>
                        </Box>

                        {/* Success Alert */}
                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {success}
                            </Alert>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Stats Cards */}
                        {venues.length > 0 && (
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <BusinessCenter color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                {stats.totalVenues}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Venues
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                {stats.activeVenues}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Active Venues
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 600, color: 'warning.main', mb: 3 }}>
                                                ⭐
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                                {stats.averageRating.toFixed(1)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Avg Rating
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ fontWeight: 600, color: 'info.main', mb: 3 }}>
                                                💬
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                                                {stats.totalReviews}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Reviews
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        {/* Venues Grid */}
                        {venues.length === 0 ? (
                            <Card sx={{ textAlign: 'center', py: 6 }}>
                                <CardContent>
                                    <BusinessCenter sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                                        No venues yet
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                        Start sharing your space with event organizers by creating your first venue listing.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={handleCreateVenue}
                                        size="large"
                                    >
                                        Create Your First Venue
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <Grid container spacing={3}>
                                {formattedVenues.map((venue) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={venue._id}>
                                        <VenueCard
                                            venue={venue}
                                            variant="my-venues"
                                            onViewDetails={handleViewVenue}
                                            onEdit={handleEditVenue}
                                            onDelete={handleDeleteVenue}
                                            onToggleActive={handleToggleActive}
                                            isAuthenticated={true}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Fade>
            </Container>

            <Footer />
        </Box>
    );
}