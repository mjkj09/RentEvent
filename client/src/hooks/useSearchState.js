import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

const defaultFilters = {
    categories: [],
    priceRange: [0, 1000],
    capacity: [0, 1000],
    region: 'All Poland',
    rating: 0
};

export function useSearchState() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const initializeFromURL = useCallback(() => {
        const category = searchParams.get('category');
        const categories = searchParams.get('categories');
        const region = searchParams.get('region');
        const query = searchParams.get('q');
        const sort = searchParams.get('sort');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const capacityMin = searchParams.get('capacityMin');
        const capacityMax = searchParams.get('capacityMax');
        const rating = searchParams.get('rating');

        const initialFilters = { ...defaultFilters };

        // Handle categories (from home page or direct URL)
        if (category) {
            initialFilters.categories = [category];
        } else if (categories) {
            initialFilters.categories = categories.split(',');
        }

        // Handle region
        if (region) {
            initialFilters.region = region;
        }

        // Handle price range
        if (priceMin || priceMax) {
            initialFilters.priceRange = [
                priceMin ? parseInt(priceMin) : 0,
                priceMax ? parseInt(priceMax) : 1000
            ];
        }

        // Handle capacity range
        if (capacityMin || capacityMax) {
            initialFilters.capacity = [
                capacityMin ? parseInt(capacityMin) : 0,
                capacityMax ? parseInt(capacityMax) : 1000
            ];
        }

        // Handle rating
        if (rating) {
            initialFilters.rating = parseFloat(rating);
        }

        return {
            filters: initialFilters,
            query: query || '',
            sort: sort || 'default'
        };
    }, [searchParams]);

    // Initialize state only once
    const [initialState] = useState(() => initializeFromURL());
    const [filters, setFilters] = useState(initialState.filters);
    const [searchQuery, setSearchQuery] = useState(initialState.query);
    const [sortBy, setSortBy] = useState(initialState.sort);

    // Debounced values with proper serialization to avoid infinite loops
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Serialize arrays to strings for stable comparison
    const priceRangeString = JSON.stringify(filters.priceRange);
    const capacityString = JSON.stringify(filters.capacity);

    const debouncedPriceRange = useDebounce(priceRangeString, 300);
    const debouncedCapacity = useDebounce(capacityString, 300);

    // Create stable debounced filters object
    const debouncedFilters = useMemo(() => ({
        categories: filters.categories,
        region: filters.region,
        rating: filters.rating,
        priceRange: JSON.parse(debouncedPriceRange),
        capacity: JSON.parse(debouncedCapacity)
    }), [
        filters.categories,
        filters.region,
        filters.rating,
        debouncedPriceRange,
        debouncedCapacity
    ]);

    // Update URL function
    const updateURL = useCallback((newQuery, newFilters, newSortBy) => {
        const params = new URLSearchParams();

        // Add search query
        if (newQuery && newQuery.trim()) {
            params.set('q', newQuery.trim());
        }

        // Add categories
        if (newFilters.categories && newFilters.categories.length > 0) {
            params.set('categories', newFilters.categories.join(','));
        }

        // Add region
        if (newFilters.region && newFilters.region !== 'All Poland') {
            params.set('region', newFilters.region);
        }

        // Add price range (only if not default)
        if (newFilters.priceRange && (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 1000)) {
            params.set('priceMin', newFilters.priceRange[0].toString());
            params.set('priceMax', newFilters.priceRange[1].toString());
        }

        // Add capacity range (only if not default)
        if (newFilters.capacity && (newFilters.capacity[0] > 0 || newFilters.capacity[1] < 1000)) {
            params.set('capacityMin', newFilters.capacity[0].toString());
            params.set('capacityMax', newFilters.capacity[1].toString());
        }

        // Add rating (only if not default)
        if (newFilters.rating && newFilters.rating > 0) {
            params.set('rating', newFilters.rating.toString());
        }

        // Add sorting (only if not default)
        if (newSortBy && newSortBy !== 'default') {
            params.set('sort', newSortBy);
        }

        // Update URL without navigation
        setSearchParams(params);
    }, [setSearchParams]);

    return {
        // Current state
        filters,
        searchQuery,
        sortBy,

        // Debounced state
        debouncedFilters,
        debouncedSearchQuery,

        // Setters
        setFilters,
        setSearchQuery,
        setSortBy,

        // Utilities
        updateURL,
        defaultFilters
    };
}