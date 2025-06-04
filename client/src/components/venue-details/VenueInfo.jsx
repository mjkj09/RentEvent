import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Grid,
    Divider,
    Avatar,
    Link,
    Button
} from '@mui/material';
import {
    LocationOn,
    Category,
    People,
    CalendarToday,
    Euro,
    Business,
    Person,
    Email,
    Phone,
    Language,
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

    const formatPhoneNumber = (phone) => {
        if (!phone) return null;
        return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    };

    const getInitials = (name, surname) => {
        const firstInitial = name ? name.charAt(0).toUpperCase() : '';
        const lastInitial = surname ? surname.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
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

                <Typography
                    variant="body1"
                    sx={{
                        lineHeight: 1.7,
                        color: 'text.primary',
                        fontSize: '1.1rem',
                        mb: 4
                    }}
                >
                    {venue.description || 'No description available for this venue.'}
                </Typography>

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

            {/* Venue Details Grid */}
            <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
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
                                    p: 3,
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
            </Paper>

            {/* Pricing Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Pricing & Booking
                </Typography>

                <Grid container spacing={4}>
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                                <Euro color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Pricing
                                </Typography>
                            </Box>

                            <Typography
                                variant="h4"
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
                                    label="Contact for pricing details"
                                    color="secondary"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                                <People color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Capacity
                                </Typography>
                            </Box>

                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                                Up to {venue.capacity}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                guests
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={<ContactPhone />}
                        onClick={onContactOwner}
                        sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
                    >
                        Contact Owner for Booking
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Get detailed information and availability
                    </Typography>
                </Box>
            </Paper>

            {/* Owner & Company Information */}
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Owner Information
                </Typography>

                <Grid container spacing={4}>
                    {/* Owner Info */}
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    backgroundColor: 'primary.main',
                                    fontSize: '1.5rem',
                                    fontWeight: 600
                                }}
                            >
                                {getInitials(venue.owner.name, venue.owner.surname)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {venue.owner.name} {venue.owner.surname}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Venue Owner
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Company Info */}
                    {venue.ownerCompany && (
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Business color="primary" fontSize="small" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Company Details
                                    </Typography>
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    {venue.ownerCompany.name}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {venue.ownerCompany.contactEmail && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Email fontSize="small" color="action" />
                                            <Link
                                                href={`mailto:${venue.ownerCompany.contactEmail}`}
                                                sx={{
                                                    color: 'text.primary',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {venue.ownerCompany.contactEmail}
                                            </Link>
                                        </Box>
                                    )}

                                    {venue.ownerCompany.contactPhone && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone fontSize="small" color="action" />
                                            <Link
                                                href={`tel:${venue.ownerCompany.contactPhone}`}
                                                sx={{
                                                    color: 'text.primary',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {formatPhoneNumber(venue.ownerCompany.contactPhone)}
                                            </Link>
                                        </Box>
                                    )}

                                    {venue.ownerCompany.website && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Language fontSize="small" color="action" />
                                            <Link
                                                href={venue.ownerCompany.website.startsWith('http') ? venue.ownerCompany.website : `https://${venue.ownerCompany.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    color: 'text.primary',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {venue.ownerCompany.website}
                                            </Link>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Interested in this venue? Contact the owner for more details
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<ContactPhone />}
                        onClick={onContactOwner}
                        sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                    >
                        Send Message
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Usually responds within 24 hours
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}