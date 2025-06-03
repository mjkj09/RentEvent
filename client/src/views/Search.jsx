import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Pagination, Backdrop } from '@mui/material';
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
import { useSearchState } from '../hooks/useSearchState';
import { filterAndSortVenues, formatVenueForDisplay, isSliderChange, scrollToTop } from '../utils/searchUtils';
import { mockVenues } from '../data/mockVenues';

const ITEMS_PER_PAGE = 12;

// Helper function to simulate async operation (replace with real API calls)
const simulateAsyncOperation = async (duration = 800) => {
    return new Promise(resolve => setTimeout(resolve, duration));
};

export default function Search() {
    const navigate = useNavigate();

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
    const [venues] = useState(mockVenues);
    const [filteredVenues, setFilteredVenues] = useState(mockVenues);
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Scroll to top on component mount (when coming from Home)
    useEffect(() => {
        scrollToTop();
    }, []);

    // Apply filters and sorting with loading
    useEffect(() => {
        const applyFiltersAndSort = async () => {
            if (!isInitialLoad) {
                setIsLoading(true);
            }

            // Simulate API call delay
            await simulateAsyncOperation(isInitialLoad ? 500 : 300);

            // Apply filters and sorting
            const filtered = filterAndSortVenues(
                venues,
                debouncedFilters,
                sortBy,
                debouncedSearchQuery
            );

            setFilteredVenues(filtered);
            setCurrentPage(1);
            setIsLoading(false);
            setIsInitialLoad(false);

            // Scroll to top after applying debounced changes
            if (!isInitialLoad) {
                scrollToTop();
            }
        };

        applyFiltersAndSort();
    }, [venues, debouncedFilters, sortBy, debouncedSearchQuery, isInitialLoad]);

    // Event handlers
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        updateURL(searchQuery, newFilters, sortBy);

        // Only scroll for immediate filters (non-slider), debounced ones will scroll when applied
        if (!isSliderChange(newFilters, filters)) {
            scrollToTop();
        }
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        updateURL(searchQuery, filters, newSort);
        scrollToTop();
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        updateURL(query, filters, sortBy);
        // Don't scroll immediately - will scroll when debounced search applies
    };

    const toggleFavorite = (venueId) => {
        setFavorites(prev =>
            prev.includes(venueId)
                ? prev.filter(id => id !== venueId)
                : [...prev, venueId]
        );
    };

    const handleVenueClick = (venueId) => {
        navigate(`/venue/${venueId}`);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        scrollToTop();
    };

    // Paginate results and format for display
    const totalPages = Math.ceil(filteredVenues.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedVenues = filteredVenues
        .slice(startIndex, startIndex + ITEMS_PER_PAGE)
        .map(formatVenueForDisplay);

    // Show initial loading on first load
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
                    <Grid item size={{ xs: 12, md: 3 }}>
                        <SearchFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </Grid>

                    {/* Results Section */}
                    <Grid item size={{ xs: 12, md: 9 }}>
                        <Box sx={{ mb: 3 }}>
                            <SearchBar
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Typography variant="h6" color="text.secondary">
                                {filteredVenues.length} venues found
                            </Typography>
                            <SortingOptions
                                value={sortBy}
                                onChange={handleSortChange}
                            />
                        </Box>

                        <SearchResults
                            venues={paginatedVenues}
                            favorites={favorites}
                            onToggleFavorite={toggleFavorite}
                            onVenueClick={handleVenueClick}
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