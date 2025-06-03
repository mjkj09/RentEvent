import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Pagination } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import SearchFilters from '../components/search/SearchFilters';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import SortingOptions from '../components/search/SortingOptions';

// Mock data adjusted to venue model structure
const mockVenues = [
    {
        id: 1,
        name: 'Royal Banquet Hall',
        category: 'Wedding & Banquet Halls',
        location: {
            street: 'Floriańska 15',
            city: 'Krakow',
            region: 'Malopolska'
        },
        description: 'Elegant banquet hall perfect for weddings and special occasions. Features beautiful chandeliers and spacious dance floor.',
        pricing: {
            minPricePerPerson: 400,
            maxPricePerPerson: 600,
            isPriceHidden: false
        },
        images: ['/home/weddingAndBanquetHalls.jpg'],
        rating: 4.8,
        reviews: 14,
        capacity: '400 guests',
        capacityNumber: 400
    },
    {
        id: 2,
        name: 'Skyline Rooftop Lounge',
        category: 'Unique & Themed Spaces',
        location: {
            street: 'Marszałkowska 100',
            city: 'Warszawa',
            region: 'Mazowieckie'
        },
        description: 'Modern rooftop venue with stunning city views. Perfect for corporate events and exclusive parties.',
        pricing: {
            minPricePerPerson: 450,
            maxPricePerPerson: 450,
            isPriceHidden: false
        },
        images: ['/home/uniqueAndThemedSpaces.jpg'],
        rating: 4.6,
        reviews: 16,
        capacity: '150 guests',
        capacityNumber: 150
    },
    {
        id: 3,
        name: 'Cozy Basement Pub',
        category: 'Clubs & Bars',
        location: {
            street: 'Długa 45',
            city: 'Gdansk',
            region: 'Pomorskie'
        },
        description: 'Intimate basement venue with rustic charm. Great for casual gatherings and themed parties.',
        pricing: {
            minPricePerPerson: null,
            maxPricePerPerson: null,
            isPriceHidden: true
        },
        images: ['/home/clubsAndBars.jpg'],
        rating: 4.5,
        reviews: 8,
        capacity: '80 guests',
        capacityNumber: 80
    },
    {
        id: 4,
        name: 'Lush Garden Estate',
        category: 'Wedding & Banquet Halls',
        location: {
            street: 'Ogrodowa 22',
            city: 'Szaflary',
            region: 'Malopolska'
        },
        description: 'Beautiful garden venue surrounded by nature. Perfect for outdoor weddings and garden parties.',
        pricing: {
            minPricePerPerson: 200,
            maxPricePerPerson: 300,
            isPriceHidden: false
        },
        images: ['/home/outdoorAndGardenSpaces.jpg'],
        rating: 4.9,
        reviews: 48,
        capacity: '300 guests',
        capacityNumber: 300
    },
    {
        id: 5,
        name: 'Modern Conference Center',
        category: 'Conference & Meeting Rooms',
        location: {
            street: 'Poznańska 88',
            city: 'Poznan',
            region: 'Wielkopolskie'
        },
        description: 'State-of-the-art conference facility with modern AV equipment and flexible meeting spaces.',
        pricing: {
            minPricePerPerson: null,
            maxPricePerPerson: null,
            isPriceHidden: true
        },
        images: ['/home/conferenceAndMeetingRooms.jpg'],
        rating: 4.7,
        reviews: 12,
        capacity: '200 guests',
        capacityNumber: 200
    },
    {
        id: 6,
        name: 'Industrial Loft Space',
        category: 'Lofts & Industrial Venues',
        location: {
            street: 'Przemysłowa 12',
            city: 'Katowice',
            region: 'Slaskie'
        },
        description: 'Converted industrial space with high ceilings and urban charm. Ideal for modern events and exhibitions.',
        pricing: {
            minPricePerPerson: 370,
            maxPricePerPerson: 370,
            isPriceHidden: false
        },
        images: ['/home/loftsAndIndustrialVenues.jpg'],
        rating: 4.4,
        reviews: 160,
        capacity: '370 guests',
        capacityNumber: 370
    },
    {
        id: 7,
        name: 'Crystal Palace Ballroom',
        category: 'Wedding & Banquet Halls',
        location: {
            street: 'Królewska 5',
            city: 'Krakow',
            region: 'Malopolska'
        },
        description: 'Luxurious ballroom with crystal chandeliers and marble floors. The epitome of elegance for prestigious events.',
        pricing: {
            minPricePerPerson: 550,
            maxPricePerPerson: 700,
            isPriceHidden: false
        },
        images: ['/home/weddingAndBanquetHalls.jpg'],
        rating: 4.9,
        reviews: 89,
        capacity: '500 guests',
        capacityNumber: 500
    },
    {
        id: 8,
        name: 'The Vintage Warehouse',
        category: 'Lofts & Industrial Venues',
        location: {
            street: 'Stara 33',
            city: 'Wroclaw',
            region: 'Dolnoslaskie'
        },
        description: 'Charming vintage warehouse with exposed brick walls and wooden beams. Perfect for rustic-themed events.',
        pricing: {
            minPricePerPerson: 320,
            maxPricePerPerson: 320,
            isPriceHidden: false
        },
        images: ['/home/loftsAndIndustrialVenues.jpg'],
        rating: 4.7,
        reviews: 34,
        capacity: '250 guests',
        capacityNumber: 250
    }
];

