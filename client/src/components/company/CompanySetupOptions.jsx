import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider
} from '@mui/material';
import {
    Business,
    Person,
    CheckCircle,
    Info,
    TrendingUp
} from '@mui/icons-material';

export default function CompanySetupOptions({ onProceedToForm, onSwitchToRenter, fromCreateListing = false }) {
    return (
        <Box>
            <Grid container spacing={3} justifyContent="center">
                {/* Upgrade to Owner Option */}
                <Grid item xs={12} md={6}>
                    <Card
                        elevation={2}
                        sx={{
                            height: '100%',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-4px)'
                            }
                        }}
                    >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <TrendingUp
                                sx={{
                                    fontSize: 64,
                                    color: 'primary.main',
                                    mb: 2
                                }}
                            />
                            <Typography
                                variant="h5"
                                component="h3"
                                sx={{ fontWeight: 600, mb: 2 }}
                            >
                                {fromCreateListing ? 'Upgrade to List Venues' : 'Upgrade to Venue Owner'}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Register your company details to unlock venue listing and management features on our platform.
                            </Typography>

                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    What you'll get:
                                </Typography>
                                {[
                                    'List unlimited venues',
                                    'Manage bookings and requests',
                                    'Access to owner dashboard',
                                    'Revenue tracking tools'
                                ].map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <CheckCircle
                                            sx={{
                                                fontSize: 16,
                                                color: 'success.main',
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2">{item}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    What you'll need:
                                </Typography>
                                {[
                                    'Company name',
                                    'NIP number (10 digits)',
                                    'REGON number (9 or 14 digits)',
                                    'Business address'
                                ].map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <Business
                                            sx={{
                                                fontSize: 16,
                                                color: 'primary.main',
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2">{item}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>

                        <CardActions sx={{ p: 3, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={onProceedToForm}
                                startIcon={<TrendingUp />}
                                sx={{ py: 1.5 }}
                            >
                                {fromCreateListing ? 'Upgrade & Create Listing' : 'Upgrade to Owner Account'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Stay as Renter Option */}
                <Grid item xs={12} md={6}>
                    <Card
                        elevation={1}
                        sx={{
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Person
                                sx={{
                                    fontSize: 64,
                                    color: 'secondary.main',
                                    mb: 2
                                }}
                            />
                            <Typography
                                variant="h5"
                                component="h3"
                                sx={{ fontWeight: 600, mb: 2 }}
                            >
                                {fromCreateListing ? 'Continue Browsing Venues' : 'Stay as Event Organizer'}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                {fromCreateListing
                                    ? 'Not ready to list venues yet? You can always come back later and upgrade your account when you\'re ready.'
                                    : 'Continue with your current account to search and book venues for your events. You can always upgrade later.'
                                }
                            </Typography>

                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Your current features:
                                </Typography>
                                {[
                                    'Search and filter venues',
                                    'Save favorite venues',
                                    'Send booking requests',
                                    'Manage your events'
                                ].map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <CheckCircle
                                            sx={{
                                                fontSize: 16,
                                                color: 'success.main',
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2">{item}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>

                        <CardActions sx={{ p: 3, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                size="large"
                                onClick={onSwitchToRenter}
                                startIcon={<Person />}
                                sx={{ py: 1.5 }}
                            >
                                {fromCreateListing ? 'Back to Home' : 'Continue as Event Organizer'}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Info Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: 'grey.50',
                    borderRadius: 2
                }}
            >
                <Info sx={{ color: 'info.main', fontSize: 32, mb: 1 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    No Pressure!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    You can always upgrade to venue owner later from your profile settings.
                    Start exploring venues now and upgrade when you're ready to list your own!
                </Typography>
            </Box>
        </Box>
    );
}