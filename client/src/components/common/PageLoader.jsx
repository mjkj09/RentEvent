import React from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { HybridSpinner } from './LoadingSpinner';

export default function PageLoader({ message = "Loading...", fullScreen = true }) {
    const containerStyles = fullScreen
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
        }
        : {
            minHeight: '400px',
            backgroundColor: 'background.default',
            borderRadius: 2,
        };

    return (
        <Fade in timeout={300}>
            <Box
                sx={{
                    ...containerStyles,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <HybridSpinner message={message} />

                {/* Optional branding */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography
                        variant="h6"
                        color="primary.main"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 1,
                            opacity: 0.7,
                        }}
                    >
                        RentEvent
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
}