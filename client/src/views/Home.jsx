import React from 'react';
import { Box } from '@mui/material';
import NavBar from '../components/common/NavBar';
import HeroSearch from '../components/home/HeroSearch';
import CategoriesSection from '../components/home/CategoriesSection';
import PopularVenues from '../components/home/PopularVenues';
import CreateListingHero from '../components/home/CreateListingHero';
import Footer from '../components/common/Footer';

export default function Home() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <Box sx={{ flex: 1 }}>
                <HeroSearch />
                <CategoriesSection />
                <PopularVenues />
                <CreateListingHero />
            </Box>
            <Footer />
        </Box>
    );
}