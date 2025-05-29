import React from 'react';
import {Box} from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthCard({isLogin, toggleMode}) {
    return (
        <Box
            sx={{
                flex: {xs: 0, md: 1},
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'white',
                position: 'relative',
                borderRadius: { xs: 6, md: 6 },
                marginLeft: {xs: 0, md: -4},
                marginTop: {xs: -4, md: 0},
                zIndex: 2
            }}
        >
            {isLogin ? (
                <LoginForm toggleMode={toggleMode}/>
            ) : (
                <RegisterForm toggleMode={toggleMode}/>
            )}
        </Box>
    );
}