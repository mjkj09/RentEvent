import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Grid
} from '@mui/material';
import {
    LocationOn,
    Category,
    People,
    CalendarToday
} from '@mui/icons-material';

export default function VenueInfo({ venue }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const venueFeatures = [
        {
            icon: <Category color="primary" />,
            label: 'Category',
            value: venue.category
        },
        {
            icon: <LocationOn color="primary" />,
            label: 'Full Address',
            value: `${venue.location.street}, ${venue.location.city}, ${venue.location.region}`
        },
        {
            icon: <People color="primary" />,
            label: 'Maximum Capacity',
            value: `${venue.capacity} guests`
        },
        {
            icon: <CalendarToday color="primary" />,
            label: 'Listed Since',
            value: formatDate(venue.createdAt)
        }
    ];

    return (
        <Box sx={{ mb: 4 }}>
            {/* Description Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    About This Venue
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.7,
                        color: 'text.primary',
                        fontSize: '1.1rem'
                    }}
                >
                    {venue.description || 'No description available for this venue.'}
                </Typography>
            </Paper>

            {/* Venue Details Grid */}
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Venue Details
                </Typography>

                <Grid container spacing={3}>
                    {venueFeatures.map((feature, index) => (
                        <Grid item size={{ xs: 12, sm: 6 }} key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    p: 2,
                                    backgroundColor: 'grey.50',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.200'
                                }}
                            >
                                <Box sx={{ mt: 0.5 }}>
                                    {feature.icon}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            mb: 0.5,
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        {feature.label}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {feature.value}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Status Chip */}
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Chip
                        label={venue.isActive ? 'Available for Booking' : 'Currently Unavailable'}
                        color={venue.isActive ? 'success' : 'default'}
                        variant="outlined"
                    />
                    {venue.category && (
                        <Chip
                            label={venue.category}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
}