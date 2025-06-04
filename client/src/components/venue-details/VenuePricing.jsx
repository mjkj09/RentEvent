import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Divider,
    Chip
} from '@mui/material';
import {
    People,
    Euro,
    ContactPhone,
    Email
} from '@mui/icons-material';

export default function VenuePricing({ pricing, capacity, onContactOwner }) {
    const formatPriceRange = () => {
        if (pricing.isPriceHidden || (!pricing.minPricePerPerson && !pricing.maxPricePerPerson)) {
            return 'Ask for an offer';
        }

        if (pricing.minPricePerPerson === pricing.maxPricePerPerson) {
            return `PLN ${pricing.minPricePerPerson} / guest`;
        }

        if (pricing.maxPricePerPerson) {
            return `PLN ${pricing.minPricePerPerson}-${pricing.maxPricePerPerson} / guest`;
        }

        return `From PLN ${pricing.minPricePerPerson} / guest`;
    };

    const isPriceHidden = pricing.isPriceHidden || (!pricing.minPricePerPerson && !pricing.maxPricePerPerson);

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                mb: 3,
                position: { md: 'sticky' },
                top: { md: 24 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}
        >
            {/* Price Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Pricing
                </Typography>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: isPriceHidden ? 'text.secondary' : 'secondary.main',
                        mb: 2
                    }}
                >
                    {formatPriceRange()}
                </Typography>

                {isPriceHidden && (
                    <Chip
                        label="Contact for pricing details"
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Capacity Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <People color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Capacity
                    </Typography>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Up to {capacity} guests
                </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Contact Actions - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<Email />}
                    onClick={onContactOwner}
                    sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        mb: 2,
                        borderRadius: 2
                    }}
                >
                    Contact Owner
                </Button>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', fontSize: '0.875rem' }}
                >
                    Get detailed information and availability
                </Typography>
            </Box>
        </Paper>
    );
}