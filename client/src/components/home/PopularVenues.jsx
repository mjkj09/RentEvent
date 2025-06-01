import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VenueCard from '../common/VenueCard';

// Mock data for venues
const mockVenues = [
    {
        id: 1,
        name: 'Royal Banquet Hall',
        category: 'Wedding & Banquet Halls',
        location: 'Krakow, Malopolska',
        capacity: '400 guests',
        rating: 4.8,
        reviews: 14,
        priceRange: 'PLN 400-600 / guest',
        image: '/home/weddingAndBanquetHalls.jpg',
        tags: ['Wedding & Banquet Halls']
    },
    {
        id: 2,
        name: 'Skyline Rooftop Lounge',
        category: 'Unique & Themed Spaces',
        location: 'Warszawa, Mazowieckie',
        capacity: '150 guests',
        rating: 4.6,
        reviews: 16,
        priceRange: 'PLN 450 / guest',
        image: '/home/uniqueAndThemedSpaces.jpg',
        tags: ['Unique & Themed Spaces']
    },
    {
        id: 3,
        name: 'Cozy Basement Pub',
        category: 'Clubs & Bars',
        location: 'Gdansk, Pomorskie',
        capacity: 'Ask for an offer',
        rating: 4.5,
        reviews: 8,
        priceRange: 'Ask for an offer',
        image: '/home/clubsAndBars.jpg',
        tags: ['Clubs & Bars']
    },
    {
        id: 4,
        name: 'Lush Garden Estate',
        category: 'Wedding & Banquet Halls',
        location: 'Szaflary, Malopolska',
        capacity: '300 guests',
        rating: 4.9,
        reviews: 48,
        priceRange: 'PLN 200-300 / guest',
        image: '/home/outdoorAndGardenSpaces.jpg',
        tags: ['Wedding & Banquet Halls']
    },
    {
        id: 5,
        name: 'Modern Conference Center',
        category: 'Conference & Meeting Rooms',
        location: 'Poznan, Wielkopolskie',
        capacity: 'Ask for an offer',
        rating: 4.7,
        reviews: 12,
        priceRange: 'Ask for an offer',
        image: '/home/conferenceAndMeetingRooms.jpg',
        tags: ['Conference & Meeting Rooms']
    },
    {
        id: 6,
        name: 'Industrial Loft Space',
        category: 'Lofts & Industrial Venues',
        location: 'Katowice, Slaskie',
        capacity: '370 guests',
        rating: 4.4,
        reviews: 160,
        priceRange: 'PLN 370 / guest',
        image: '/home/loftsAndIndustrialVenues.jpg',
        tags: ['Lofts & Industrial Venues']
    }
];

export default function PopularVenues() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (venueId) => {
        setFavorites(prev =>
            prev.includes(venueId)
                ? prev.filter(id => id !== venueId)
                : [...prev, venueId]
        );
    };

    const handleVenueClick = (venueId) => {
        navigate(`/venue/${venueId}`);
    };

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
                {mockVenues.map((venue) => (
                    <Grid item size={{xs: 12, sm: 6, md: 4}} key={venue.id}>
                        <VenueCard
                            venue={venue}
                            isFavorite={favorites.includes(venue.id)}
                            onToggleFavorite={() => toggleFavorite(venue.id)}
                            onViewDetails={() => handleVenueClick(venue.id)}
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
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1.1rem'
                    }}
                >
                    See More
                </Button>
            </Box>
        </Container>
    );
}