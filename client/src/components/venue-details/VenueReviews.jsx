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
    Grid
} from '@mui/material';
import {
    Star,
    StarBorder,
    Add,
    Person
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export default function VenueReviews({ reviews = [], ratingStats, venueId }) {
    const { user } = useAuth();
    const [showAddReview, setShowAddReview] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    const userHasReviewed = user ? reviews.some(review => review.user._id === user._id) : false;

    // Check if current user owns this venue (prevent self-review)
    const isOwner = user ? reviews.some(review => review.venue?.owner === user._id) : false;

    const handleAddReview = () => {
        setShowAddReview(true);
    };

    const handleCloseReview = () => {
        setShowAddReview(false);
        setNewRating(0);
        setNewComment('');
    };

    const handleSubmitReview = async () => {
        if (newRating === 0) return;

        setIsSubmitting(true);
        try {
            // TODO: Implement review submission API call
            console.log('Submitting review:', {
                venueId,
                rating: newRating,
                comment: newComment
            });

            // Mock API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            handleCloseReview();
            // TODO: Refresh reviews or add to local state
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRatingDistribution = () => {
        const total = ratingStats.totalReviews;

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Rating Breakdown
                </Typography>
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingStats.ratingDistribution[rating] || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 60 }}>
                                <Typography variant="body2">{rating}</Typography>
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

    if (ratingStats.totalReviews === 0) {
        return (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Reviews
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    No reviews yet. Be the first to review this venue!
                </Alert>

                {user && !isOwner && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddReview}
                    >
                        Write a Review
                    </Button>
                )}
            </Paper>
        );
    }

    return (
        <>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Reviews ({ratingStats.totalReviews})
                </Typography>

                {/* Overall Rating Summary */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    {ratingStats.averageRating}
                                </Typography>
                                <Rating
                                    value={ratingStats.averageRating}
                                    readOnly
                                    precision={0.1}
                                    size="large"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Based on {ratingStats.totalReviews} reviews
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
                            color="primary"
                            startIcon={<Add />}
                            onClick={handleAddReview}
                            size="large"
                        >
                            Write a Review
                        </Button>
                    </Box>
                )}

                {userHasReviewed && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        You have already reviewed this venue.
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
                    {reviews.map((review, index) => (
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
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(review.createdAt)}
                                            </Typography>
                                        </Box>
                                        <Rating value={review.rating} readOnly size="small" />
                                    </Box>

                                    {review.comment && (
                                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                            {review.comment}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {index < reviews.length - 1 && <Divider sx={{ mt: 3 }} />}
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Add Review Dialog */}
            <Dialog open={showAddReview} onClose={handleCloseReview} maxWidth="sm" fullWidth>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
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
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}