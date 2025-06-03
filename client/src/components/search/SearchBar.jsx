import React, { useState } from 'react';
import {
    Paper,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Search,
    Clear
} from '@mui/icons-material';

export default function SearchBar({ value, onChange }) {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onChange(localValue);
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'background.paper'
            }}
        >
            <TextField
                fullWidth
                placeholder="Search by venue name, location, or category..."
                value={localValue}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                variant="standard"
                slotProps={{
                    input: {
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        endAdornment: localValue && (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClear}
                                    edge="end"
                                    size="small"
                                >
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            fontSize: '1.1rem',
                            px: 2,
                            py: 1
                        }
                    }
                }}
            />
        </Paper>
    );
}