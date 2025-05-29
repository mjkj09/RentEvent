import React from 'react';
import {Box, Typography, TextField, InputAdornment} from '@mui/material';

export default function FormField({
                                      label,
                                      startIcon,
                                      endIcon,
                                      sx = {},
                                      ...textFieldProps
                                  }) {
    return (
        <Box sx={{mb: 3, ...sx}}>
            <Typography variant="body2" sx={{mb: 1, fontWeight: 500}}>
                {label}
            </Typography>
            <TextField
                fullWidth
                slotProps={{
                    input: {
                        startAdornment: startIcon && (
                            <InputAdornment position="start">
                                {startIcon}
                            </InputAdornment>
                        ),
                        endAdornment: endIcon && (
                            <InputAdornment position="end">
                                {endIcon}
                            </InputAdornment>
                        ),
                    }
                }}
                {...textFieldProps}
            />
        </Box>
    );
}