import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    Rating
} from '@mui/material';
import {
    FavoriteBorder,
    Favorite,
    LocationOn,
    People
} from '@mui/icons-material';

export default function VenueCard({ venue, isFavorite, onToggleFavorite, onViewDetails }) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={venue.image}
                    alt={venue.name}
                    sx={{
                        cursor: 'pointer',
                        objectFit: 'cover'
                    }}
                    onClick={onViewDetails}
                />
                <IconButton
                    onClick={onToggleFavorite}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,1)'
                        }
                    }}
                >
                    {isFavorite ? (
                        <Favorite sx={{ color: 'error.main' }} />
                    ) : (
                        <FavoriteBorder />
                    )}
                </IconButton>
                {venue.featured && (
                    <Chip
                        label="Featured"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'secondary.main',
                            color: 'primary.main',
                            fontWeight: 600
                        }}
                    />
                )}
                {venue.tags && venue.tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            left: 12,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            opacity: 0.9
                        }}
                    />
                ))}
            </Box>

            <CardContent sx={{ flex: 1, pb: 1 }}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                            color: 'primary.main'
                        }
                    }}
                    onClick={onViewDetails}
                >
                    {venue.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                        {venue.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                        value={venue.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {venue.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({venue.reviews} reviews)
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                            {venue.capacity}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: venue.priceRange === 'Ask for an offer' ? 'text.secondary' : 'primary.main'
                    }}
                >
                    {venue.priceRange}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={onViewDetails}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
}