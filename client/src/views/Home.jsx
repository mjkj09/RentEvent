import React from 'react';
import {Container} from '@mui/material';
import Pattern from '../components/home/Pattern';
import HeroBanner from '../components/home/HeroBanner';
import FeaturesGrid from '../components/home/FeaturesGrid';
import Footer from '../components/common/Footer';

export default function Home() {
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