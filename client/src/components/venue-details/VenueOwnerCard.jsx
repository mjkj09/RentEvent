import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Avatar,
    Divider,
    Link
} from '@mui/material';
import {
    Person,
    Business,
    Email,
    Phone,
    Language,
    ContactPhone
} from '@mui/icons-material';

export default function VenueOwnerCard({ owner, ownerCompany, onContactOwner }) {
    const getInitials = (name, surname) => {
        const firstInitial = name ? name.charAt(0).toUpperCase() : '';
        const lastInitial = surname ? surname.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return null;
        // Simple phone formatting - can be enhanced
        return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                position: { md: 'sticky' },
                top: { md: 24 },
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* Owner Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: 'primary.main',
                        fontSize: '1.25rem',
                        fontWeight: 600
                    }}
                >
                    {getInitials(owner.name, owner.surname)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {owner.name} {owner.surname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Venue Owner
                    </Typography>
                </Box>
            </Box>

            {/* Company Info */}
            {ownerCompany && (
                <>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Business color="primary" fontSize="small" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Company
                            </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            {ownerCompany.name}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {ownerCompany.contactEmail && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email fontSize="small" color="action" />
                                    <Link
                                        href={`mailto:${ownerCompany.contactEmail}`}
                                        sx={{
                                            color: 'text.primary',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {ownerCompany.contactEmail}
                                    </Link>
                                </Box>
                            )}

                            {ownerCompany.contactPhone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone fontSize="small" color="action" />
                                    <Link
                                        href={`tel:${ownerCompany.contactPhone}`}
                                        sx={{
                                            color: 'text.primary',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {formatPhoneNumber(ownerCompany.contactPhone)}
                                    </Link>
                                </Box>
                            )}

                            {ownerCompany.website && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Language fontSize="small" color="action" />
                                    <Link
                                        href={ownerCompany.website.startsWith('http') ? ownerCompany.website : `https://${ownerCompany.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: 'text.primary',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {ownerCompany.website}
                                    </Link>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </>
            )}

            <Divider sx={{ mb: 3 }} />

            {/* Contact Action */}
            <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<ContactPhone />}
                onClick={onContactOwner}
                sx={{
                    py: 1.5,
                    fontWeight: 600
                }}
            >
                Contact Owner
            </Button>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    textAlign: 'center',
                    mt: 2,
                    fontSize: '0.75rem'
                }}
            >
                Usually responds within 24 hours
            </Typography>
        </Paper>
    );
}