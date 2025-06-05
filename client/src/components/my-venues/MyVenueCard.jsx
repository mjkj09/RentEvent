import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import {
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Star,
    People,
    LocationOn,
    Warning
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function VenueCard({ venue, onDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleView = () => {
        navigate(`/venue/${venue._id}`);
        handleMenuClose();
    };

    const handleEdit = () => {
        navigate(`/edit-venue/${venue._id}`);
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        try {
            await onDelete(venue._id);
            setDeleteDialogOpen(false);
        } catch (error) {
            // Error will be handled by parent component
        }
    };

    const formatPrice = () => {
        if (venue.pricing?.isPriceHidden || !venue.pricing?.minPricePerPerson) {
            return 'Ask for an offer';
        }

        if (venue.pricing.minPricePerPerson === venue.pricing.maxPricePerPerson) {
            return `PLN ${venue.pricing.minPricePerPerson} / guest`;
        }

        return `PLN ${venue.pricing.minPricePerPerson}-${venue.pricing.maxPricePerPerson} / guest`;
    };

    const getStatusColor = () => {
        return venue.isActive ? 'success' : 'default';
    };

    const getStatusLabel = () => {
        return venue.isActive ? 'Active' : 'Inactive';
    };

    return (
        <>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={venue.bannerImage || venue.images?.[0] || '/placeholder-venue.jpg'}
                        alt={venue.name}
                        sx={{ objectFit: 'cover' }}
                    />

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

                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                            }
                        }}
                        onClick={handleMenuOpen}
                    >
                        <MoreVert />
                    </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {venue.name}
                    </Typography>

                    <Chip
                        label={venue.category}
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start', mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {venue.location?.city}, {venue.location?.region}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <People fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            Up to {venue.capacity} guests
                        </Typography>
                    </Box>

                    {venue.ratingStats && venue.ratingStats.totalReviews > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                            <Star fontSize="small" color="warning" />
                            <Typography variant="body2" color="text.secondary">
                                {venue.ratingStats.averageRating} ({venue.ratingStats.totalReviews} reviews)
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatPrice()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

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
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <Delete sx={{ mr: 1 }} fontSize="small" />
                    Delete
                </MenuItem>
            </Menu>

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
        </>
    );
}