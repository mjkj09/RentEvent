import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Paper,
    Card,
    CardMedia,
    IconButton,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Star,
    StarBorder,
    ArrowBack,
    Save,
    Image as ImageIcon
} from '@mui/icons-material';
import venueService from '../../services/venue.service';
import { useAuth } from '../../hooks/useAuth';

export default function ImagesStep({ data, onDataChange, onBack, onSubmit, isSubmitting }) {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        images: data.images || [],
        bannerImage: data.bannerImage || null
    });
    const [error, setError] = useState('');
    const [uploadingImages, setUploadingImages] = useState(false);

    const updateFormData = (newData) => {
        setFormData(newData);
        onDataChange(newData);
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        // Check authentication
        if (!isAuthenticated || !user) {
            setError('You must be logged in to upload images');
            return;
        }

        // Check total images limit
        if (formData.images.length + files.length > 10) {
            setError('Maximum 10 images allowed');
            return;
        }

        // Validate file types and sizes
        const validFiles = [];
        for (const file of files) {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

            if (!isValidType) {
                setError(`File ${file.name} is not an image. Only image files are allowed.`);
                return;
            }

            if (!isValidSize) {
                setError(`File ${file.name} is too large. Images must be smaller than 5MB.`);
                return;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        setUploadingImages(true);
        setError('');

        try {
            // Upload files one by one to better handle errors
            const newImages = [];
            for (let i = 0; i < validFiles.length; i++) {
                const file = validFiles[i];
                try {
                    const result = await venueService.uploadImage(file);

                    if (result.imageUrl) {
                        newImages.push(result.imageUrl);
                    } else {
                        throw new Error('No image URL returned from server');
                    }
                } catch (uploadError) {
                    const errorMessage = uploadError.response?.data?.error?.message ||
                        uploadError.response?.data?.message ||
                        uploadError.message;
                    setError(`Failed to upload ${file.name}: ${errorMessage}`);
                    break; // Stop on first error
                }
            }

            if (newImages.length > 0) {
                const updatedData = {
                    ...formData,
                    images: [...formData.images, ...newImages],
                    // Set first uploaded image as banner if no banner exists
                    bannerImage: formData.bannerImage || newImages[0] || null
                };
                updateFormData(updatedData);

                if (newImages.length < validFiles.length) {
                    setError(`Successfully uploaded ${newImages.length} of ${validFiles.length} images`);
                } else {
                    // Clear any previous errors if all uploaded successfully
                    setError('');
                }
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to upload images';
            setError(`Upload failed: ${errorMessage}`);
        } finally {
            setUploadingImages(false);
            // Clear the input so the same file can be selected again if needed
            event.target.value = '';
        }
    };

    const handleImageDelete = (indexToDelete) => {
        const newImages = formData.images.filter((_, index) => index !== indexToDelete);
        const deletedImage = formData.images[indexToDelete];

        const updatedData = {
            ...formData,
            images: newImages,
            // If deleted image was banner, set new banner
            bannerImage: formData.bannerImage === deletedImage
                ? (newImages.length > 0 ? newImages[0] : null)
                : formData.bannerImage
        };

        updateFormData(updatedData);
        setError('');
    };

    const handleSetBanner = (image) => {
        const updatedData = {
            ...formData,
            bannerImage: image
        };
        updateFormData(updatedData);
    };

    const validateForm = () => {
        if (formData.images.length === 0) {
            setError('Please upload at least one image of your venue');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit();
        }
    };

    return (
        <Box>
            {/* Upload Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                    <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Venue Images
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={uploadingImages ? <CircularProgress size={16} /> : <CloudUpload />}
                        disabled={uploadingImages || formData.images.length >= 10}
                        sx={{
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            p: 2,
                            width: '100%',
                            height: 80,
                            fontSize: '1rem',
                            '&:hover': {
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        {uploadingImages
                            ? 'Uploading images...'
                            : `Upload Images (${formData.images.length}/10)`
                        }
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
                        />
                    </Button>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                    >
                        Upload up to 10 images. Maximum 5MB per image. JPG, PNG, WebP formats supported.
                    </Typography>
                </Box>

                {/* Images Grid */}
                {formData.images.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                            Uploaded Images ({formData.images.length})
                        </Typography>

                        <Grid container spacing={2}>
                            {formData.images.map((image, index) => (
                                <Grid item size={{xs: 12, sm: 6, md: 4}} key={index}>
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            '&:hover .image-actions': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="150"
                                            image={image}
                                            alt={`Venue image ${index + 1}`}
                                            sx={{
                                                objectFit: 'cover',
                                                backgroundColor: 'grey.100'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />

                                        {/* Fallback for broken images */}
                                        <Box
                                            sx={{
                                                display: 'none',
                                                height: 150,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'grey.100',
                                                color: 'grey.500'
                                            }}
                                        >
                                            <ImageIcon sx={{ fontSize: 40 }} />
                                        </Box>

                                        {/* Image Actions Overlay */}
                                        <Box
                                            className="image-actions"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                                opacity: 0,
                                                transition: 'opacity 0.2s ease'
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleSetBanner(image)}
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    color: formData.bannerImage === image ? 'warning.main' : 'grey.600',
                                                    '&:hover': {
                                                        backgroundColor: 'white'
                                                    }
                                                }}
                                                size="small"
                                            >
                                                {formData.bannerImage === image ? <Star /> : <StarBorder />}
                                            </IconButton>

                                            <IconButton
                                                onClick={() => handleImageDelete(index)}
                                                sx={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        backgroundColor: 'white'
                                                    }
                                                }}
                                                size="small"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>

                                        {/* Banner Badge */}
                                        {formData.bannerImage === image && (
                                            <Chip
                                                label="Banner"
                                                color="warning"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
                            <Typography variant="body2" color="info.dark">
                                💡 <strong>Tips:</strong> The first image will be used as your venue's main banner.
                                You can click the star icon to set a different banner image.
                                Upload high-quality images that showcase your venue's best features.
                            </Typography>
                        </Box>
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
                    disabled={isSubmitting}
                    sx={{ px: 4 }}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    disabled={isSubmitting || uploadingImages}
                    sx={{ px: 4 }}
                >
                    {isSubmitting ? 'Creating Venue...' : 'Create Venue Listing'}
                </Button>
            </Box>
        </Box>
    );
}