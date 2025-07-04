import React from 'react';
import {
    Grid,
    Box,
    Typography,
    Paper
} from '@mui/material';
import { SearchOff } from '@mui/icons-material';
import VenueCard from '../common/VenueCard';

export default function SearchResults({ venues, favorites, onToggleFavorite, onVenueClick, isAuthenticated }) {
    if (!venues || venues.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 8,
                    textAlign: 'center',
                    backgroundColor: 'background.default',
                    borderRadius: 3
                }}
            >
                <SearchOff sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="text.primary" gutterBottom>
                    No venues found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Try adjusting your filters or search terms to find more venues.
                </Typography>
            </Paper>
        );
    }

    return (
        <Grid container spacing={3}>
            {venues.map((venue) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={venue._id || venue.id}>
                    <VenueCard
                        venue={venue}
                        isFavorite={favorites.includes(venue._id || venue.id)}
                        onToggleFavorite={() => onToggleFavorite(venue._id || venue.id)}
                        onViewDetails={() => onVenueClick(venue._id || venue.id)}
                        isAuthenticated={isAuthenticated}
                    />
                </Grid>
            ))}
        </Grid>
    );
}