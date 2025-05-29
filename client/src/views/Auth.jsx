import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AuthSidebar from '../components/auth/AuthSidebar';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    const handleClose = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                position: 'relative'
            }}
        >
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 10,
                    color: {xs: 'white', md: 'rgba(0, 0, 0, 0.54)'}
                }}
            >
                <Close />
            </IconButton>

            <AuthSidebar />
            <AuthCard isLogin={isLogin} toggleMode={toggleMode} />
        </Box>
    );
}