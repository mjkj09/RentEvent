import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material';
import {
    Send,
    Person,
    Email,
    Phone,
    Event,
    People,
    Close
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import requestApi from '../../api/request.api';
import userApi from '../../api/user.api';

export default function ContactForm({ venue, onClose }) {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState(null);

    // Initialize form with user data
    const [formData, setFormData] = useState({
        name: user ? `${user.name} ${user.surname}` : '',
        email: user ? user.email : '',
        phone: '',
        eventDate: '',
        eventType: '',
        guestCount: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Load user profile to get phone number
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await userApi.getUserProfile();

                // Extract the user data from the nested structure
                const userData = response.data?.user || response.user;
                setUserProfile(response);

                // Update phone number if available - check both possible structures
                const phoneNumber = userData?.phone || response.data?.user?.phone || response.user?.phone;

                if (phoneNumber) {
                    setFormData(prev => ({
                        ...prev,
                        phone: phoneNumber
                    }));
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };

        if (user) {
            loadUserProfile();
        }
    }, [user]);

    const eventTypes = [
        'Wedding',
        'Corporate Event',
        'Birthday Party',
        'Anniversary',
        'Conference',
        'Workshop',
        'Product Launch',
        'Networking Event',
        'Social Gathering',
        'Other'
    ];

    const handleChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const requestData = {
                venue: venue._id,
                senderName: formData.name,
                senderEmail: formData.email,
                senderPhone: formData.phone,
                eventDate: formData.eventDate || null,
                eventType: formData.eventType,
                expectedGuestCount: parseInt(formData.guestCount),
                message: formData.message
            };

            await requestApi.createRequest(requestData);

            setSubmitStatus({
                type: 'success',
                message: 'Your message has been sent successfully! The venue owner will contact you soon.'
            });

            // Reset form after successful submission
            setTimeout(() => {
                const userData = userProfile?.data?.user || userProfile?.user;
                setFormData({
                    name: user ? `${user.name} ${user.surname}` : '',
                    email: user ? user.email : '',
                    phone: userData?.phone || '',
                    eventDate: '',
                    eventType: '',
                    guestCount: '',
                    message: ''
                });
                onClose();
            }, 3000);

        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send your message. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name && formData.email && formData.phone && formData.eventType && formData.guestCount && formData.message;

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Contact Venue Owner
                </Typography>
                <Button
                    onClick={onClose}
                    color="inherit"
                    startIcon={<Close />}
                    sx={{ minWidth: 'auto' }}
                >
                    Close
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Chip
                    label={venue.name}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                    Send a message to inquire about availability and pricing for your event.
                </Typography>
            </Box>

            {submitStatus && (
                <Alert
                    severity={submitStatus.type}
                    sx={{ mb: 3 }}
                    onClose={() => setSubmitStatus(null)}
                >
                    {submitStatus.message}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Personal Information */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Your Name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            required
                            placeholder="Enter your phone number"
                            helperText={!formData.phone ? "Please enter your phone number" : ""}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Event Date"
                            type="date"
                            value={formData.eventDate}
                            onChange={handleChange('eventDate')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Event color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Event Information */}
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Event Type</InputLabel>
                            <Select
                                value={formData.eventType}
                                onChange={handleChange('eventType')}
                                label="Event Type"
                            >
                                {eventTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Expected Guest Count"
                            type="number"
                            value={formData.guestCount}
                            onChange={handleChange('guestCount')}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <People color="action" />
                                    </InputAdornment>
                                ),
                                inputProps: { min: 1, max: venue.capacity }
                            }}
                            helperText={`Maximum capacity: ${venue.capacity} guests`}
                        />
                    </Grid>

                    {/* Message */}
                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Message"
                            multiline
                            rows={4}
                            value={formData.message}
                            onChange={handleChange('message')}
                            required
                            placeholder="Tell us about your event, any special requirements, or questions you have..."
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                size="large"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                size="large"
                                startIcon={<Send />}
                                disabled={!isFormValid || isSubmitting}
                                sx={{ minWidth: 140 }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}