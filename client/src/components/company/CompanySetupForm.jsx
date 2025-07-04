import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    CircularProgress,
    MenuItem,
    FormControl,
    Select,
    IconButton
} from '@mui/material';
import {
    Business,
    LocationOn,
    ArrowBack,
    Save
} from '@mui/icons-material';
import FormField from '../common/FormField';
import companyService from '../../services/company.service';
import authService from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

const regions = [
    'Malopolska',
    'Mazowieckie',
    'Dolnoslaskie',
    'Pomorskie',
    'Wielkopolskie',
    'Slaskie',
    'Lubelskie',
    'Podlaskie',
    'Zachodniopomorskie',
    'Lubuskie',
    'Kujawsko-Pomorskie',
    'Lodzkie',
    'Swietokrzyskie',
    'Podkarpackie',
    'Warminsko-Mazurskie'
];

export default function CompanySetupForm({ onCompanyCreated, onBack, isEditing = false, existingCompany = null }) {
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: existingCompany?.name || '',
        nip: existingCompany?.nip || '',
        regon: existingCompany?.regon || '',
        address: {
            street: existingCompany?.address?.street || '',
            city: existingCompany?.address?.city || '',
            region: existingCompany?.address?.region || ''
        }
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, isAddress = false) => (event) => {
        const value = event.target.value;

        if (isAddress) {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        if (formError) setFormError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setFormError('Company name is required');
            return false;
        }

        if (!/^\d{10}$/.test(formData.nip)) {
            setFormError('NIP must be exactly 10 digits');
            return false;
        }

        if (!/^\d{9}$|^\d{14}$/.test(formData.regon)) {
            setFormError('REGON must be 9 or 14 digits');
            return false;
        }

        if (!formData.address.street.trim()) {
            setFormError('Street address is required');
            return false;
        }

        if (!formData.address.city.trim()) {
            setFormError('City is required');
            return false;
        }

        if (!formData.address.region) {
            setFormError('Region is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setFormError('');

        try {
            if (isEditing) {
                await companyService.updateMyCompany(formData);
            } else {
                await companyService.createCompany(formData);

                // Odśwież dane użytkownika tylko przy tworzeniu
                try {
                    const updatedUser = await authService.getCurrentUser();
                    if (updatedUser && setUser) {
                        setUser(updatedUser);
                    }
                } catch (error) {
                    // Handle error silently
                }
            }

            onCompanyCreated();
        } catch (error) {
            setFormError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton
                    onClick={onBack}
                    sx={{ mr: 2, color: 'primary.main' }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Company Information
                </Typography>
            </Box>

            {/* Company Details Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Business sx={{ mr: 1, color: 'primary.main' }} />
                    Company Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item size={{xs: 12}}>
                        <FormField
                            label="Company Name"
                            placeholder="Enter your company name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6}}>
                        <FormField
                            label="NIP"
                            placeholder="1234567890"
                            value={formData.nip}
                            onChange={handleChange('nip')}
                            inputProps={{
                                maxLength: 10,
                                pattern: "[0-9]*",
                                inputMode: "numeric"
                            }}
                            helperText="10 digits without spaces or dashes"
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6}}>
                        <FormField
                            label="REGON"
                            placeholder="123456789"
                            value={formData.regon}
                            onChange={handleChange('regon')}
                            inputProps={{
                                maxLength: 14,
                                pattern: "[0-9]*",
                                inputMode: "numeric"
                            }}
                            helperText="9 or 14 digits"
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Address Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                    Business Address
                </Typography>

                <Grid container spacing={3}>
                    <Grid item size={{xs: 12}}>
                        <FormField
                            label="Street Address"
                            placeholder="ul. Przykładowa 123"
                            value={formData.address.street}
                            onChange={handleChange('street', true)}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6}}>
                        <FormField
                            label="City"
                            placeholder="Krakow"
                            value={formData.address.city}
                            onChange={handleChange('city', true)}
                            required
                            sx={{ mb: 0 }}
                        />
                    </Grid>

                    <Grid item size={{xs: 12, sm: 6}}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}
                        >
                            Region *
                        </Typography>
                        <FormControl fullWidth required>
                            <Select
                                variant="outlined"
                                value={formData.address.region}
                                onChange={handleChange('region', true)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select region
                                </MenuItem>
                                {regions.map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Error Alert */}
            {formError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {formError}
                </Alert>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    sx={{ px: 4 }}
                >
                    {isSubmitting
                        ? (isEditing ? 'Updating Company...' : 'Creating Company...')
                        : (isEditing ? 'Update Company Profile' : 'Create Company Profile')
                    }
                </Button>
            </Box>
        </Box>
    );
}