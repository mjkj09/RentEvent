import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Alert,
    Fade,
    Card,
    CardContent,
    Button
} from '@mui/material';
import {
    Favorite,
    Search as SearchIcon,
    Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import SearchResults from '../components/search/SearchResults';
import favoritesService from '../services/favorites.service';
import { formatVenueForDisplay, scrollToTop } from '../utils/searchUtils';

export default function Favourites() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        // Auto-scroll to top when component mounts
        scrollToTop();

        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/auth');
                return;
            }
            loadFavorites();
        }
    }, [isAuthenticated, authLoading, navigate]);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            const favoriteVenues = await favoritesService.getFavorites();
            setVenues(favoriteVenues);
            setFavorites(favoriteVenues.map(venue => venue._id));
        } catch (err) {
            setError(err.message || 'Failed to load favorite venues');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async (venueId) => {
        try {
            const currentStatus = favorites.includes(venueId);
            const newStatus = await favoritesService.toggleFavorite(venueId, currentStatus);

            if (newStatus) {
                // Added to favorites (shouldn't happen in this view)
                setFavorites(prev => [...prev, venueId]);
            } else {
                // Removed from favorites
                setFavorites(prev => prev.filter(id => id !== venueId));
                setVenues(prev => prev.filter(venue => venue._id !== venueId));
            }
        } catch (err) {
            // Handle error silently
        }
    };

    const handleVenueClick = (venueId) => {
        navigate(`/venue/${venueId}`);
    };

    const handleBrowseVenues = () => {
        navigate('/search');
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    if (authLoading || loading) {
        return <PageLoader message="Loading your favorite venues..." />;
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    // Format venues for display
    const formattedVenues = venues.map(formatVenueForDisplay);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
                <Fade in timeout={600}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                mb: 2
                            }}>
                                <Favorite
                                    sx={{
                                        fontSize: { xs: '2rem', md: '3rem' },
                                        color: 'error.main'
                                    }}
                                />
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'primary.main',
                                        fontSize: { xs: '2rem', md: '3rem' }
                                    }}
                                >
                                    My Favourites
                                </Typography>
                            </Box>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', md: '1.25rem' }
                                }}
                            >
                                {venues.length > 0
                                    ? `You have ${venues.length} favorite venue${venues.length === 1 ? '' : 's'} saved`
                                    : 'Discover and save venues you love for easy access later'
                                }
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Empty State */}
                        {venues.length === 0 && !loading ? (
                            <Card sx={{ textAlign: 'center', py: 6 }}>
                                <CardContent>
                                    <Favorite sx={{
                                        fontSize: 80,
                                        color: 'text.secondary',
                                        mb: 3,
                                        opacity: 0.5
                                    }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                                        No favorites yet
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}>
                                        Start exploring venues and click the heart icon to save your favorites.
                                        They'll appear here for quick access when planning your next event.
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 2,
                                        justifyContent: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SearchIcon />}
                                            onClick={handleBrowseVenues}
                                            size="large"
                                        >
                                            Browse Venues
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<HomeIcon />}
                                            onClick={handleGoHome}
                                            size="large"
                                        >
                                            Go Home
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Results Count */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3,
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}>
                                    <Typography variant="h6" color="text.secondary">
                                        {venues.length} favorite venue{venues.length === 1 ? '' : 's'}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<SearchIcon />}
                                        onClick={handleBrowseVenues}
                                    >
                                        Find More Venues
                                    </Button>
                                </Box>

                                {/* Venues Grid */}
                                <SearchResults
                                    venues={formattedVenues}
                                    favorites={favorites}
                                    onToggleFavorite={handleToggleFavorite}
                                    onVenueClick={handleVenueClick}
                                />
                            </>
                        )}
                    </Box>
                </Fade>
            </Container>

            <Footer />
        </Box>
    );
}