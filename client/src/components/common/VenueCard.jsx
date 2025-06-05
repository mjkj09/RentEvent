import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Box,
    Typography,
    IconButton,
    Chip,
    Rating,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert
} from '@mui/material';
import {
    FavoriteBorder,
    Favorite,
    LocationOn,
    People,
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Star,
    Warning,
    ToggleOff,
    ToggleOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function VenueCard({
                                      venue,
                                      isFavorite = false,
                                      onToggleFavorite,
                                      onViewDetails,
                                      onEdit,
                                      onDelete,
                                      onToggleActive, // New prop for toggling venue active status
                                      isAuthenticated = true,
                                      variant = 'default' // 'default', 'my-venues'
                                  }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Format price range
    const formatPrice = () => {
        if (venue.pricing?.isPriceHidden || (!venue.pricing?.minPricePerPerson && !venue.priceRange)) {
            return 'Ask for an offer';
        }

        // Use priceRange if available (for formatted venues)
        if (venue.priceRange) {
            return venue.priceRange;
        }

        // Fallback to pricing object
        if (venue.pricing?.minPricePerPerson === venue.pricing?.maxPricePerPerson || !venue.pricing?.maxPricePerPerson) {
            return `PLN ${venue.pricing.minPricePerPerson} / guest`;
        }

        return `PLN ${venue.pricing.minPricePerPerson}-${venue.pricing.maxPricePerPerson} / guest`;
    };

    // Get venue rating (with proper decimal formatting)
    const getVenueRating = () => {
        const rating = venue.ratingStats?.averageRating || venue.rating || 0;
        return parseFloat(rating.toFixed(1));
    };

    // Get review count
    const getReviewCount = () => {
        return venue.ratingStats?.totalReviews || venue.reviews || 0;
    };

    // Get venue image
    const getVenueImage = () => {
        return venue.image || venue.bannerImage || venue.images?.[0] || '/placeholder-venue.jpg';
    };

    // Get venue capacity
    const getCapacity = () => {
        if (venue.capacity) return venue.capacity;
        if (venue.capacityNumber) return venue.capacityNumber;
        return 'Unknown';
    };

    // Status management for my-venues
    const getStatusColor = () => {
        return venue.isActive ? 'success' : 'default';
    };

    const getStatusLabel = () => {
        return venue.isActive ? 'Active' : 'Inactive';
    };

    // Menu handlers for my-venues
    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleView = () => {
        if (onViewDetails) {
            onViewDetails(venue.id || venue._id);
        } else {
            navigate(`/venue/${venue.id || venue._id}`);
        }
        handleMenuClose();
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(venue.id || venue._id);
        } else {
            navigate(`/edit-venue/${venue.id || venue._id}`);
        }
        handleMenuClose();
    };

    const handleToggleActive = () => {
        if (onToggleActive) {
            onToggleActive(venue.id || venue._id, !venue.isActive);
        }
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            if (onDelete) {
                await onDelete(venue.id || venue._id);
            }
            setDeleteDialogOpen(false);
        } catch (error) {
            // Error will be handled by parent component
        }
    };

    const handleCardClick = () => {
        if (variant === 'my-venues') {
            // For my-venues, don't navigate on card click (use menu instead)
            return;
        }

        if (onViewDetails) {
            onViewDetails(venue.id || venue._id);
        } else {
            navigate(`/venue/${venue.id || venue._id}`);
        }
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(venue.id || venue._id);
        }
    };

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: variant === 'my-venues' ? 'default' : 'pointer',
                    '&:hover': variant === 'my-venues' ? {} : {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                }}
                onClick={handleCardClick}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={getVenueImage()}
                        alt={venue.name}
                        sx={{
                            objectFit: 'cover'
                        }}
                    />

                    {/* Status chip for my-venues */}
                    {variant === 'my-venues' && (
                        <Chip
                            label={getStatusLabel()}
                            color={getStatusColor()}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                backgroundColor: venue.isActive ? 'success.main' : 'grey.400',
                                color: 'white'
                            }}
                        />
                    )}

                    {/* Category chip - same position for both variants */}
                    {(venue.tags || venue.category) && (
                        <Chip
                            label={venue.tags?.[0] || venue.category}
                            size="small"
                            sx={{
                                position: 'absolute',
                                bottom: 12,
                                left: 12,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                opacity: 0.9
                            }}
                        />
                    )}

                    {/* Action buttons */}
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1
                    }}>
                        {/* Favorite button for default variant */}
                        {variant === 'default' && isAuthenticated && onToggleFavorite && (
                            <IconButton
                                onClick={handleFavoriteClick}
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,1)'
                                    }
                                }}
                            >
                                {isFavorite ? (
                                    <Favorite sx={{ color: 'error.main' }} />
                                ) : (
                                    <FavoriteBorder />
                                )}
                            </IconButton>
                        )}

                        {/* Menu button for my-venues */}
                        {variant === 'my-venues' && (
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 1)',
                                    }
                                }}
                            >
                                <MoreVert />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            '&:hover': variant === 'default' ? {
                                color: 'primary.main'
                            } : {}
                        }}
                    >
                        {venue.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                            {venue.location || (venue.location?.city && venue.location?.region ? `${venue.location.city}, ${venue.location.region}` : 'Unknown location')}
                        </Typography>
                    </Box>

                    {/* Rating with proper decimal formatting or "No reviews yet" */}
                    {getReviewCount() > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                                value={getVenueRating()}
                                precision={0.1}
                                size="small"
                                readOnly
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {getVenueRating()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                ({getReviewCount()} reviews)
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Star sx={{ fontSize: 18, color: 'text.disabled', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                                No reviews yet
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <People sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                                Up to {getCapacity()} guests
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                color: formatPrice() === 'Ask for an offer' ? 'text.secondary' : 'primary.main'
                            }}
                        >
                            {formatPrice()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Menu for my-venues variant */}
            {variant === 'my-venues' && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleView}>
                        <Visibility sx={{ mr: 1 }} fontSize="small" />
                        View Details
                    </MenuItem>
                    <MenuItem onClick={handleEdit}>
                        <Edit sx={{ mr: 1 }} fontSize="small" />
                        Edit Venue
                    </MenuItem>
                    <MenuItem onClick={handleToggleActive}>
                        {venue.isActive ? (
                            <ToggleOff sx={{ mr: 1 }} fontSize="small" />
                        ) : (
                            <ToggleOn sx={{ mr: 1 }} fontSize="small" />
                        )}
                        {venue.isActive ? 'Mark as Inactive' : 'Mark as Active'}
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                        <Delete sx={{ mr: 1 }} fontSize="small" />
                        Delete
                    </MenuItem>
                </Menu>
            )}

            {/* Delete confirmation dialog */}
            {variant === 'my-venues' && (
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                        <Warning />
                        Delete Venue
                    </DialogTitle>
                    <DialogContent>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            This action cannot be undone!
                        </Alert>
                        <Typography>
                            Are you sure you want to delete <strong>"{venue.name}"</strong>?
                            This will permanently remove the venue and all associated reviews.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                        >
                            Delete Venue
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}