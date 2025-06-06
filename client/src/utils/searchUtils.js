// Helper function to format venue data for display
export const formatVenueForDisplay = (venue) => {
    let priceRange = 'Ask for an offer';

    if (!venue.pricing?.isPriceHidden && venue.pricing?.minPricePerPerson) {
        if (venue.pricing.minPricePerPerson === venue.pricing.maxPricePerPerson || !venue.pricing.maxPricePerPerson) {
            priceRange = `PLN ${venue.pricing.minPricePerPerson} / guest`;
        } else {
            priceRange = `PLN ${venue.pricing.minPricePerPerson}-${venue.pricing.maxPricePerPerson} / guest`;
        }
    }

    return {
        ...venue,
        location: `${venue.location?.city || 'Unknown'}, ${venue.location?.region || 'Unknown'}`,
        priceRange: priceRange,
        image: venue.bannerImage || venue.images?.[0] || '/placeholder-venue.jpg',
        tags: [venue.category],
        rating: venue.ratingStats?.averageRating || venue.rating || 0,
        reviews: venue.ratingStats?.totalReviews || venue.reviews || 0,
        capacityNumber: venue.capacity
    };
};

// Build API query parameters from filters
export const buildApiQuery = (filters, sortBy, searchQuery, page = 1, limit = 12) => {
    const params = {
        page,
        limit
    };

    // Add search query
    if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
    }

    // Add categories
    if (filters.categories && filters.categories.length > 0) {
        params.categories = filters.categories.join(',');
    }

    // Add region
    if (filters.region && filters.region !== 'All Poland') {
        params.region = filters.region;
    }

    // Add price range
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000)) {
        if (filters.priceRange[0] > 0) {
            params.minPrice = filters.priceRange[0];
        }
        if (filters.priceRange[1] < 1000) {
            params.maxPrice = filters.priceRange[1];
        }
    }

    // Add capacity range
    if (filters.capacity && (filters.capacity[0] > 0 || filters.capacity[1] < 1000)) {
        if (filters.capacity[0] > 0) {
            params.minCapacity = filters.capacity[0];
        }
        if (filters.capacity[1] < 1000) {
            params.maxCapacity = filters.capacity[1];
        }
    }

    // Add rating
    if (filters.rating && filters.rating > 0) {
        params.minRating = filters.rating;
    }

    // Add sorting
    if (sortBy && sortBy !== 'default') {
        params.sort = sortBy;
    }

    return params;
};

// Client-side filtering for backup/fallback (keeping existing logic for compatibility)
export const applySearchQuery = (venues, query) => {
    if (!query) return venues;

    return venues.filter(venue =>
        venue.name?.toLowerCase().includes(query.toLowerCase()) ||
        venue.location?.city?.toLowerCase().includes(query.toLowerCase()) ||
        venue.location?.region?.toLowerCase().includes(query.toLowerCase()) ||
        venue.category?.toLowerCase().includes(query.toLowerCase()) ||
        venue.description?.toLowerCase().includes(query.toLowerCase())
    );
};

export const applyCategoryFilter = (venues, categories) => {
    if (categories.length === 0) return venues;
    return venues.filter(venue => categories.includes(venue.category));
};

export const applyRegionFilter = (venues, region) => {
    if (region === 'All Poland') return venues;
    return venues.filter(venue => venue.location?.region === region);
};

export const applyPriceFilter = (venues, priceRange) => {
    return venues.filter(venue => {
        if (venue.pricing?.isPriceHidden || !venue.pricing?.minPricePerPerson) {
            return true;
        }
        const minPrice = venue.pricing.minPricePerPerson;
        const maxPrice = venue.pricing.maxPricePerPerson || minPrice;

        return (minPrice >= priceRange[0] && minPrice <= priceRange[1]) ||
            (maxPrice >= priceRange[0] && maxPrice <= priceRange[1]);
    });
};

export const applyCapacityFilter = (venues, capacity) => {
    return venues.filter(venue => {
        const venueCapacity = venue.capacity || 0;
        return venueCapacity >= capacity[0] && venueCapacity <= capacity[1];
    });
};

export const applyRatingFilter = (venues, rating) => {
    if (rating <= 0) return venues;
    return venues.filter(venue => (venue.rating || 0) >= rating);
};

export const applySorting = (venues, sortBy) => {
    const sortedVenues = [...venues];

    switch (sortBy) {
        case 'price-low':
            return sortedVenues.sort((a, b) => {
                if (a.pricing?.isPriceHidden || !a.pricing?.minPricePerPerson) return 1;
                if (b.pricing?.isPriceHidden || !b.pricing?.minPricePerPerson) return -1;
                return a.pricing.minPricePerPerson - b.pricing.minPricePerPerson;
            });
        case 'price-high':
            return sortedVenues.sort((a, b) => {
                if (a.pricing?.isPriceHidden || !a.pricing?.minPricePerPerson) return 1;
                if (b.pricing?.isPriceHidden || !b.pricing?.minPricePerPerson) return -1;
                const aPrice = a.pricing.maxPricePerPerson || a.pricing.minPricePerPerson;
                const bPrice = b.pricing.maxPricePerPerson || b.pricing.minPricePerPerson;
                return bPrice - aPrice;
            });
        case 'rating':
            return sortedVenues.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'reviews':
            return sortedVenues.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        default:
            return sortedVenues;
    }
};

// Check if slider values changed
export const isSliderChange = (newFilters, oldFilters) => {
    return newFilters.priceRange[0] !== oldFilters.priceRange[0] ||
        newFilters.priceRange[1] !== oldFilters.priceRange[1] ||
        newFilters.capacity[0] !== oldFilters.capacity[0] ||
        newFilters.capacity[1] !== oldFilters.capacity[1];
};

// Scroll to top utility
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};