import React from 'react';
import { Box, Typography } from '@mui/material';
import logoSvg from '/logo/logo.svg'

export default function AuthSidebar() {
    return (
        <Box
            sx={{
                flex: { xs: 'none', md: 1 },
                width: { xs: '100%', md: 'auto' },
                minHeight: { xs: '200px', md: '100vh' },
                backgroundColor: 'primary.main',
                color: 'white',
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: { xs: 'center', md: 'flex-start' },
                position: 'relative',
                height: { md: 'auto' }
            }}
        >
            <Box 
                sx={{
                    position: 'sticky',
                    top: '15vh',
                    zIndex: 2,
                    textAlign: { xs: 'center', md: 'left' }
                }}
            >
                <Box sx={{ mb: { xs: 2, md: 4 } }}>
                    <img
                        src={logoSvg}
                        alt="RentEvent Logo"
                        height="48"
                    />
                </Box>

                <Typography variant="h3" sx={{ mb: { xs: 2, md: 3 }, mr: { md: 3 }, fontWeight: 700, fontSize: { xs: '1.8rem', md: '3rem' } }}>
                    Discover tailored events.
                </Typography>

                <Typography variant="h5" sx={{ mb: { xs: 6, md: 4 }, mr: { md: 3 }, fontWeight: 400, opacity: 0.9, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Sign up for personalized recommendations today!
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        opacity: 0.8,
                        lineHeight: 1.6,
                        mr: 3,
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    Join thousands of event organizers and venue owners who trust RentEvent
                    to create memorable experiences. Whether you're planning a wedding,
                    corporate event, or celebration, we've got the perfect venue waiting for you.
                </Typography>
            </Box>
        </Box>
    );
}
