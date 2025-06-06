import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    FormControlLabel,
    Switch,
    Paper
} from '@mui/material';
import {
    People,
    AttachMoney,
    ArrowBack,
    ArrowForward
} from '@mui/icons-material';
import FormField from '../common/FormField';

export default function PricingCapacityStep({ data, onDataChange, onNext, onBack }) {
    const [formData, setFormData] = useState({
        capacity: data.capacity || '',
        pricing: {
            minPricePerPerson: data.pricing?.minPricePerPerson || '',
            maxPricePerPerson: data.pricing?.maxPricePerPerson || '',
            isPriceHidden: data.pricing?.isPriceHidden || false
        }
    });
    const [error, setError] = useState('');

    const handleChange = (field, isNested = false, nestedField = null) => (event) => {
        const value = event.target.value;
        setError('');

        let newFormData;
        if (isNested && nestedField) {
            newFormData = {
                ...formData,
                [field]: {
                    ...formData[field],
                    [nestedField]: value
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

    const handlePriceHiddenToggle = (event) => {
        const isHidden = event.target.checked;
        setError('');

        const newFormData = {
            ...formData,
            pricing: {
                ...formData.pricing,
                isPriceHidden: isHidden,
                // Clear prices when hiding them
                minPricePerPerson: isHidden ? '' : formData.pricing.minPricePerPerson,
                maxPricePerPerson: isHidden ? '' : formData.pricing.maxPricePerPerson
            }
        };

        setFormData(newFormData);
        onDataChange(newFormData);
    };

    const validateForm = () => {
        // Validate capacity
        const capacity = parseInt(formData.capacity);
        if (!formData.capacity || isNaN(capacity) || capacity <= 0) {
            setError('Please enter a valid capacity (number greater than 0)');
            return false;
        }

        // Validate pricing logic
        if (!formData.pricing.isPriceHidden) {
            const minPrice = parseFloat(formData.pricing.minPricePerPerson);
            const maxPrice = parseFloat(formData.pricing.maxPricePerPerson);

            // If prices are visible, at least min price must be provided
            if (!formData.pricing.minPricePerPerson || isNaN(minPrice) || minPrice <= 0) {
                setError('Please enter a valid minimum price per person');
                return false;
            }

            // If max price is provided, validate it
            if (formData.pricing.maxPricePerPerson &&
                (!isNaN(maxPrice) && maxPrice < minPrice)) {
                setError('Maximum price cannot be lower than minimum price');
                return false;
            }
        }

        return true;
    };

    const handleNext = () => {
        if (validateForm()) {
            // Ensure pricing logic is correct before proceeding
            const finalFormData = { ...formData };

            if (finalFormData.pricing.isPriceHidden) {
                // Hidden prices - set both to null
                finalFormData.pricing.minPricePerPerson = '';
                finalFormData.pricing.maxPricePerPerson = '';
            } else {
                // Visible prices - ensure both are set
                if (!finalFormData.pricing.maxPricePerPerson && finalFormData.pricing.minPricePerPerson) {
                    finalFormData.pricing.maxPricePerPerson = finalFormData.pricing.minPricePerPerson;
                }
            }

            onDataChange(finalFormData);
            onNext();
        }
    };

    return (
        <Box>
            {/* Capacity Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <People sx={{ mr: 1, color: 'primary.main' }} />
                    Venue Capacity
                </Typography>

                <Grid container spacing={3}>
                    <Grid item size={{xs: 12, sm: 6}}>
                        <FormField
                            label="Maximum Capacity"
                            placeholder="e.g., 100"
                            value={formData.capacity}
                            onChange={handleChange('capacity')}
                            type="number"
                            inputProps={{
                                min: 1,
                                max: 10000
                            }}
                            helperText="Maximum number of guests your venue can accommodate"
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Pricing Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                    Pricing Information
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.pricing.isPriceHidden}
                                onChange={handlePriceHiddenToggle}
                                color="primary"
                            />
                        }
                        label="Hide pricing (customers will need to contact you for quotes)"
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.95rem',
                                color: 'text.primary'
                            }
                        }}
                    />
                </Box>

                {!formData.pricing.isPriceHidden && (
                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12, sm: 6}}>
                            <FormField
                                label="Minimum Price Per Person"
                                placeholder="e.g., 200"
                                value={formData.pricing.minPricePerPerson}
                                onChange={handleChange('pricing', true, 'minPricePerPerson')}
                                type="number"
                                inputProps={{
                                    min: 0,
                                    max: 10000,
                                    step: 0.01
                                }}
                                helperText="Price in PLN per person"
                                required={!formData.pricing.isPriceHidden}
                                sx={{ mb: 0 }}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, sm: 6}}>
                            <FormField
                                label="Maximum Price Per Person (optional)"
                                placeholder="e.g., 400"
                                value={formData.pricing.maxPricePerPerson}
                                onChange={handleChange('pricing', true, 'maxPricePerPerson')}
                                type="number"
                                inputProps={{
                                    min: 0,
                                    max: 10000,
                                    step: 0.01
                                }}
                                helperText="Leave empty if you have a fixed price"
                                sx={{ mb: 0 }}
                            />
                        </Grid>
                    </Grid>
                )}

                {formData.pricing.isPriceHidden && (
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            💡 With hidden pricing, potential customers will see "Ask for an offer"
                            and will need to contact you directly for pricing information.
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onBack}
                    startIcon={<ArrowBack />}
                    sx={{ px: 4 }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    sx={{ px: 4 }}
                >
                    Continue to Images
                </Button>
            </Box>
        </Box>
    );
}