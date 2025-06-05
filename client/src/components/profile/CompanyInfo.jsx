import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Divider
} from '@mui/material';
import {
    Business,
    Email,
    Phone,
    Language,
    Edit,
    Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function CompanyInfo({ company, userRole }) {
    const navigate = useNavigate();

    const handleEditCompany = () => {
        navigate('/company-setup');
    };

    const handleCreateCompany = () => {
        navigate('/company-setup');
    };

    if (userRole !== 'owner') {
        return null;
    }

    if (!company) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Business sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        No Company Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Set up your company details to start creating venue listings
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateCompany}
                    >
                        Set Up Company
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        Company Information
                    </Typography>
                    <Button
                        startIcon={<Edit />}
                        onClick={handleEditCompany}
                        variant="outlined"
                        size="small"
                    >
                        Edit Company
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Business color="primary" />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {company.name}
                                </Typography>
                                {company.nip && (
                                    <Typography variant="body2" color="text.secondary">
                                        NIP: {company.nip}
                                    </Typography>
                                )}
                            </Box>
                            {company.isVerified && (
                                <Chip
                                    label="Verified"
                                    color="success"
                                    size="small"
                                />
                            )}
                        </Box>
                    </Grid>

                    {company.description && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body1" color="text.secondary">
                                {company.description}
                            </Typography>
                        </Grid>
                    )}

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                            <Email color="action" fontSize="small" />
                            <Typography variant="body2">
                                <strong>Contact Email:</strong> {company.contactEmail}
                            </Typography>
                        </Box>
                    </Grid>

                    {company.contactPhone && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                                <Phone color="action" fontSize="small" />
                                <Typography variant="body2">
                                    <strong>Contact Phone:</strong> {company.contactPhone}
                                </Typography>
                            </Box>
                        </Grid>
                    )}

                    {company.website && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                                <Language color="action" fontSize="small" />
                                <Typography variant="body2">
                                    <strong>Website:</strong>
                                    <a
                                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ marginLeft: 4, color: 'inherit' }}
                                    >
                                        {company.website}
                                    </a>
                                </Typography>
                            </Box>
                        </Grid>
                    )}

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Member since:</strong> {new Date(company.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}