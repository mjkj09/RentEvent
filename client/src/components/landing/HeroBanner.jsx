import React from 'react';
import {Box, Button, Paper, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import logoSvg from '/logo/logo.svg'

export default function HeroBanner() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/auth');
    };


    return (
        <Paper elevation={8} sx={{p: 4, mb: 4, textAlign: 'center', borderRadius: 8, backgroundColor: 'primary.main'}}>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                <img src={logoSvg} alt="RentEvent Logo" height="80"/>
            </Box>
            <Typography variant="h5" color="white">
                Your comprehensive assistant for organizing events.
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                <Button variant="contained" color="secondary" size="large" onClick={handleGetStarted}>
                    GET STARTED
                </Button>
            </Box>
        </Paper>
    );
}
