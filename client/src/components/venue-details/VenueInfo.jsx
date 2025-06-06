import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Grid,
    Divider,
    Avatar,
    Button
} from '@mui/material';
import {
    LocationOn,
    Category,
    People,
    CalendarToday,
    Euro,
    Business,
    ContactPhone
} from '@mui/icons-material';

export default function VenueInfo({ venue, onContactOwner }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPriceRange = () => {
        if (venue.pricing.isPriceHidden || (!venue.pricing.minPricePerPerson && !venue.pricing.maxPricePerPerson)) {
            return 'Ask for an offer';
        }

        if (venue.pricing.minPricePerPerson === venue.pricing.maxPricePerPerson) {
            return `PLN ${venue.pricing.minPricePerPerson} / guest`;
        }

        if (venue.pricing.maxPricePerPerson) {
            return `PLN ${venue.pricing.minPricePerPerson}-${venue.pricing.maxPricePerPerson} / guest`;
        }

        return `From PLN ${venue.pricing.minPricePerPerson} / guest`;
    };

    const getInitials = (name, surname) => {
        const firstInitial = name ? name.charAt(0).toUpperCase() : '';
        const lastInitial = surname ? surname.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    // Format description with preserved line breaks
    const formatDescription = (text) => {
        if (!text) return 'No description available for this venue.';

        // Split by double line breaks to create paragraphs
        const paragraphs = text.split('\n\n').filter(p => p.trim());

        return paragraphs.map((paragraph, index) => (
            <Typography
                key={index}
                variant="body1"
                sx={{
                    lineHeight: 1.7,
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    mb: index < paragraphs.length - 1 ? 2 : 0, // Add margin between paragraphs
                    whiteSpace: 'pre-line' // Preserves single line breaks within paragraphs
                }}
            >
                {paragraph.trim()}
            </Typography>
        ));
    };

    // Standard tile styling
    const tileStyle = {
        p: 3,
        backgroundColor: 'grey.50',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        height: '100%', // Ensures all tiles have the same height
        display: 'flex',
        flexDirection: 'column'
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

    const isPriceHidden = venue.pricing.isPriceHidden || (!venue.pricing.minPricePerPerson && !venue.pricing.maxPricePerPerson);

    return (
        <Box sx={{ mb: 4 }}>
            {/* Description Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    About This Venue
                </Typography>

                {/* Description with preserved formatting */}
                <Box sx={{ mb: 4 }}>
                    {formatDescription(venue.description)}
                </Box>

                {/* Status Chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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

            {/* Venue Details Grid - Fixed Height */}
            <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Venue Details
                </Typography>

                <Grid container spacing={3} sx={{ mb: 0 }}>
                    {venueFeatures.map((feature, index) => (
                        <Grid item size={{ xs: 12, sm: 6 }} key={index}>
                            <Box sx={tileStyle}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
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
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Unified Booking & Owner Section */}
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Booking & Contact Information
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Pricing Tile */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Box sx={tileStyle}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Euro color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Pricing
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: isPriceHidden ? 'text.secondary' : 'secondary.main',
                                        mb: 1
                                    }}
                                >
                                    {formatPriceRange()}
                                </Typography>

                                {isPriceHidden && (
                                    <Chip
                                        label="Contact for pricing"
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Owner Tile */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Box sx={tileStyle}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <ContactPhone color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Venue Owner
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        backgroundColor: 'primary.main',
                                        fontSize: '1.2rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {getInitials(venue.owner.name, venue.owner.surname)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        {venue.owner.name} {venue.owner.surname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Property Owner
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Company Tile */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Box sx={tileStyle}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Business color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Company
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                {venue.ownerCompany ? (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                            {venue.ownerCompany.name}
                                        </Typography>
                                        {venue.company?.nip && (
                                            <Typography variant="body2" color="text.secondary">
                                                NIP: {venue.company.nip}
                                            </Typography>
                                        )}
                                    </>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No company information available
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 4 }} />

                {/* Contact Action */}
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={<ContactPhone />}
                        onClick={onContactOwner}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        Contact Owner for Booking
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                        Get detailed information, pricing, and availability
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}