import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material';
import {
    Business,
    LocationOn,
    ArrowForward,
    Description
} from '@mui/icons-material';
import FormField from '../common/FormField';
import { VENUE_CATEGORIES, REGIONS } from '../../constants/venueConstants';

export default function VenueDetailsStep({ data, onDataChange, onNext }) {
    const [formError, setFormError] = useState('');

    const handleChange = (field, isLocation = false) => (event) => {
        const value = event.target.value;

        if (isLocation) {
            const newData = {
                location: {
                    ...data.location,
                    [field]: value
                }
            };
            onDataChange(newData);
        } else {
            onDataChange({ [field]: value });
        }

        if (formError) setFormError('');
    };

    const validateForm = () => {
        if (!data.name?.trim()) {
            setFormError('Venue name is required');
            return false;
        }

        if (!data.category) {
            setFormError('Venue category is required');
            return false;
        }

        if (!data.location?.street?.trim()) {
            setFormError('Street address is required');
            return false;
        }

        if (!data.location?.city?.trim()) {
            setFormError('City is required');
            return false;
        }

        if (!data.location?.region) {
            setFormError('Region is required');
            return false;
        }

        if (!data.description?.trim()) {
            setFormError('Venue description is required');
            return false;
        }

        if (data.description.trim().length < 20) {
            setFormError('Description should be at least 20 characters long');
            return false;
        }

        return true;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    return (
        <Box>
            {/* Venue Details Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Business sx={{ mr: 1, color: 'primary.main' }} />
                    Venue Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormField
                            label="Venue Name"
                            placeholder="Enter your venue name"
                            value={data.name || ''}
                            onChange={handleChange('name')}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Venue Category</InputLabel>
                            <Select
                                value={data.category || ''}
                                onChange={handleChange('category')}
                                label="Venue Category"
                            >
                                {VENUE_CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Placeholder for future features */}
                        <Box sx={{ height: '56px', display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Additional venue features coming soon
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Location Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    Location
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormField
                            label="Street Address"
                            placeholder="ul. Przykładowa 123"
                            value={data.location?.street || ''}
                            onChange={handleChange('street', true)}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="City"
                            placeholder="Krakow"
                            value={data.location?.city || ''}
                            onChange={handleChange('city', true)}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Region</InputLabel>
                            <Select
                                value={data.location?.region || ''}
                                onChange={handleChange('region', true)}
                                label="Region"
                            >
                                {REGIONS.map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Additional Information Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Description sx={{ mr: 1, color: 'primary.main' }} />
                    Additional Information
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Venue Description"
                    placeholder="Describe your venue, its unique features, amenities, and what makes it special for events..."
                    value={data.description || ''}
                    onChange={handleChange('description')}
                    required
                    helperText={`${data.description?.length || 0} characters (minimum 20)`}
                    sx={{ mb: 2 }}
                />
            </Box>

            {/* Error Alert */}
            {formError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {formError}
                </Alert>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    sx={{ px: 4 }}
                >
                    Save & Continue
                </Button>
            </Box>
        </Box>
    );
}