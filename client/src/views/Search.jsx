import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Pagination, Backdrop, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import SearchFilters from '../components/search/SearchFilters';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import SortingOptions from '../components/search/SortingOptions';
import { DotsSpinner, CircularSpinner } from '../components/common/LoadingSpinner';

// Hooks and utilities
import { useAuth } from '../hooks/useAuth';
import { useSearchState } from '../hooks/useSearchState';
import { formatVenueForDisplay, buildApiQuery, scrollToTop } from '../utils/searchUtils';
import venueService from '../services/venue.service';
import favoritesService from '../services/favorites.service';

const ITEMS_PER_PAGE = 12;

export default function Search() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Search state management
    const {
        filters,
        searchQuery,
        sortBy,
        debouncedFilters,
        debouncedSearchQuery,
        setFilters,
        setSearchQuery,
        setSortBy,
        updateURL
    } = useSearchState();

    // Local component state
    const [venues, setVenues] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [error, setError] = useState(null);

    // Scroll to top on component mount
    useEffect(() => {
        scrollToTop();
    }, []);

    // Load user favorites
    useEffect(() => {
        if (isAuthenticated) {
            loadUserFavorites();
        }
    }, [isAuthenticated]);

    // Search venues when filters/query changes
    useEffect(() => {
        searchVenues();
    }, [debouncedFilters, debouncedSearchQuery, sortBy, currentPage]);

    const loadUserFavorites = async () => {
        try {
            const userFavorites = await favoritesService.getFavorites();
            setFavorites(userFavorites.map(venue => venue._id));
        } catch (err) {
            console.error('Error loading user favorites:', err);
        }
    };

    const searchVenues = async () => {
        try {
            if (!isInitialLoad) {
                setIsLoading(true);
            }
            setError(null);

            // Build API query parameters
            const queryParams = buildApiQuery(
                debouncedFilters,
                sortBy,
                debouncedSearchQuery,
                currentPage,
                ITEMS_PER_PAGE
            );

            // Call API
            const response = await venueService.getAllVenues(queryParams);
            const venueData = Array.isArray(response) ? response : [];

            setVenues(venueData);

            // Calculate total pages (since we don't have pagination from API yet)
            setTotalPages(Math.max(1, Math.ceil(venueData.length / ITEMS_PER_PAGE)));

            if (isInitialLoad) {
                setIsInitialLoad(false);
            }

            // Scroll to top after applying debounced changes
            if (!isInitialLoad) {
                scrollToTop();
            }

        } catch (err) {
            setError(err.message || 'Failed to search venues');
            setVenues([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    // Event handlers
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        updateURL(searchQuery, newFilters, sortBy);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
        updateURL(searchQuery, filters, newSort);
        scrollToTop();
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        updateURL(query, filters, sortBy);
    };

    const handleToggleFavorite = async (venueId) => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        try {
            const currentStatus = favorites.includes(venueId);
            const newStatus = await favoritesService.toggleFavorite(venueId, currentStatus);

            if (newStatus) {
                setFavorites(prev => [...prev, venueId]);
            } else {
                setFavorites(prev => prev.filter(id => id !== venueId));
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const handleVenueClick = (venueId) => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        navigate(`/venue/${venueId}`);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        scrollToTop();
    };

    // Format venues for display and paginate
    const formattedVenues = venues.map(formatVenueForDisplay);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedVenues = formattedVenues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Show initial loading
    if (isInitialLoad) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                    <Box
                        sx={{
                            minHeight: '60vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <DotsSpinner size="large" message="Loading venues..." />
                    </Box>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

            {/* Loading backdrop for filter/sort operations */}
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
                open={isLoading}
            >
                <CircularSpinner size={60} message="Updating results..." />
            </Backdrop>

            <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
                <Grid container spacing={3}>
                    {/* Filters Section */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <SearchFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Grid>

                    {/* Results Section */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Box sx={{ mb: 3 }}>
                            <SearchBar
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Typography variant="h6" color="text.secondary">
                                {venues.length} venues found
                            </Typography>
                            <SortingOptions
                                value={sortBy}
                                onChange={handleSortChange}
                            />
                        </Box>

                        <SearchResults
                            venues={paginatedVenues}
                            favorites={favorites}
                            onToggleFavorite={handleToggleFavorite}
                            onVenueClick={handleVenueClick}
                            isAuthenticated={isAuthenticated}
                        />

                        {totalPages > 1 && (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 4
                            }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </Box>
    );
}