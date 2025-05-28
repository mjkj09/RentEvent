import React from 'react';
import {Box, Button, Paper, Typography} from '@mui/material';

export default function HeroBanner() {
    return (
        <Paper elevation={8} sx={{p: 4, mb: 4, textAlign: 'center', backgroundColor: 'primary.main', borderRadius: 6}}>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                <img src="../../../public/logo/logo.svg" alt="RentEvent Logo" height="80"/>
            </Box>
            <Typography variant="h5" color="white">
                Your comprehensive assistant for organizing events.
            </Typography>

            <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', mt: 3}}>
                <Button variant="contained" color="secondary" size="large">
                    GET STARTED
                </Button>
                <Button variant="outlined" color="secondary" size="large">
                    LOG IN
                </Button>
            </Box>
        </Paper>
    );
}