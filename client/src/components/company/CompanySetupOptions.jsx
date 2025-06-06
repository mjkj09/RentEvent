import React from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import {
    Business,
    Person,
    ArrowForward,
    Home
} from '@mui/icons-material';

export default function CompanySetupOptions({ onProceedToForm, onSwitchToRenter, fromCreateListing }) {
    return (
        <Grid container spacing={3}>
            {/* Upgrade to Owner Option */}
            <Grid item size={{xs: 12, md: 6}}>
                <Card
                    sx={{
                        height: '100%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        position: 'relative',
                        '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Chip
                        label="Recommended"
                        color="primary"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16
                        }}
                    />

                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Business
                                sx={{
                                    fontSize: 48,
                                    color: 'primary.main',
                                    mb: 2
                                }}
                            />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1
                                }}
                            >
                                Become a Venue Owner
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                {fromCreateListing
                                    ? 'Upgrade your account to start listing venues and earning from your space'
                                    : 'Start listing your venues and connect with event organizers'
                                }
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                What you'll get:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    List unlimited venues
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Manage bookings and requests
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Analytics and insights
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Professional company profile
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={onProceedToForm}
                            endIcon={<ArrowForward />}
                            sx={{ py: 1.5 }}
                        >
                            Set Up Company Profile
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Continue as Renter Option */}
            <Grid item size={{xs: 12, md: 6}}>
                <Card
                    sx={{
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        '&:hover': {
                            boxShadow: 2,
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Person
                                sx={{
                                    fontSize: 48,
                                    color: 'text.secondary',
                                    mb: 2
                                }}
                            />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1
                                }}
                            >
                                Continue as Event Organizer
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                {fromCreateListing
                                    ? 'Browse and book venues for your events (you can upgrade later)'
                                    : 'Browse and book venues for your events'
                                }
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                What you can do:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Search and filter venues
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Save favorite venues
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Send booking requests
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Manage your event planning
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            onClick={onSwitchToRenter}
                            endIcon={<Home />}
                            sx={{ py: 1.5 }}
                        >
                            {fromCreateListing ? 'Browse Venues Instead' : 'Continue to Platform'}
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}