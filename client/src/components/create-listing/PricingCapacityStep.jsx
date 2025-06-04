import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    FormControlLabel,
    Switch,
    InputAdornment,
    Card,
    CardContent
} from '@mui/material';
import {
    MonetizationOn,
    People,
    ArrowBack,
    ArrowForward,
    VisibilityOff,
    Visibility
} from '@mui/icons-material';
import FormField from '../common/FormField';

export default function PricingCapacityStep({ data, onDataChange, onNext, onBack }) {
    const [formError, setFormError] = useState('');

    const handleChange = (field, isPricing = false) => (event) => {
        const value = event.target.value;

        if (isPricing) {
            const newData = {
                pricing: {
                    ...data.pricing,
                    [field]: value
                }
            };
            onDataChange(newData);
        } else {
            onDataChange({ [field]: value });
        }

        if (formError) setFormError('');
    };

    const handlePriceHiddenToggle = (event) => {
        const newData = {
            pricing: {
                ...data.pricing,
                isPriceHidden: event.target.checked
            }
        };
        onDataChange(newData);
    };

    const validateForm = () => {
        if (!data.capacity || parseInt(data.capacity) <= 0) {
            setFormError('Valid capacity is required');
            return false;
        }

        if (!data.pricing.isPriceHidden) {
            const minPrice = parseFloat(data.pricing.minPricePerPerson);
            const maxPrice = parseFloat(data.pricing.maxPricePerPerson);

            if (data.pricing.minPricePerPerson && minPrice <= 0) {
                setFormError('Minimum price must be greater than 0');
                return false;
            }

            if (data.pricing.maxPricePerPerson && maxPrice <= 0) {
                setFormError('Maximum price must be greater than 0');
                return false;
            }

            if (minPrice && maxPrice && minPrice > maxPrice) {
                setFormError('Minimum price cannot be higher than maximum price');
                return false;
            }
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
            {/* Pricing Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <MonetizationOn sx={{ mr: 1, color: 'primary.main' }} />
                    Pricing
                </Typography>

                {/* Price Hidden Toggle */}
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={data.pricing?.isPriceHidden || false}
                                    onChange={handlePriceHiddenToggle}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Hide pricing from public
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Enable this if you prefer to discuss pricing directly with clients
                                    </Typography>
                                </Box>
                            }
                            sx={{ alignItems: 'flex-start' }}
                        />
                    </CardContent>
                </Card>

                {/* Pricing Fields */}
                {!data.pricing?.isPriceHidden && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                label="Minimum Price per Person"
                                type="number"
                                placeholder="0"
                                value={data.pricing?.minPricePerPerson || ''}
                                onChange={handleChange('minPricePerPerson', true)}
                                sx={{ mb: 0 }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                PLN
                                            </InputAdornment>
                                        ),
                                        inputProps: {
                                            min: 0,
                                            step: 0.01
                                        }
                                    }
                                }}
                                helperText="Leave empty if you don't have a minimum price"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                label="Maximum Price per Person"
                                type="number"
                                placeholder="0"
                                value={data.pricing?.maxPricePerPerson || ''}
                                onChange={handleChange('maxPricePerPerson', true)}
                                sx={{ mb: 0 }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                PLN
                                            </InputAdornment>
                                        ),
                                        inputProps: {
                                            min: 0,
                                            step: 0.01
                                        }
                                    }
                                }}
                                helperText="Leave empty if you don't have a maximum price"
                            />
                        </Grid>
                    </Grid>
                )}

                {data.pricing?.isPriceHidden && (
                    <Box sx={{
                        textAlign: 'center',
                        py: 3,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        <VisibilityOff sx={{ color: 'text.secondary' }} />
                        <Typography color="text.secondary">
                            Pricing will be hidden from public listings
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Capacity Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <People sx={{ mr: 1, color: 'primary.main' }} />
                    Capacity
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormField
                            label="Maximum Guests"
                            type="number"
                            placeholder="50"
                            value={data.capacity || ''}
                            onChange={handleChange('capacity')}
                            required
                            sx={{ mb: 0 }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            guests
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        min: 1,
                                        step: 1
                                    }
                                }
                            }}
                            helperText="Maximum number of guests your venue can accommodate"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {/* Preview Card */}
                        <Card variant="outlined" sx={{ height: 'fit-content' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Capacity Preview
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {data.capacity ? `Up to ${data.capacity} guests` : 'Enter capacity above'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Pricing Preview */}
            {!data.pricing?.isPriceHidden && (data.pricing?.minPricePerPerson || data.pricing?.maxPricePerPerson) && (
                <Box sx={{ mb: 4 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <Visibility sx={{ mr: 1, fontSize: 20 }} />
                                Pricing Preview
                            </Typography>
                            <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
                                {(() => {
                                    const min = data.pricing?.minPricePerPerson;
                                    const max = data.pricing?.maxPricePerPerson;

                                    if (min && max && min !== max) {
                                        return `PLN ${min}-${max} / guest`;
                                    } else if (min && max && min === max) {
                                        return `PLN ${min} / guest`;
                                    } else if (min) {
                                        return `From PLN ${min} / guest`;
                                    } else if (max) {
                                        return `Up to PLN ${max} / guest`;
                                    }
                                    return 'Price range to be displayed';
                                })()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This is how your pricing will appear to potential clients
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {/* Error Alert */}
            {formError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {formError}
                </Alert>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={onBack}
                    startIcon={<ArrowBack />}
                    sx={{ px: 4 }}
                >
                    Back
                </Button>
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