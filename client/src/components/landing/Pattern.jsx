import React from 'react';
import { Box } from '@mui/material';
import backgroundMp4 from '/background/landingPageBackground.mp4';

const Pattern = () => (
    <Box>
        <Box
            component="video"
            src={backgroundMp4}
            autoPlay
            muted
            loop
            playsInline
            sx={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                zIndex: -10,
                background: '#FFFFFF'
            }}
        />
    </Box>
);

export default Pattern;
