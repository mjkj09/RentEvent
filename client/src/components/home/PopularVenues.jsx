import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import VenueCard from '../common/VenueCard';
import venueService from '../../services/venue.service';
import favoritesService from '../../services/favorites.service';
import { formatVenueForDisplay } from '../../utils/searchUtils';

export default function PopularVenues() {
    const [venues, setVenues] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadPopularVenues();
        if (isAuthenticated) {
            loadUserFavorites();
        }
    }, [isAuthenticated]);

    const loadPopularVenues = async () => {
        try {
            setLoading(true);
            const popularVenues = await venueService.getPopularVenues(6);
            setVenues(popularVenues);
        } catch (err) {
            console.error('Error loading popular venues:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadUserFavorites = async () => {
        if (!isAuthenticated) return;

        try {
            const userFavorites = await favoritesService.getFavorites();
            setFavorites(userFavorites.map(venue => venue._id));
        } catch (err) {
            console.error('Error loading user favorites:', err);
        }
    };

    const handleToggleFavorite = async (venueId) => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        try {
            const currentStatus = favorites.includes(venueId);
            const newStatus = await favoritesService.toggleFavorite(venueId, currentStatus);

            if (newStatus) {
                setFavorites(prev => [...prev, venueId]);
            } else {
                setFavorites(prev => prev.filter(id => id !== venueId));
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const handleVenueClick = (venueId) => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        navigate(`/venue/${venueId}`);
    };

    // Format venues for display
    const formattedVenues = venues.map(formatVenueForDisplay);

    // Don't show section if no venues and still loading
    if (loading || venues.length === 0) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography
                variant="h3"
                component="h2"
                sx={{
                    textAlign: 'center',
                    mb: 5,
                    fontWeight: 600,
                    color: 'text.primary'
                }}
            >
                Popular Venues in Poland
            </Typography>

            <Grid container spacing={3}>
                {formattedVenues.map((venue) => (
                    <Grid size={{xs: 12, sm: 6, md: 4}} key={venue._id}>
                        <VenueCard
                            venue={venue}
                            isFavorite={favorites.includes(venue._id)}
                            onToggleFavorite={() => handleToggleFavorite(venue._id)}
                            onViewDetails={() => handleVenueClick(venue._id)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/search')}
                    sx={{
                        px: 6,
                        py: 1.5,
                        fontSize: '1.1rem'
                    }}
                >
                    See More
                </Button>
            </Box>
        </Container>
    );
}