import React from 'react';
import {ThemeProvider, CssBaseline} from "@mui/material";
import {Routes, Route, Navigate} from "react-router-dom";
import theme from './theme/theme';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Home from './views/Home';
import Search from './views/Search';
import CompanySetup from './views/CompanySetup';
import CreateListing from './views/CreateListing';
import VenueDetails from './views/VenueDetails';
import PageLoader from './components/common/PageLoader';
import {AuthProvider} from './contexts/AuthProvider';
import {useAuth} from './hooks/useAuth';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <PageLoader message="Checking authentication..." />;
    }

    return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/auth" element={<Auth/>}/>
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/search" element={
                        <ProtectedRoute>
                            <Search/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/company-setup" element={
                        <ProtectedRoute>
                            <CompanySetup/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/create-listing" element={
                        <ProtectedRoute>
                            <CreateListing/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/venue/:id" element={
                        <ProtectedRoute>
                            <VenueDetails />
                        </ProtectedRoute>
                    }/>
                    <Route path="/requests" element={
                        <ProtectedRoute>
                            <PageLoader message="Loading requests..." />
                        </ProtectedRoute>
                    }/>
                    <Route path="/favourites" element={
                        <ProtectedRoute>
                            <PageLoader message="Loading favourites..." />
                        </ProtectedRoute>
                    }/>
                    <Route path="/my-venues" element={
                        <ProtectedRoute>
                            <PageLoader message="Loading your venues..." />
                        </ProtectedRoute>
                    }/>
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <PageLoader message="Loading profile..." />
                        </ProtectedRoute>
                    }/>
                    <Route path="/venue/:id" element={
                        <ProtectedRoute>
                            <PageLoader message="Loading venue details..." />
                        </ProtectedRoute>
                    }/>
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App;