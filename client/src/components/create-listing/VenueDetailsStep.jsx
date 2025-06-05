import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    MenuItem,
    FormControl,
    Select,
    Paper
} from '@mui/material';
import {
    Business,
    LocationOn,
    Description,
    Category,
    ArrowForward
} from '@mui/icons-material';
import FormField from '../common/FormField';
import { CATEGORIES, REGIONS } from '../../constants/venueConstants';

export default function VenueDetailsStep({ data, onDataChange, onNext }) {
    const [formData, setFormData] = useState({
        name: data.name || '',
        category: data.category || '',
        location: {
            street: data.location?.street || '',
            city: data.location?.city || '',
            region: data.location?.region || ''
        },
        description: data.description || ''
    });
    const [error, setError] = useState('');

    const handleChange = (field, isLocation = false) => (event) => {
        const value = event.target.value;
        setError('');

        let newFormData;
        if (isLocation) {
            newFormData = {
                ...formData,
                location: {
                    ...formData.location,
                    [field]: value
                }
            };
        } else {
            newFormData = {
                ...formData,
                [field]: value
            };
        }

        setFormData(newFormData);
        // Call onDataChange immediately when data changes
        onDataChange(newFormData);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Venue name is required');
            return false;
        }

        if (formData.name.trim().length < 3) {
            setError('Venue name must be at least 3 characters long');
            return false;
        }

        if (!formData.category) {
            setError('Please select a venue category');
            return false;
        }

        if (!formData.location.street.trim()) {
            setError('Street address is required');
            return false;
        }

        if (!formData.location.city.trim()) {
            setError('City is required');
            return false;
        }

        if (!formData.location.region) {
            setError('Please select a region');
            return false;
        }

        if (!formData.description.trim()) {
            setError('Venue description is required');
            return false;
        }

        if (formData.description.trim().length < 20) {
            setError('Description must be at least 20 characters long');
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
            {/* Basic Information Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Business sx={{ mr: 1, color: 'primary.main' }} />
                    Basic Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12}}>
                        <FormField
                            label="Venue Name"
                            placeholder="Enter your venue name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}
                        >
                            Category *
                        </Typography>
                        <FormControl fullWidth required>
                            <Select
                                variant="outlined"
                                value={formData.category}
                                onChange={handleChange('category')}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select venue category
                                </MenuItem>
                                {CATEGORIES.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        {/* Empty space for layout balance */}
                    </Grid>
                </Grid>
            </Paper>

            {/* Location Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    Location
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12}}>
                        <FormField
                            label="Street Address"
                            placeholder="ul. Przykładowa 123"
                            value={formData.location.street}
                            onChange={handleChange('street', true)}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <FormField
                            label="City"
                            placeholder="Krakow"
                            value={formData.location.city}
                            onChange={handleChange('city', true)}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}
                        >
                            Region *
                        </Typography>
                        <FormControl fullWidth required>
                            <Select
                                variant="outlined"
                                value={formData.location.region}
                                onChange={handleChange('region', true)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select region
                                </MenuItem>
                                {REGIONS.map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Description Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Description sx={{ mr: 1, color: 'primary.main' }} />
                    Description
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{xs: 12}}>
                        <FormField
                            label="Venue Description"
                            placeholder="Describe your venue, its features, amenities, and what makes it special..."
                            value={formData.description}
                            onChange={handleChange('description')}
                            multiline
                            rows={4}
                            helperText="Minimum 20 characters. Include details about the space, features, and amenities."
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Navigation Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    sx={{ px: 4 }}
                >
                    Continue to Pricing
                </Button>
            </Box>
        </Box>
    );
}