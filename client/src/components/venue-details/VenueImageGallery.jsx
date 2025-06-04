import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Dialog,
    IconButton,
    Typography,
    Button
} from '@mui/material';
import {
    Close,
    ChevronLeft,
    ChevronRight,
    Photo
} from '@mui/icons-material';

export default function VenueImageGallery({ images = [], bannerImage, venueName }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Combine banner image with other images, avoiding duplicates
    const allImages = React.useMemo(() => {
        const imageSet = new Set();
        const result = [];

        // Add banner image first if it exists
        if (bannerImage) {
            imageSet.add(bannerImage);
            result.push(bannerImage);
        }

        // Add other images if they're not duplicates
        images.forEach(img => {
            if (!imageSet.has(img)) {
                imageSet.add(img);
                result.push(img);
            }
        });

        // If no images at all, add placeholder
        if (result.length === 0) {
            result.push('/placeholder-venue.jpg');
        }

        return result;
    }, [bannerImage, images]);

    const handleImageClick = (index) => {
        setSelectedImage(index);
        setIsDialogOpen(true);
    };

    const handleViewAllPhotos = () => {
        setSelectedImage(0);
        setIsDialogOpen(true);
    };

    const handlePrevious = () => {
        setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1);
    };

    const handleNext = () => {
        setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    if (allImages.length === 0) {
        return (
            <Paper
                sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.100',
                    mb: 4,
                    borderRadius: 3
                }}
            >
                <Typography color="text.secondary">
                    No images available
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                {/* Main Banner Image */}
                <Box sx={{ position: 'relative', mb: 2 }}>
                    <Paper
                        sx={{
                            height: { xs: 250, sm: 350, md: 500 },
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            borderRadius: 3
                        }}
                        onClick={() => handleImageClick(0)}
                    >
                        <Box
                            component="img"
                            src={allImages[0]}
                            alt={`${venueName} - Main image`}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.src = '/placeholder-venue.jpg';
                            }}
                        />

                        {/* View Photos Button - Only show if more than 1 image */}
                        {allImages.length > 1 && (
                            <Button
                                variant="contained"
                                startIcon={<Photo />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAllPhotos();
                                }}
                                sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 16,
                                    backgroundColor: 'rgba(139, 69, 139, 0.9)',
                                    color: 'white',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(139, 69, 139, 1)'
                                    }
                                }}
                            >
                                Zobacz zdjęcia ({allImages.length})
                            </Button>
                        )}

                        {/* Image counter for mobile */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.875rem'
                            }}
                        >
                            1 / {allImages.length}
                        </Box>
                    </Paper>
                </Box>

                {/* Thumbnail Row - Only show if more than 1 image */}
                {allImages.length > 1 && (
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': {
                            height: 6
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'grey.200',
                            borderRadius: 3
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'grey.400',
                            borderRadius: 3
                        }
                    }}>
                        {allImages.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    minWidth: { xs: 80, sm: 100, md: 120 },
                                    height: { xs: 60, sm: 75, md: 90 },
                                    cursor: 'pointer',
                                    border: index === 0 ? '2px solid' : '2px solid transparent',
                                    borderColor: index === 0 ? 'primary.main' : 'transparent',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'scale(1.05)',
                                        transition: 'all 0.2s ease'
                                    }
                                }}
                                onClick={() => handleImageClick(index)}
                            >
                                <Box
                                    component="img"
                                    src={image}
                                    alt={`${venueName} - Thumbnail ${index + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-venue.jpg';
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Full Screen Image Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth={false}
                fullScreen
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        margin: 0,
                        maxWidth: '100vw',
                        maxHeight: '100vh',
                        overflow: 'hidden'
                    }
                }}
                disableScrollLock={false}
            >
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>

                    {/* Navigation Buttons */}
                    {allImages.length > 1 && (
                        <>
                            <IconButton
                                onClick={handlePrevious}
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            >
                                <ChevronLeft />
                            </IconButton>

                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                    }
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </>
                    )}

                    {/* Image */}
                    <Box
                        component="img"
                        src={allImages[selectedImage]}
                        alt={`${venueName} - Image ${selectedImage + 1}`}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            userSelect: 'none',
                            pointerEvents: 'none'
                        }}
                        onError={(e) => {
                            e.target.src = '/placeholder-venue.jpg';
                        }}
                        draggable={false}
                    />

                    {/* Image Counter */}
                    {allImages.length > 1 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                px: 2,
                                py: 1,
                                borderRadius: 1
                            }}
                        >
                            <Typography variant="body2">
                                {selectedImage + 1} / {allImages.length}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Dialog>
        </>
    );
}