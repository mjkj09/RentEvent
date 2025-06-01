import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button
} from '@mui/material';
import {Business} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';

export default function CreateListingHero() {
    const navigate = useNavigate();
    const {user} = useAuth();

    const handleCreateListing = () => {
        // Check if user is an owner
        if (user?.role === 'owner') {
            navigate('/venues/create');
        } else {
            // Redirect to auth with a message or show a modal
            navigate('/auth?message=owner-only');
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                backgroundImage: `url('/home/heroCreateEvent.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: 'auto',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                mb: 8,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: {xs: 3, lg: 5},
                        flexDirection: {xs: 'column', lg: 'row'},
                        pl: {lg: '200px'}
                    }}
                >
                    <Box sx={{
                        flex: 1,
                        textAlign: {xs: 'center', lg: 'left'}
                    }}>
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'secondary.main',
                                fontWeight: 700,
                                mt: 4,
                                mb: 2,
                                fontSize: {xs: '1.75rem', sm: '2rem', md: '2.5rem'}
                            }}
                        >
                            List Your Venue on RentEvent
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'secondary.main',
                                mb: {xs: 2, lg: 4},
                                fontWeight: 400,
                                fontSize: {xs: '1rem', md: '1.25rem'},
                                maxWidth: {md: '600px'}
                            }}
                        >
                            Have a unique space or location for events? Partner with us and showcase your venue
                            to thousands of planners looking for the perfect place.
                        </Typography>
                    </Box>

                    <Box sx={{
                        flexShrink: 0,
                        mb: {xs: 4, lg: 0}
                    }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            startIcon={<Business/>}
                            onClick={handleCreateListing}
                            sx={{
                                px: {xs: 3, lg: 4},
                                py: 1.5,
                                fontSize: {xs: '1rem', md: '1.1rem'},
                            }}
                        >
                            Create Listing
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}