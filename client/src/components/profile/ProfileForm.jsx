import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Grid,
    Divider,
    IconButton,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    Lock,
    Visibility,
    VisibilityOff,
    Save,
    Edit,
    Cancel
} from '@mui/icons-material';

export default function ProfileForm({ user, onUpdate, loading }) {
    const [editing, setEditing] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.surname.trim()) {
            newErrors.surname = 'Surname is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.phone && !/^[+]?[0-9\s\-\(\)]{9,20}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required';
            }
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const updateData = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            phone: formData.phone
        };

        if (formData.newPassword) {
            updateData.currentPassword = formData.currentPassword;
            updateData.newPassword = formData.newPassword;
        }

        try {
            await onUpdate(updateData);
            setEditing(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            // Error handled by parent
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            surname: user?.surname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
        setEditing(false);
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        Personal Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            label={user?.role === 'owner' ? 'Venue Owner' : 'Event Organizer'}
                            color={user?.role === 'owner' ? 'primary' : 'secondary'}
                            size="small"
                        />
                        {!editing && (
                            <IconButton
                                onClick={() => setEditing(true)}
                                color="primary"
                                size="small"
                            >
                                <Edit />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={formData.name}
                                onChange={handleChange('name')}
                                disabled={!editing}
                                error={!!errors.name}
                                helperText={errors.name}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={formData.surname}
                                onChange={handleChange('surname')}
                                disabled={!editing}
                                error={!!errors.surname}
                                helperText={errors.surname}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                disabled={!editing}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange('phone')}
                                disabled={!editing}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                placeholder="+48 123 456 789"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {editing && (
                            <>
                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Change Password (Optional)
                                        </Typography>
                                    </Divider>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        type={showPasswords ? "text" : "password"}
                                        value={formData.currentPassword}
                                        onChange={handleChange('currentPassword')}
                                        error={!!errors.currentPassword}
                                        helperText={errors.currentPassword}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPasswords(!showPasswords)}
                                                        edge="end"
                                                    >
                                                        {showPasswords ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type={showPasswords ? "text" : "password"}
                                        value={formData.newPassword}
                                        onChange={handleChange('newPassword')}
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        type={showPasswords ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleChange('confirmPassword')}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>

                    {editing && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                startIcon={<Cancel />}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={loading}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}