import React from 'react';
import {Container} from '@mui/material';
import Pattern from '../components/landing/Pattern.jsx';
import HeroBanner from '../components/landing/HeroBanner.jsx';
import FeaturesGrid from '../components/landing/FeaturesGrid.jsx';
import Footer from '../components/common/Footer';

export default function Landing() {
    return (
        <>
            <Pattern/>
            <Container maxWidth="lg" sx={{py: 4, position: 'relative', zIndex: 1}}>
                <HeroBanner/>
                <FeaturesGrid/>
            </Container>
            <Footer/>
        </>
    );
}