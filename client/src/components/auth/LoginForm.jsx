import React, {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Link,
    IconButton,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock
} from '@mui/icons-material';
import FormField from '../common/FormField';
import {useAuth} from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';

export default function LoginForm({toggleMode}) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        if (formError) setFormError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFormError('');

        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
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
                inputProps={{
                    autoComplete: "email"
                }}
                required
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
                inputProps={{
                    autoComplete: "current-password"
                }}
                required
            />

            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                <Link href="#" underline="hover" sx={{color: 'text.secondary', fontSize: '0.875rem'}}>
                    Forgot Password?
                </Link>
            </Box>

            {formError && (
                <Alert severity="error" sx={{mb: 2, mt: 2}}>
                    {formError}
                </Alert>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                sx={{mb: 4, mt: 3}}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit"/> : null}
            >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
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
