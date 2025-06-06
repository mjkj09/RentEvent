import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Alert,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Avatar
} from '@mui/material';
import {
    Send,
    LocationOn,
    Event,
    People,
    Delete,
    Visibility,
    CheckCircle,
    Cancel,
    Schedule
} from '@mui/icons-material';
import requestApi from '../../api/request.api';
import PageLoader from '../common/PageLoader';

const ITEMS_PER_PAGE = 6;

export default function SentRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        loadRequests();
    }, [currentPage, statusFilter]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const options = {
                page: currentPage,
                limit: ITEMS_PER_PAGE
            };

            if (statusFilter) {
                options.status = statusFilter;
            }

            const response = await requestApi.getSentRequests(options);
            setRequests(response.data.requests);
            setTotalPages(response.data.pagination.pages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load sent requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setSelectedRequest(null);
    };

    const handleDeleteRequest = async (requestId) => {
        try {
            await requestApi.deleteRequest(requestId);
            await loadRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete request');
        }
    };

    const handleMarkCancelled = async (requestId) => {
        try {
            await requestApi.updateStatus(requestId, 'cancelled');
            await loadRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update request status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'responded': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Schedule />;
            case 'responded': return <CheckCircle />;
            case 'cancelled': return <Cancel />;
            default: return <Schedule />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && currentPage === 1) {
        return <PageLoader message="Loading sent requests..." />;
    }

    return (
        <Box>
            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        label="Filter by Status"
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="responded">Responded</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                <Typography variant="body2" color="text.secondary">
                    Showing {requests.length} request{requests.length !== 1 ? 's' : ''}
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Empty State */}
            {!loading && requests.length === 0 && (
                <Card sx={{ textAlign: 'center', py: 6 }}>
                    <CardContent>
                        <Send sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                            {statusFilter ? 'No requests found' : 'No sent requests yet'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            {statusFilter
                                ? `No requests found with status "${statusFilter}"`
                                : 'Start exploring venues and send your first inquiry!'
                            }
                        </Typography>
                        {!statusFilter && (
                            <Button
                                variant="contained"
                                onClick={() => window.location.href = '/search'}
                                size="large"
                            >
                                Browse Venues
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Requests Grid */}
            {requests.length > 0 && (
                <>
                    <Grid container spacing={3}>
                        {requests.map((request) => (
                            <Grid item size={{ xs: 12, md: 6 }} key={request._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        position: 'relative',
                                        '&:hover': {
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {request.venue?.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                    <LocationOn fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {request.venue?.location?.city}, {request.venue?.location?.region}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                icon={getStatusIcon(request.status)}
                                                label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                color={getStatusColor(request.status)}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>

                                        {/* Event Details */}
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Event fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <strong>Event:</strong> {request.eventType}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <People fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    <strong>Guests:</strong> {request.expectedGuestCount} people
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Date:</strong> {formatDate(request.eventDate)}
                                            </Typography>
                                        </Box>

                                        {/* Owner Info */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                {request.receiver?.name?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {request.receiver?.name} {request.receiver?.surname}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Venue Owner
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Sent Date */}
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                            Sent {new Date(request.createdAt).toLocaleDateString()}
                                        </Typography>

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Button
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => handleViewDetails(request)}
                                            >
                                                View Details
                                            </Button>

                                            {request.status === 'pending' && (
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={<Cancel />}
                                                    onClick={() => handleMarkCancelled(request._id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteRequest(request._id)}
                                                sx={{ ml: 'auto' }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Request Details Dialog */}
            <Dialog
                open={detailsOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                {selectedRequest && (
                    <>
                        <DialogTitle>
                            Request Details - {selectedRequest.venue?.name}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ py: 2 }}>
                                {/* Status */}
                                <Box sx={{ mb: 3 }}>
                                    <Chip
                                        icon={getStatusIcon(selectedRequest.status)}
                                        label={selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                        color={getStatusColor(selectedRequest.status)}
                                        variant="outlined"
                                    />
                                </Box>

                                {/* Venue Info */}
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Venue Information
                                </Typography>
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                        {selectedRequest.venue?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedRequest.venue?.category}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        📍 {selectedRequest.venue?.location?.city}, {selectedRequest.venue?.location?.region}
                                    </Typography>
                                </Box>

                                {/* Contact Info */}
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Your Contact Information
                                </Typography>
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Name:</strong> {selectedRequest.senderName}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Email:</strong> {selectedRequest.senderEmail}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Phone:</strong> {selectedRequest.senderPhone}
                                    </Typography>
                                </Box>

                                {/* Event Details */}
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Event Details
                                </Typography>
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Event Type:</strong> {selectedRequest.eventType}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Event Date:</strong> {formatDate(selectedRequest.eventDate)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Expected Guests:</strong> {selectedRequest.expectedGuestCount} people
                                    </Typography>
                                </Box>

                                {/* Message */}
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Your Message
                                </Typography>
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {selectedRequest.message}
                                    </Typography>
                                </Box>

                                {/* Venue Owner */}
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Venue Owner
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {selectedRequest.receiver?.name?.[0]?.toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {selectedRequest.receiver?.name} {selectedRequest.receiver?.surname}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedRequest.receiver?.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                    Request sent on {new Date(selectedRequest.createdAt).toLocaleDateString()} at {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}