export default function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [venues, setVenues] = useState(mockVenues);
    const [filteredVenues, setFilteredVenues] = useState(mockVenues);
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('default');
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 1000],
        capacity: [0, 1000],
        region: 'All Poland',
        rating: 0
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Ref do sekcji z wynikami
    const resultsRef = useRef(null);

    const itemsPerPage = 12;

    // Helper function to format venue data for display
    const formatVenueForDisplay = (venue) => {
        let priceRange = 'Ask for an offer';

        if (!venue.pricing.isPriceHidden && venue.pricing.minPricePerPerson) {
            if (venue.pricing.minPricePerPerson === venue.pricing.maxPricePerPerson) {
                priceRange = `PLN ${venue.pricing.minPricePerPerson} / guest`;
            } else {
                priceRange = `PLN ${venue.pricing.minPricePerPerson}-${venue.pricing.maxPricePerPerson} / guest`;
            }
        }

        return {
            ...venue,
            location: `${venue.location.city}, ${venue.location.region}`,
            priceRange: priceRange,
            image: venue.images[0] || '/placeholder-venue.jpg',
            tags: [venue.category]
        };
    };

    // Initialize from URL params
    useEffect(() => {
        const category = searchParams.get('category');
        const region = searchParams.get('region');
        const query = searchParams.get('q');

        if (category) {
            setFilters(prev => ({
                ...prev,
                categories: [category]
            }));
        }

        if (region) {
            setFilters(prev => ({
                ...prev,
                region: region
            }));
        }

        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...venues];

        // Apply search query
        if (searchQuery) {
            filtered = filtered.filter(venue =>
                venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (filters.categories.length > 0) {
            filtered = filtered.filter(venue =>
                filters.categories.includes(venue.category)
            );
        }

        // Apply region filter
        if (filters.region !== 'All Poland') {
            filtered = filtered.filter(venue =>
                venue.location.region === filters.region
            );
        }

        // Apply price range filter
        filtered = filtered.filter(venue => {
            if (venue.pricing.isPriceHidden || !venue.pricing.minPricePerPerson) {
                return true; // Include venues with hidden prices
            }
            const minPrice = venue.pricing.minPricePerPerson;
            const maxPrice = venue.pricing.maxPricePerPerson || minPrice;

            return (minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]) ||
                (maxPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1]);
        });

        // Apply capacity filter
        filtered = filtered.filter(venue => {
            const capacity = venue.capacityNumber || 0;
            return capacity >= filters.capacity[0] && capacity <= filters.capacity[1];
        });

        // Apply rating filter
        if (filters.rating > 0) {
            filtered = filtered.filter(venue => venue.rating >= filters.rating);
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => {
                    if (a.pricing.isPriceHidden || !a.pricing.minPricePerPerson) return 1;
                    if (b.pricing.isPriceHidden || !b.pricing.minPricePerPerson) return -1;
                    return a.pricing.minPricePerPerson - b.pricing.minPricePerPerson;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    if (a.pricing.isPriceHidden || !a.pricing.minPricePerPerson) return 1;
                    if (b.pricing.isPriceHidden || !b.pricing.minPricePerPerson) return -1;
                    const aPrice = a.pricing.maxPricePerPerson || a.pricing.minPricePerPerson;
                    const bPrice = b.pricing.maxPricePerPerson || b.pricing.minPricePerPerson;
                    return bPrice - aPrice;
                });
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'reviews':
                filtered.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                break;
        }

        setFilteredVenues(filtered);
        setCurrentPage(1);

        // Smooth scroll to results section when filters change
        if (resultsRef.current) {
            resultsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [venues, filters, sortBy, searchQuery]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
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
        if (resultsRef.current) {
            resultsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Paginate results and format for display
    const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedVenues = filteredVenues
        .slice(startIndex, startIndex + itemsPerPage)
        .map(formatVenueForDisplay);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />

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
                        {/* Ref element for smooth scrolling */}
                        <div ref={resultsRef} />

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