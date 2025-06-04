import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Rating,
    Avatar,
    Button,
    LinearProgress,
    Divider,
    Alert,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Pagination
} from '@mui/material';
import {
    Star,
    Add,
    MoreVert,
    Edit,
    Delete
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import reviewService from '../../services/review.service';

const REVIEWS_PER_PAGE = 5;

export default function VenueReviews({
                                         reviews = [],
                                         rating = 0,
                                         totalReviews = 0,
                                         venueId,
                                         venueOwnerId,
                                         onReviewSubmitted
                                     }) {
    const { user } = useAuth();
    const [showAddReview, setShowAddReview] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);

    // Get user ID - try all possible fields
    const userId = user?._id || user?.id;

    // Debug logging to understand the user object structure
    console.log('🔍 Full user object:', user);
    console.log('🔍 User ID options:', {
        '_id': user?._id,
        'id': user?.id,
        'selectedUserId': userId
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (name, surname) => {
        const firstInitial = name ? name.charAt(0).toUpperCase() : '';
        const lastInitial = surname ? surname.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    // Check if current user already reviewed this venue
    const userHasReviewed = user ? reviews.some(review => review.user._id === userId) : false;

    // Check if current user owns this venue (prevent self-review)
    const isOwner = user ? userId === venueOwnerId : false;

    // Pagination
    const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const paginatedReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

    const handleAddReview = () => {
        setShowAddReview(true);
        setEditingReview(null);
        setNewRating(0);
        setNewComment('');
        setSubmitError('');
    };

    const handleEditReview = (review) => {
        console.log('🔧 Editing review:', review);
        setEditingReview(review);
        setNewRating(review.rating);
        setNewComment(review.comment || '');
        setShowAddReview(true);
        setSubmitError('');
        handleCloseMenu();
    };

    const handleCloseReview = () => {
        setShowAddReview(false);
        setEditingReview(null);
        setNewRating(0);
        setNewComment('');
        setSubmitError('');
    };

    const handleSubmitReview = async () => {
        if (newRating === 0) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            if (isOwner) {
                setSubmitError('You cannot review your own venue.');
                setIsSubmitting(false);
                return;
            }

            const reviewData = {
                venue: venueId,
                rating: newRating,
                comment: newComment.trim()
            };

            console.log('📝 Submitting review:', { editingReview, reviewData });

            if (editingReview) {
                // Update existing review
                await reviewService.updateReview(editingReview._id, reviewData);
                console.log('✅ Review updated successfully');
            } else {
                // Create new review
                await reviewService.createReview(reviewData);
                console.log('✅ Review created successfully');
            }

            handleCloseReview();

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            console.error('❌ Error submitting review:', error);
            setSubmitError(error.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        console.log('🗑️ Deleting review:', reviewId);
        try {
            await reviewService.deleteReview(reviewId);
            console.log('✅ Review deleted successfully');
            handleCloseMenu();

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            console.error('❌ Error deleting review:', error);
            // You could show an error message here
        }
    };

    const handleMenuClick = (event, review) => {
        console.log('📱 Menu clicked for review:', review);
        setAnchorEl(event.currentTarget);
        setSelectedReview(review);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedReview(null);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Calculate rating distribution for progress bars
    const calculateRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        reviews.forEach(review => {
            if (distribution[review.rating] !== undefined) {
                distribution[review.rating]++;
            }
        });

        return distribution;
    };

    const renderRatingDistribution = () => {
        const distribution = calculateRatingDistribution();
        const total = totalReviews;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Rating Breakdown
                </Typography>
                {[5, 4, 3, 2, 1].map((ratingValue) => {
                    const count = distribution[ratingValue] || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                        <Box key={ratingValue} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 60 }}>
                                <Typography variant="body2">{ratingValue}</Typography>
                                <Star color="warning" fontSize="small" />
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                    flex: 1,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'warning.main',
                                        borderRadius: 4
                                    }
                                }}
                            />
                            <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                                {count}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    };

    if (totalReviews === 0) {
        return (
            <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Reviews
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    No reviews yet. Be the first to review this venue!
                </Alert>

                {user && !isOwner && (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#FFE047',
                            color: '#2B293D',
                            '&:hover': {
                                backgroundColor: '#FFD700'
                            }
                        }}
                        startIcon={<Add />}
                        onClick={handleAddReview}
                    >
                        Write a Review
                    </Button>
                )}

                {/* Add Review Dialog for no reviews case */}
                <Dialog open={showAddReview} onClose={handleCloseReview} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingReview ? 'Edit Review' : 'Write a Review'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ py: 2 }}>
                            {submitError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {submitError}
                                </Alert>
                            )}

                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Rate this venue
                            </Typography>
                            <Rating
                                value={newRating}
                                onChange={(event, newValue) => setNewRating(newValue)}
                                size="large"
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Your review (optional)"
                                placeholder="Share your experience at this venue..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                variant="outlined"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseReview}>Cancel</Button>
                        <Button
                            onClick={handleSubmitReview}
                            variant="contained"
                            disabled={newRating === 0 || isSubmitting}
                            sx={{
                                backgroundColor: '#FFE047',
                                color: '#2B293D',
                                '&:hover': {
                                    backgroundColor: '#FFD700'
                                },
                                '&:disabled': {
                                    backgroundColor: 'grey.300',
                                    color: 'grey.500'
                                }
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        );
    }

    return (
        <>
            <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Reviews ({totalReviews})
                </Typography>

                {/* Overall Rating Summary */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    {rating.toFixed(1)}
                                </Typography>
                                <Rating
                                    value={rating}
                                    readOnly
                                    precision={0.1}
                                    size="large"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Based on {totalReviews} reviews
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 8 }}>
                            {renderRatingDistribution()}
                        </Grid>
                    </Grid>
                </Box>

                {/* Add Review Button */}
                {user && !isOwner && !userHasReviewed && (
                    <Box sx={{ mb: 4 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#FFE047',
                                color: '#2B293D',
                                '&:hover': {
                                    backgroundColor: '#FFD700'
                                }
                            }}
                            startIcon={<Add />}
                            onClick={handleAddReview}
                            size="large"
                        >
                            Write a Review
                        </Button>
                    </Box>
                )}

                {userHasReviewed && !isOwner && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        You have already reviewed this venue. You can edit or delete your review from the list below.
                    </Alert>
                )}

                {isOwner && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        You cannot review your own venue.
                    </Alert>
                )}

                <Divider sx={{ mb: 3 }} />

                {/* Reviews List */}
                <Box>
                    {paginatedReviews.map((review, index) => {
                        const isUserReview = user && review.user._id === userId;

                        // Enhanced debug logging
                        console.log(`🔍 Review ${index} comparison:`, {
                            reviewId: review._id,
                            reviewUserId: review.user._id,
                            currentUserId: userId,
                            directComparison: review.user._id === userId,
                            stringComparison: String(review.user._id) === String(userId),
                            isUserReview: isUserReview,
                            reviewUserName: review.user.name,
                            userTypes: {
                                reviewUserIdType: typeof review.user._id,
                                currentUserIdType: typeof userId
                            }
                        });

                        return (
                            <Box key={review._id || index} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Avatar sx={{ backgroundColor: 'primary.main' }}>
                                        {getInitials(review.user.name, review.user.surname)}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {review.user.name} {review.user.surname}
                                                    {isUserReview && (
                                                        <Typography component="span" variant="caption" sx={{ ml: 1, color: 'primary.main' }}>
                                                            (Your review)
                                                        </Typography>
                                                    )}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(review.createdAt)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Rating value={review.rating} readOnly size="small" />
                                                {isUserReview && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuClick(e, review)}
                                                        sx={{
                                                            backgroundColor: 'action.hover',
                                                            '&:hover': {
                                                                backgroundColor: 'action.selected'
                                                            }
                                                        }}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>

                                        {review.comment && (
                                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                                {review.comment}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {index < paginatedReviews.length - 1 && <Divider sx={{ mt: 3 }} />}
                            </Box>
                        );
                    })}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Paper>

            {/* Review Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleEditReview(selectedReview)}>
                    <Edit sx={{ mr: 1 }} fontSize="small" />
                    Edit Review
                </MenuItem>
                <MenuItem
                    onClick={() => handleDeleteReview(selectedReview?._id)}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 1 }} fontSize="small" />
                    Delete Review
                </MenuItem>
            </Menu>

            {/* Add/Edit Review Dialog */}
            <Dialog open={showAddReview} onClose={handleCloseReview} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingReview ? 'Edit Review' : 'Write a Review'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        {submitError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {submitError}
                            </Alert>
                        )}

                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Rate this venue
                        </Typography>
                        <Rating
                            value={newRating}
                            onChange={(event, newValue) => setNewRating(newValue)}
                            size="large"
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Your review (optional)"
                            placeholder="Share your experience at this venue..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReview}>Cancel</Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={newRating === 0 || isSubmitting}
                        sx={{
                            backgroundColor: '#FFE047',
                            color: '#2B293D',
                            '&:hover': {
                                backgroundColor: '#FFD700'
                            },
                            '&:disabled': {
                                backgroundColor: 'grey.300',
                                color: 'grey.500'
                            }
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}