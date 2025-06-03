import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export function DotsSpinner({ size = 'medium', message }) {
    const dotSize = size === 'small' ? 8 : size === 'large' ? 16 : 12;
    const containerSize = size === 'small' ? 60 : size === 'large' ? 100 : 80;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    height: containerSize,
                }}
            >
                {[0, 1, 2].map((index) => (
                    <Box
                        key={index}
                        sx={{
                            width: dotSize,
                            height: dotSize,
                            backgroundColor: 'secondary.main',
                            borderRadius: '50%',
                            animation: `${bounce} 1.4s infinite ease-in-out`,
                            animationDelay: `${index * 0.16}s`,
                        }}
                    />
                ))}
            </Box>
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        animation: `${pulse} 2s infinite ease-in-out`,
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export function CircularSpinner({ size = 40, message, thickness = 4 }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}
        >
            <CircularProgress
                size={size}
                thickness={thickness}
                sx={{
                    color: 'secondary.main',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        animation: `${pulse} 2s infinite ease-in-out`,
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export function HybridSpinner({ message }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3
            }}
        >
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Outer circle */}
                <CircularProgress
                    size={60}
                    thickness={2}
                    sx={{
                        color: 'primary.main',
                        opacity: 0.3,
                    }}
                />

                {/* Inner dots */}
                <Box
                    sx={{
                        position: 'absolute',
                        display: 'flex',
                        gap: 0.5,
                    }}
                >
                    {[0, 1, 2].map((index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 6,
                                height: 6,
                                backgroundColor: 'secondary.main',
                                borderRadius: '50%',
                                animation: `${bounce} 1.4s infinite ease-in-out`,
                                animationDelay: `${index * 0.16}s`,
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {message && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        animation: `${pulse} 2s infinite ease-in-out`,
                        fontWeight: 500,
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export default DotsSpinner;