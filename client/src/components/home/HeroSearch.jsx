import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    Chip
} from '@mui/material';
import {
    Search,
    LocationOn,
    KeyboardArrowDown
} from '@mui/icons-material';

export default function HeroSearch() {
    const [searchValue, setSearchValue] = useState('');
    const [locationAnchor, setLocationAnchor] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('Krakow');

    const locations = ['Krakow', 'Warsaw', 'Wroclaw', 'Gdansk', 'Poznan', 'All Poland'];

    const handleLocationClick = (event) => {
        setLocationAnchor(event.currentTarget);
    };

    const handleLocationClose = () => {
        setLocationAnchor(null);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        handleLocationClose();
    };

    const handleSearch = () => {
        console.log('Searching for:', searchValue, 'in', selectedLocation);
        // TODO: Implement search functionality
    };

    return (
        <Box
            sx={{
                position: 'relative',
                backgroundImage: `url('/home/heroSearchBar.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: { xs: '400px', md: '500px' },
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(43, 41, 61, 0.5)',
                    zIndex: 1
                }
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ textAlign: 'center', color: 'white', mb: {xs: 5, md: 10}, mt: {xs: 5, md: 0}}}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        Find the perfect venue for your next event - anytime, anywhere!
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'secondary.main',
                            fontWeight: 600,
                            fontSize: { xs: '1.5rem', md: '2rem' }
                        }}
                    >
                        Book. Host. Celebrate.
                    </Typography>
                </Box>

                <Box
                    elevation={48}
                    sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: {xs: 5, md: 0},
                        backgroundColor: 'white',
                        borderRadius: 3,
                        p: 1,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 1,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Search Venues, Categories, Location..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: 'none',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: { xs: '100%', md: 'auto' } }}>
                        <IconButton
                            onClick={handleLocationClick}
                            sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
                            <Typography variant="body1" sx={{ color: 'text.primary' }}>
                                {selectedLocation}
                            </Typography>
                            <KeyboardArrowDown sx={{ ml: 1, color: 'text.secondary' }} />
                        </IconButton>

                        <Menu
                            anchorEl={locationAnchor}
                            open={Boolean(locationAnchor)}
                            onClose={handleLocationClose}
                        >
                            {locations.map((location) => (
                                <MenuItem
                                    key={location}
                                    onClick={() => handleLocationSelect(location)}
                                    selected={location === selectedLocation}
                                >
                                    {location}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleSearch}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            minWidth: { xs: '100%', md: '120px' }
                        }}
                    >
                        Search
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}