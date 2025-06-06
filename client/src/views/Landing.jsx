// client/src/views/Landing.jsx
import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Pattern from '../components/landing/Pattern.jsx';
import HeroBanner from '../components/landing/HeroBanner.jsx';
import FeaturesGrid from '../components/landing/FeaturesGrid.jsx';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';

export default function Landing() {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/home');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return <PageLoader message="Loading..." />;
    }

    // Don't redirect immediately - show the landing page for unauthenticated users
    if (isAuthenticated) {
        return null; // Will redirect in useEffect
    }

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