// Helper function to format venue data for display
export const formatVenueForDisplay = (venue) => {
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

// Apply search query filter
export const applySearchQuery = (venues, query) => {
    if (!query) return venues;

    return venues.filter(venue =>
        venue.name.toLowerCase().includes(query.toLowerCase()) ||
        venue.location.city.toLowerCase().includes(query.toLowerCase()) ||
        venue.location.region.toLowerCase().includes(query.toLowerCase()) ||
        venue.category.toLowerCase().includes(query.toLowerCase()) ||
        venue.description.toLowerCase().includes(query.toLowerCase())
    );
};

// Apply category filter
export const applyCategoryFilter = (venues, categories) => {
    if (categories.length === 0) return venues;

    return venues.filter(venue =>
        categories.includes(venue.category)
    );
};

// Apply region filter
export const applyRegionFilter = (venues, region) => {
    if (region === 'All Poland') return venues;

    return venues.filter(venue =>
        venue.location.region === region
    );
};

// Apply price range filter
export const applyPriceFilter = (venues, priceRange) => {
    return venues.filter(venue => {
        if (venue.pricing.isPriceHidden || !venue.pricing.minPricePerPerson) {
            return true; // Include venues with hidden prices
        }
        const minPrice = venue.pricing.minPricePerPerson;
        const maxPrice = venue.pricing.maxPricePerPerson || minPrice;

        return (minPrice >= priceRange[0] && minPrice <= priceRange[1]) ||
            (maxPrice >= priceRange[0] && maxPrice <= priceRange[1]);
    });
};

// Apply capacity filter
export const applyCapacityFilter = (venues, capacity) => {
    return venues.filter(venue => {
        const venueCapacity = venue.capacityNumber || 0;
        return venueCapacity >= capacity[0] && venueCapacity <= capacity[1];
    });
};

// Apply rating filter
export const applyRatingFilter = (venues, rating) => {
    if (rating <= 0) return venues;

    return venues.filter(venue => venue.rating >= rating);
};

// Apply sorting
export const applySorting = (venues, sortBy) => {
    const sortedVenues = [...venues];

    switch (sortBy) {
        case 'price-low':
            return sortedVenues.sort((a, b) => {
                if (a.pricing.isPriceHidden || !a.pricing.minPricePerPerson) return 1;
                if (b.pricing.isPriceHidden || !b.pricing.minPricePerPerson) return -1;
                return a.pricing.minPricePerPerson - b.pricing.minPricePerPerson;
            });
        case 'price-high':
            return sortedVenues.sort((a, b) => {
                if (a.pricing.isPriceHidden || !a.pricing.minPricePerPerson) return 1;
                if (b.pricing.isPriceHidden || !b.pricing.minPricePerPerson) return -1;
                const aPrice = a.pricing.maxPricePerPerson || a.pricing.minPricePerPerson;
                const bPrice = b.pricing.maxPricePerPerson || b.pricing.minPricePerPerson;
                return bPrice - aPrice;
            });
        case 'rating':
            return sortedVenues.sort((a, b) => b.rating - a.rating);
        case 'reviews':
            return sortedVenues.sort((a, b) => b.reviews - a.reviews);
        default:
            return sortedVenues;
    }
};

// Main filter and sort function
export const filterAndSortVenues = (venues, filters, sortBy, searchQuery) => {
    let filtered = venues;

    // Apply all filters in sequence
    filtered = applySearchQuery(filtered, searchQuery);
    filtered = applyCategoryFilter(filtered, filters.categories);
    filtered = applyRegionFilter(filtered, filters.region);
    filtered = applyPriceFilter(filtered, filters.priceRange);
    filtered = applyCapacityFilter(filtered, filters.capacity);
    filtered = applyRatingFilter(filtered, filters.rating);

    // Apply sorting
    filtered = applySorting(filtered, sortBy);

    return filtered;
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