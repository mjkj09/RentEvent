import React, {useState} from 'react';
import {
    Box,
    Typography,
    Button,
    Link,
    IconButton,
    Divider,
    FormControl,
    Select,
    MenuItem,
    Grid,
    InputAdornment
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
    Business
} from '@mui/icons-material';
import FormField from '../common/FormField';

export default function RegisterForm({toggleMode}) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        accountType: 'renter'
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
        console.log('Registration attempted with:', formData);
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
            />

            <Box sx={{mb: 3}}>
                <Typography variant="body2" sx={{mb: 1, fontWeight: 500}}>
                    Account Type
                </Typography>
                <FormControl fullWidth>
                    <Select
                        variant="outlined"
                        value={formData.accountType}
                        onChange={handleChange('accountType')}
                        startAdornment={
                            <InputAdornment position="start">
                                <Business color="action"/>
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="renter">Event Organizer (Renter)</MenuItem>
                        <MenuItem value="owner">Venue Owner</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <FormField
                sx={{mb: 4}}
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
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                sx={{mb: 3}}
            >
                Create Account
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