import React from 'react';
import {Grid} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StarRateIcon from '@mui/icons-material/StarRate';
import FeatureCard from './FeatureCard';

export default function FeaturesGrid() {
    const features = [
        {
            icon: <StorefrontIcon fontSize="large" color="primary"/>,
            title: "Venue Discovery",
            description: "Browse and reserve perfect venues by location"
        },
        {
            icon: <AccountCircleIcon fontSize="large" color="primary"/>,
            title: "Owner & Renter Accounts",
            description: "Sign up as an Owner or Renter - and upgrade your account at any time"
        },
        {
            icon: <EventAvailableIcon fontSize="large" color="primary"/>,
            title: "Availability & Booking",
            description: "Owners mark dates as available or booked, Renters send reservation requests"
        },
        {
            icon: <StarRateIcon fontSize="large" color="primary"/>,
            title: "Favorites & Reviews",
            description: "Save your favorite venues and share feedback"
        }
    ];

    return (
        <Grid container spacing={4} sx={{mb: 4}}>
            {features.map((feature, index) => (
                <Grid item key={index} size={{xs: 12, sm: 6, md: 3}}>
                    <FeatureCard {...feature} />
                </Grid>
            ))}
        </Grid>
    );
}