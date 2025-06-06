import React, {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Link,
    IconButton,
    Divider,
    Grid,
    Alert,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person
} from '@mui/icons-material';
import FormField from '../common/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

export default function RegisterForm({toggleMode, onRegistrationSuccess}) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
        // role removed - everyone starts as renter
    });
    const [formError, setFormError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        isStrong: false,
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const validatePassword = (password) => {
        if (!password) {
            return {
                score: 0,
                isStrong: false,
                message: 'Password is required',
                color: 'error'
            };
        }

        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);

        const result = zxcvbn(password);
        const score = result.score;

        if (!minLength) {
            return {
                score: 0,
                isStrong: false,
                message: 'Password must be at least 8 characters long',
                color: 'error'
            };
        }

        if (!hasUpperCase) {
            return {
                score: 0,
                isStrong: false,
                message: 'Password must contain at least one uppercase letter',
                color: 'error'
            };
        }

        if (!hasLowerCase) {
            return {
                score: 0,
                isStrong: false,
                message: 'Password must contain at least one lowercase letter',
                color: 'error'
            };
        }

        if (!hasDigit) {
            return {
                score: 0,
                isStrong: false,
                message: 'Password must contain at least one number',
                color: 'error'
            };
        }

        let message;
        let color;
        let isStrong;

        switch (score) {
            case 0:
                message = 'Password is too weak - easily guessable';
                color = 'error';
                isStrong = false;
                break;
            case 1:
                message = 'Password meets requirements but could be stronger. You can register now.';
                color = 'warning';
                isStrong = true;
                break;
            case 2:
                message = 'Good password strength. Ready to register!';
                color = 'success';
                isStrong = true;
                break;
            case 3:
                message = 'Strong password. Ready to register!';
                color = 'success';
                isStrong = true;
                break;
            case 4:
                message = 'Very strong password. Ready to register!';
                color = 'success';
                isStrong = true;
                break;
            default:
                message = 'Password strength unknown';
                color = 'error';
                isStrong = false;
        }

        return {
            score,
            isStrong,
            message,
            color
        };
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData({
            ...formData,
            [field]: value
        });

        if (field === 'password') {
            setPasswordStrength(validatePassword(value));
        }

        if (formError) setFormError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isStrong) {
            setFormError(passwordValidation.message);
            return;
        }

        setIsSubmitting(true);
        setFormError('');

        try {
            // Everyone registers as renter - role is set automatically
            await register({
                ...formData,
                role: 'renter'
            });

            // Call the callback to indicate successful registration
            if (onRegistrationSuccess) {
                onRegistrationSuccess();
            }

            // Don't navigate here - let Auth.jsx handle it
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{mb: 1, fontWeight: 600, color: 'text.primary'}}>
                Create Account
            </Typography>
            <Typography variant="body1" sx={{mb: 3, color: 'text.secondary'}}>
                Join RentEvent and start your event planning journey
            </Typography>

            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid item size={{xs: 12, lg: 6}}>
                    <FormField
                        label="First Name"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleChange('firstName')}
                        startIcon={<Person color="action"/>}
                        sx={{mb: 0}}
                        inputProps={{
                            autoComplete: "given-name"
                        }}
                        required
                    />
                </Grid>
                <Grid item size={{xs: 12, lg: 6}}>
                    <FormField
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange('lastName')}
                        startIcon={<Person color="action"/>}
                        sx={{mb: 0}}
                        inputProps={{
                            autoComplete: "family-name"
                        }}
                        required
                    />
                </Grid>
            </Grid>

            <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange('email')}
                startIcon={<Email color="action"/>}
                required
            />

            <FormField
                sx={{mb: 1}}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange('password')}
                startIcon={<Lock color="action"/>}
                endIcon={
                    <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                }
                inputProps={{
                    autoComplete: "new-password"
                }}
                required
            />

            {formData.password && (
                <Box>
                    <LinearProgress
                        variant="determinate"
                        value={(passwordStrength.score || 0) * 25}
                        color={passwordStrength.color || "error"}
                        sx={{ height: 8, borderRadius: 5, mb: 1 }}
                    />
                    <Typography
                        variant="caption"
                        color={passwordStrength.color || "error"}
                        sx={{ display: 'block', fontWeight: 500 }}
                    >
                        {passwordStrength.message}
                    </Typography>
                </Box>
            )}

            {formError && (
                <Alert severity="error" sx={{ mb: 2, mt: 3}}>
                    {formError}
                </Alert>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                sx={{mb: 3, mt: 3}}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Divider sx={{mb: 3}}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?
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
                    Sign In
                </Link>
            </Box>
        </Box>
    );
}