import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        id: 1,
        name: 'Wedding & Banquet Halls',
        image: '/home/weddingAndBanquetHalls.jpg',
        count: 125
    },
    {
        id: 2,
        name: 'Conference & Meeting Rooms',
        image: '/home/conferenceAndMeetingRooms.jpg',
        count: 87
    },
    {
        id: 3,
        name: 'Outdoor & Garden Spaces',
        image: '/home/outdoorAndGardenSpaces.jpg',
        count: 64
    },
    {
        id: 4,
        name: 'Clubs & Bars',
        image: '/home/clubsAndBars.jpg',
        count: 102
    },
    {
        id: 5,
        name: 'Lofts & Industrial Venues',
        image: '/home/loftsAndIndustrialVenues.jpg',
        count: 45
    },
    {
        id: 6,
        name: 'Unique & Themed Spaces',
        image: '/home/uniqueAndThemedSpaces.jpg',
        count: 38
    }
];

export default function CategoriesSection() {
    const navigate = useNavigate();

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

            <Grid container spacing={3}>
                {categories.map((category) => (
                    <Grid item xs={6} sm={4} md={4} lg={2} key={category.id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <CardActionArea onClick={() => handleCategoryClick(category)}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        paddingTop: '100%',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={category.image}
                                        alt={category.name}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
                                            zIndex: 1
                                        }}
                                    />
                                </Box>
                                <CardContent
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        color: 'white',
                                        zIndex: 2,
                                        p: 2
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            fontSize: { xs: '0.875rem', md: '1rem' }
                                        }}
                                    >
                                        {category.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            opacity: 0.9,
                                            fontSize: { xs: '0.75rem', md: '0.875rem' }
                                        }}
                                    >
                                        {category.count} venues
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}