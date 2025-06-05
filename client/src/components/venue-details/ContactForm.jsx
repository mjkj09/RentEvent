import React, { useState } from 'react';
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

export default function ContactForm({ venue, onClose }) {
    const { user } = useAuth();
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
            // TODO: Implement contact form submission API
            console.log('Submitting contact form:', {
                venueId: venue._id,
                venueName: venue.name,
                ownerEmail: venue.ownerCompany?.contactEmail || venue.owner.email,
                ...formData
            });

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSubmitStatus({
                type: 'success',
                message: 'Your message has been sent successfully! The venue owner will contact you soon.'
            });

            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    name: user ? `${user.name} ${user.surname}` : '',
                    email: user ? user.email : '',
                    phone: '',
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
                message: 'Failed to send your message. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name && formData.email && formData.message;

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
                        <FormControl fullWidth>
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