import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Card,
    CardContent,
    IconButton,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Star,
    StarBorder,
    ArrowBack,
    Save,
    Image
} from '@mui/icons-material';
import venueService from '../../services/venue.service';

export default function ImagesStep({ data, onDataChange, onBack, onSubmit, isSubmitting }) {
    const [uploading, setUploading] = useState(false);
    const [formError, setFormError] = useState('');

    const handleImageUpload = async (event, isBanner = false) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setFormError('');

        try {
            const uploadPromises = files.map(file => venueService.uploadImage(file));
            const uploadedImages = await Promise.all(uploadPromises);

            if (isBanner) {
                // Set as banner image (first uploaded image)
                onDataChange({
                    bannerImage: uploadedImages[0],
                    images: [...(data.images || []), ...uploadedImages]
                });
            } else {
                // Add to regular images
                onDataChange({
                    images: [...(data.images || []), ...uploadedImages]
                });
            }
        } catch (error) {
            setFormError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (imageToRemove) => {
        const newImages = (data.images || []).filter(img => img !== imageToRemove);
        const newData = { images: newImages };

        // If removed image was the banner, clear banner
        if (data.bannerImage === imageToRemove) {
            newData.bannerImage = null;
        }

        onDataChange(newData);
    };

    const handleSetAsBanner = (image) => {
        onDataChange({ bannerImage: image });
    };

    const validateForm = () => {
        if (!data.images || data.images.length === 0) {
            setFormError('Please upload at least one image of your venue');
            return false;
        }

        if (!data.bannerImage) {
            setFormError('Please select a banner image that will be displayed prominently');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            await onSubmit();
        }
    };

    return (
        <Box>
            {/* Banner Image Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Star sx={{ mr: 1, color: 'primary.main' }} />
                    Banner Image
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    This image will be displayed as the main photo in search results and at the top of your venue page.
                </Typography>

                {data.bannerImage ? (
                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={data.bannerImage}
                                    alt="Banner"
                                    sx={{
                                        width: 120,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 1
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                        <Star sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                                        Banner Image
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        This will be your main venue photo
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => handleRemoveImage(data.bannerImage)}
                                    color="error"
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            backgroundColor: 'primary.light',
                            opacity: 0.1,
                            mb: 2
                        }}
                    >
                        <Typography color="text.secondary">
                            Upload images below, then select one as your banner
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Images Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <Image sx={{ mr: 1, color: 'primary.main' }} />
                    Venue Images
                </Typography>

                {/* Upload Area */}
                <Card
                    variant="outlined"
                    sx={{
                        mb: 3,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'primary.light',
                            opacity: 0.05
                        }
                    }}
                >
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Upload Venue Images
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Show potential clients what your venue looks like. Upload multiple photos to showcase different areas and features.
                            </Typography>

                            <Button
                                variant="contained"
                                component="label"
                                disabled={uploading}
                                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                                sx={{ mb: 2 }}
                            >
                                {uploading ? 'Uploading...' : 'Choose Images'}
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, false)}
                                />
                            </Button>

                            <Typography variant="caption" display="block" color="text.secondary">
                                Supported formats: JPG, PNG, WebP. Max size: 5MB per image.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Images Grid */}
                {data.images && data.images.length > 0 && (
                    <Grid container spacing={2}>
                        {data.images.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card variant="outlined" sx={{ position: 'relative' }}>
                                    <Box
                                        component="img"
                                        src={image}
                                        alt={`Venue ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover'
                                        }}
                                    />

                                    {/* Image Controls */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            display: 'flex',
                                            gap: 1
                                        }}
                                    >
                                        {data.bannerImage !== image && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleSetAsBanner(image)}
                                                sx={{
                                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,1)'
                                                    }
                                                }}
                                            >
                                                <StarBorder fontSize="small" />
                                            </IconButton>
                                        )}

                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(image)}
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                color: 'error.main',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,1)'
                                                }
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    {/* Banner Badge */}
                                    {data.bannerImage === image && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                left: 8
                                            }}
                                        >
                                            <Chip
                                                icon={<Star fontSize="small" />}
                                                label="Banner"
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Instructions */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        💡 Tips for great venue photos:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div">
                        • Upload photos from different angles and areas of your venue<br/>
                        • Include both wide shots and detail photos<br/>
                        • Show the venue set up for events if possible<br/>
                        • Use good lighting and avoid blurry images<br/>
                        • Click the star icon to set an image as your banner
                    </Typography>
                </Box>
            </Box>

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
                    disabled={isSubmitting}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    sx={{ px: 4 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Venue...' : 'Create Venue Listing'}
                </Button>
            </Box>
        </Box>
    );
}