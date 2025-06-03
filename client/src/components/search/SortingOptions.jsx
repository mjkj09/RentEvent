import React from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Box
} from '@mui/material';
import {
    Sort
} from '@mui/icons-material';

export default function SortingOptions({ value, onChange }) {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="sort-select-label">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Sort sx={{ fontSize: 18 }} />
                        Sort by
                    </Box>
                </InputLabel>
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    value={value}
                    label="Sort by......."
                    onChange={handleChange}
                    variant="outlined"
                >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="reviews">Most Reviewed</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}