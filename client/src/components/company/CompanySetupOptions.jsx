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
    Info
} from '@mui/icons-material';

export default function CompanySetupOptions({ onProceedToForm, onSwitchToRenter }) {
    return (
        <Box>
            <Grid container spacing={3} justifyContent="center">
                {/* Continue as Owner Option */}
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
                            <Business
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
                                Continue as Venue Owner
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Register your company details to start listing and managing venues on our platform.
                            </Typography>

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
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={onProceedToForm}
                                startIcon={<Business />}
                                sx={{ py: 1.5 }}
                            >
                                Set Up Company Profile
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Switch to Renter Option */}
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
                                Switch to Renter
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                If you prefer to search and book venues rather than list them, you can switch to an event organizer account.
                            </Typography>

                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    As a renter you can:
                                </Typography>
                                {[
                                    'Search and filter venues',
                                    'Save favorite venues',
                                    'Send booking requests',
                                    'Make reviews and ratings'
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
                                color="primary"
                                size="large"
                                onClick={onSwitchToRenter}
                                startIcon={<Person />}
                                sx={{ py: 1.5 }}
                            >
                                Switch to Renter
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
                    Need Help?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    You can always change your account type later in your profile settings.
                    If you're unsure, you can start as an event organizer and upgrade to venue owner when ready.
                </Typography>
            </Box>
        </Box>
    );
}