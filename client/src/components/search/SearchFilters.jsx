import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Checkbox,
    FormControlLabel,
    Slider,
    Select,
    MenuItem,
    FormControl,
    Button,
    Divider,
    Rating,
    Collapse,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    FilterList,
    Clear
} from '@mui/icons-material';

const categories = [
    'Wedding & Banquet Halls',
    'Conference & Meeting Rooms',
    'Outdoor & Garden Spaces',
    'Clubs & Bars',
    'Lofts & Industrial Venues',
    'Unique & Themed Spaces'
];

const regions = [
    'All Poland',
    'Malopolska',
    'Mazowieckie',
    'Dolnoslaskie',
    'Pomorskie',
    'Wielkopolskie',
    'Slaskie',
    'Lubelskie',
    'Podlaskie',
    'Zachodniopomorskie',
    'Lubuskie',
    'Kujawsko-Pomorskie',
    'Lodzkie',
    'Swietokrzyskie',
    'Podkarpackie',
    'Warminsko-Mazurskie'
];

export default function SearchFilters({ filters, onFilterChange }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        region: true,
        price: true,
        capacity: true,
        rating: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];

        onFilterChange({ ...filters, categories: newCategories });
    };

    const handleRegionChange = (event) => {
        onFilterChange({ ...filters, region: event.target.value });
    };

    const handlePriceChange = (event, newValue) => {
        onFilterChange({ ...filters, priceRange: newValue });
    };

    const handleCapacityChange = (event, newValue) => {
        onFilterChange({ ...filters, capacity: newValue });
    };

    const handleRatingChange = (event, newValue) => {
        onFilterChange({ ...filters, rating: newValue || 0 });
    };

    const handleClearFilters = () => {
        onFilterChange({
            categories: [],
            priceRange: [0, 1000],
            capacity: [0, 1000],
            region: 'All Poland',
            rating: 0
        });
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.region !== 'All Poland' ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 1000 ||
        filters.capacity[0] > 0 ||
        filters.capacity[1] < 1000 ||
        filters.rating > 0;

    const filterContent = (
        <>
            {/* Categories */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        cursor: 'pointer'
                    }}
                    onClick={() => toggleSection('categories')}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Categories
                    </Typography>
                    <IconButton size="small">
                        {expandedSections.categories ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                <Collapse in={expandedSections.categories}>
                    <Box sx={{ pl: 1 }}>
                        {categories.map(category => (
                            <FormControlLabel
                                key={category}
                                control={
                                    <Checkbox
                                        checked={filters.categories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                        color="secondary"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        {category}
                                    </Typography>
                                }
                                sx={{ mb: 2 }}
                            />
                        ))}
                    </Box>
                </Collapse>
            </Box>

            <Divider sx={{ mt: -1, mb: 3 }} />

            {/* Capacity */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                        cursor: 'pointer'
                    }}
                    onClick={() => toggleSection('capacity')}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Capacity
                    </Typography>
                    <IconButton size="small">
                        {expandedSections.capacity ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                <Collapse in={expandedSections.capacity}>
                    <Box sx={{ px: 2, pt: 1 }}>
                        <Slider
                            value={filters.capacity}
                            onChange={handleCapacityChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                            step={25}
                            color="secondary"
                            valueLabelFormat={(value) => `${value} guests`}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                {filters.capacity[0]} guests
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {filters.capacity[1]}+ guests
                            </Typography>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Region */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                        cursor: 'pointer'
                    }}
                    onClick={() => toggleSection('region')}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Region
                    </Typography>
                    <IconButton size="small">
                        {expandedSections.region ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                <Collapse in={expandedSections.region}>
                    <FormControl fullWidth size="small" variant="outlined">
                        <Select
                            value={filters.region}
                            onChange={handleRegionChange}
                        >
                            {regions.map(region => (
                                <MenuItem key={region} value={region}>
                                    {region}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Collapse>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                        cursor: 'pointer'
                    }}
                    onClick={() => toggleSection('price')}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Price per Person
                    </Typography>
                    <IconButton size="small">
                        {expandedSections.price ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                <Collapse in={expandedSections.price}>
                    <Box sx={{ px: 2, pt: 1 }}>
                        <Slider
                            value={filters.priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                            step={50}
                            color="secondary"
                            valueLabelFormat={(value) => `PLN ${value}`}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                PLN {filters.priceRange[0]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                PLN {filters.priceRange[1]}
                            </Typography>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Rating */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                        cursor: 'pointer'
                    }}
                    onClick={() => toggleSection('rating')}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Minimum Rating
                    </Typography>
                    <IconButton size="small">
                        {expandedSections.rating ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
                <Collapse in={expandedSections.rating}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating
                            value={filters.rating}
                            onChange={handleRatingChange}
                            size="large"
                            precision={1}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {filters.rating > 0 ? `${filters.rating}+` : 'Any'}
                        </Typography>
                    </Box>
                </Collapse>
            </Box>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                    sx={{ mt: 3 }}
                >
                    Clear All Filters
                </Button>
            )}
        </>
    );

    if (isMobile) {
        return (
            <>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<FilterList />}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    sx={{ mb: 2 }}
                >
                    Filters {hasActiveFilters && `(Active)`}
                </Button>
                <Collapse in={mobileOpen}>
                    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                        {filterContent}
                    </Paper>
                </Collapse>
            </>
        );
    }

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                position: 'sticky',
                top: 80,
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto'
            }}
        >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Filters
            </Typography>
            {filterContent}
        </Paper>
    );
}