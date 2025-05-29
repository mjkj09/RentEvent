import React, {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Link,
    IconButton,
    Divider
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock
} from '@mui/icons-material';
import FormField from '../common/FormField';

export default function LoginForm({toggleMode}) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login attempted with:', formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{mb: 1, fontWeight: 600, color: 'text.primary'}}>
                Welcome back
            </Typography>
            <Typography variant="body1" sx={{mb: 4, color: 'text.secondary'}}>
                Enter your credentials to access your account
            </Typography>

            <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange('email')}
                startIcon={<Email color="action"/>}
            />

            <FormField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange('password')}
                startIcon={<Lock color="action"/>}
                endIcon={
                    <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                }
            />

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Link href="#" underline="hover" sx={{color: 'text.secondary', fontSize: '0.875rem'}}>
                    Forgot Password?
                </Link>
            </Box>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                sx={{mb: 4}}
            >
                Sign In
            </Button>

            <Divider sx={{mb: 4}}>
                <Typography variant="body2" color="text.secondary">
                    Don't have an account?
                </Typography>
            </Divider>

            <Box sx={{textAlign: 'center'}}>
                <Link
                    component="button"
                    type="button"
                    onClick={toggleMode}
                    underline="hover"
                    sx={{color: 'primary.main', fontWeight: 500}}
                >
                    Create Account
                </Link>
            </Box>
        </Box>
    );
}