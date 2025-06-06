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
    Inbox,
    LocationOn,
    Event,
    People,
    Email,
    Phone,
    Delete,
    Visibility,
    CheckCircle,
    Schedule
} from '@mui/icons-material';
import requestApi from '../../api/request.api';
import PageLoader from '../common/PageLoader';

const ITEMS_PER_PAGE = 6;

export default function ReceivedRequests() {
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

            const response = await requestApi.getReceivedRequests(options);
            setRequests(response.data.requests);
            setTotalPages(response.data.pagination.pages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load received requests');
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

    const handleViewDetails = async (request) => {
        // Mark as read when viewing details
        if (!request.isReadByReceiver) {
            try {
                await requestApi.markAsRead(request._id);
                // Update the request in local state
                setRequests(prev => prev.map(req =>
                    req._id === request._id
                        ? {...req, isReadByReceiver: true}
                        : req
                ));
            } catch (error) {
                // Handle error silently
            }
        }

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

    const handleMarkResponded = async (requestId) => {
        try {
            await requestApi.updateStatus(requestId, 'responded');
            await loadRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update request status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'responded':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Schedule/>;
            case 'responded':
                return <CheckCircle/>;
            case 'cancelled':
                return <Schedule/>;
            default:
                return <Schedule/>;
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
        return <PageLoader message="Loading received requests..."/>;
    }

    return (
        <Box>
            {/* Filters */}
            <Box sx={{mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap'}}>
                <FormControl sx={{minWidth: 200}}>
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
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {/* Empty State */}
            {!loading && requests.length === 0 && (
                <Card sx={{textAlign: 'center', py: 6}}>
                    <CardContent>
                        <Inbox sx={{fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5}}/>
                        <Typography variant="h5" sx={{fontWeight: 600, mb: 2}}>
                            {statusFilter ? 'No requests found' : 'No received requests yet'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                            {statusFilter
                                ? `No requests found with status "${statusFilter}"`
                                : 'When event organizers are interested in your venues, their inquiries will appear here.'
                            }
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Requests Grid */}
            {requests.length > 0 && (
                <>
                    <Grid container spacing={3}>
                        {requests.map((request) => (
                            <Grid item size={{xs: 12, md: 6}} key={request._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        position: 'relative',
                                        border: !request.isReadByReceiver ? '2px solid' : 'none',
                                        borderColor: !request.isReadByReceiver ? 'secondary.main' : 'transparent',
                                        '&:hover': {
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    {!request.isReadByReceiver && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'error.main',
                                                color: 'white',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                zIndex: 1
                                            }}
                                        >
                                            NEW
                                        </Box>
                                    )}

                                    <CardContent sx={{p: 3}}>
                                        {/* Header */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 2
                                        }}>
                                            <Box sx={{flex: 1}}>
                                                <Typography variant="h6" sx={{fontWeight: 600, mb: 1}}>
                                                    {request.venue?.name}
                                                </Typography>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 1}}>
                                                    <LocationOn fontSize="small" color="action"/>
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
                                        <Box sx={{mb: 2}}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                                <Event fontSize="small" color="action"/>
                                                <Typography variant="body2">
                                                    <strong>Event:</strong> {request.eventType}
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                                <People fontSize="small" color="action"/>
                                                <Typography variant="body2">
                                                    <strong>Guests:</strong> {request.expectedGuestCount} people
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Date:</strong> {formatDate(request.eventDate)}
                                            </Typography>
                                        </Box>

                                        {/* Sender Info */}
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 2}}>
                                            <Avatar sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: 'secondary.main',
                                                color: 'primary.main'
                                            }}>
                                                {request.sender?.name?.[0]?.toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{fontWeight: 600}}>
                                                    {request.senderName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Event Organizer
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Contact Info */}
                                        <Box sx={{mb: 2}}>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 0.5}}>
                                                <Email fontSize="small" color="action"/>
                                                <Typography variant="body2" sx={{fontSize: '0.875rem'}}>
                                                    {request.senderEmail}
                                                </Typography>
                                            </Box>
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                <Phone fontSize="small" color="action"/>
                                                <Typography variant="body2" sx={{fontSize: '0.875rem'}}>
                                                    {request.senderPhone}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Received Date */}
                                        <Typography variant="caption" color="text.secondary"
                                                    sx={{mb: 2, display: 'block'}}>
                                            Received {new Date(request.createdAt).toLocaleDateString()}
                                        </Typography>

                                        {/* Quick Actions */}
                                        <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center'}}>
                                            <Button
                                                size="small"
                                                startIcon={<Visibility/>}
                                                onClick={() => handleViewDetails(request)}
                                                variant={!request.isReadByReceiver ? 'contained' : 'outlined'}
                                                color={!request.isReadByReceiver ? 'secondary' : 'primary'}
                                            >
                                                View Details
                                            </Button>

                                            <Button
                                                size="small"
                                                href={`mailto:${request.senderEmail}?subject=Re: ${request.venue?.name} Venue Inquiry`}
                                                startIcon={<Email/>}
                                                color="primary"
                                            >
                                                Reply
                                            </Button>

                                            <Button
                                                size="small"
                                                href={`tel:${request.senderPhone}`}
                                                startIcon={<Phone/>}
                                                color="primary"
                                            >
                                                Call
                                            </Button>

                                            {request.status === 'pending' && (
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    startIcon={<CheckCircle/>}
                                                    onClick={() => handleMarkResponded(request._id)}
                                                >
                                                    Mark Responded
                                                </Button>
                                            )}

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteRequest(request._id)}
                                                sx={{ml: 'auto'}}
                                            >
                                                <Delete fontSize="small"/>
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
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
                            Inquiry for {selectedRequest.venue?.name}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{py: 2}}>
                                {/* Status */}
                                <Box sx={{mb: 3, display: 'flex', gap: 2, alignItems: 'center'}}>
                                    <Chip
                                        icon={getStatusIcon(selectedRequest.status)}
                                        label={selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                        color={getStatusColor(selectedRequest.status)}
                                        variant="outlined"
                                    />
                                    {!selectedRequest.isReadByReceiver && (
                                        <Chip
                                            label="New"
                                            color="error"
                                            size="small"
                                        />
                                    )}
                                </Box>

                                {/* Venue Info */}
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                                    Venue Information
                                </Typography>
                                <Box sx={{mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2}}>
                                    <Typography variant="body1" sx={{fontWeight: 600, mb: 1}}>
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
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                                    Contact Information
                                </Typography>
                                <Box sx={{mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2}}>
                                    <Typography variant="body2">
                                        <strong>Name:</strong> {selectedRequest.senderName}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Email:</strong>
                                        <Button
                                            href={`mailto:${selectedRequest.senderEmail}?subject=Re: ${selectedRequest.venue?.name} Venue Inquiry`}
                                            sx={{ml: 1, p: 0, textTransform: 'none', minWidth: 'auto'}}
                                        >
                                            {selectedRequest.senderEmail}
                                        </Button>
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Phone:</strong>
                                        <Button
                                            href={`tel:${selectedRequest.senderPhone}`}
                                            sx={{ml: 1, p: 0, textTransform: 'none', minWidth: 'auto'}}
                                        >
                                            {selectedRequest.senderPhone}
                                        </Button>
                                    </Typography>
                                </Box>

                                {/* Event Details */}
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                                    Event Details
                                </Typography>
                                <Box sx={{mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2}}>
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
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 2}}>
                                    Message from {selectedRequest.senderName}
                                </Typography>
                                <Box sx={{mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2}}>
                                    <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>
                                        {selectedRequest.message}
                                    </Typography>
                                </Box>

                                <Typography variant="caption" color="text.secondary" sx={{mt: 2, display: 'block'}}>
                                    Request received
                                    on {new Date(selectedRequest.createdAt).toLocaleDateString()} at {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                href={`mailto:${selectedRequest.senderEmail}?subject=Re: ${selectedRequest.venue?.name} Venue Inquiry&body=Hi ${selectedRequest.senderName},%0D%0A%0D%0AThank you for your interest in ${selectedRequest.venue?.name}!`}
                                startIcon={<Email/>}
                                variant="contained"
                                color="secondary"
                            >
                                Reply via Email
                            </Button>
                            <Button
                                href={`tel:${selectedRequest.senderPhone}`}
                                startIcon={<Phone/>}
                                variant="outlined"
                            >
                                Call
                            </Button>
                            <Button onClick={handleCloseDetails}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    )
}