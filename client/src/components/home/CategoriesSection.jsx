import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import venueService from '../../services/venue.service';

const categories = [
    {
        id: 1,
        name: 'Wedding & Banquet Halls',
        image: '/home/weddingAndBanquetHalls.jpg'
    },
    {
        id: 2,
        name: 'Conference & Meeting Rooms',
        image: '/home/conferenceAndMeetingRooms.jpg'
    },
    {
        id: 3,
        name: 'Outdoor & Garden Spaces',
        image: '/home/outdoorAndGardenSpaces.jpg'
    },
    {
        id: 4,
        name: 'Clubs & Bars',
        image: '/home/clubsAndBars.jpg'
    },
    {
        id: 5,
        name: 'Lofts & Industrial Venues',
        image: '/home/loftsAndIndustrialVenues.jpg'
    },
    {
        id: 6,
        name: 'Unique & Themed Spaces',
        image: '/home/uniqueAndThemedSpaces.jpg'
    }
];

export default function CategoriesSection() {
    const [categoryStats, setCategoryStats] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadCategoryStats();
    }, []);

    const loadCategoryStats = async () => {
        try {
            setLoading(true);
            const stats = await venueService.getCategoryStats();
            setCategoryStats(stats);
        } catch (err) {
            // Handle error silently
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        navigate(`/search?category=${encodeURIComponent(category.name)}`);
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
                Explore Categories
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {categories.map((category) => {
                    const count = categoryStats[category.name] || 0;
                    return (
                        <Grid size={{xs: 6, sm: 4, lg: 2}} key={category.id}>
                            <Box
                                onClick={() => handleCategoryClick(category)}
                                sx={{
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        '& .category-image': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.25)'
                                        },
                                        '& .category-name': {
                                            color: 'secondary.main'
                                        }
                                    }
                                }}
                            >
                                <Box
                                    className="category-image"
                                    sx={{
                                        width: { xs: 120, sm: 140, md: 160 },
                                        height: { xs: 120, sm: 140, md: 160 },
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        mx: 'auto',
                                        mb: 2,
                                        position: 'relative',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: '#f5f5f5'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={category.image}
                                        alt={category.name}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 100%)',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </Box>

                                <Typography
                                    className="category-name"
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 0.5,
                                        color: 'text.primary',
                                        transition: 'color 0.3s ease',
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    {category.name} ({loading ? '...' : count})
                                </Typography>
                            </Box>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}