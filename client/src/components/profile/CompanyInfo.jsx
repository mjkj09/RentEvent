import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Divider,
    Paper
} from '@mui/material';
import {
    Business,
    LocationOn,
    Edit,
    Add,
    AccountBalance
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function CompanyInfo({ company, userRole }) {
    const navigate = useNavigate();

    const handleEditCompany = () => {
        navigate('/company-setup', { state: { isEditing: true } });
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

                {/* Company Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
                    <Business color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {company.name}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Tax Information */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AccountBalance color="action" fontSize="small" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Tax Information
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        NIP (Tax ID)
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                                        {company.nip}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        REGON
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                                        {company.regon}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Address Information */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocationOn color="action" fontSize="small" />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Business Address
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                {company.address?.street}<br />
                                {company.address?.city}, {company.address?.region}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Member Since */}
                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Member since:</strong> {new Date(company.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}