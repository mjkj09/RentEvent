import React from 'react';
import {ThemeProvider, CssBaseline} from "@mui/material";
import {Routes, Route, Navigate} from "react-router-dom";
import theme from './theme/theme';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Home from './views/Home';
import {AuthProvider} from './contexts/AuthProvider';
import {useAuth} from './hooks/useAuth';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
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
                            <div>Search Page - To be implemented</div>
                        </ProtectedRoute>
                    }/>
                    <Route path="/requests" element={
                        <ProtectedRoute>
                            <div>Requests Page - To be implemented</div>
                        </ProtectedRoute>
                    }/>
                    <Route path="/favourites" element={
                        <ProtectedRoute>
                            <div>Favourites Page - To be implemented</div>
                        </ProtectedRoute>
                    }/>
                    <Route path="/my-venues" element={
                        <ProtectedRoute>
                            <div>My Venues Page - To be implemented</div>
                        </ProtectedRoute>
                    }/>
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <div>Profile Page - To be implemented</div>
                        </ProtectedRoute>
                    }/>
                    <Route path="/venue/:id" element={
                        <ProtectedRoute>
                            <div>Venue Details Page - To be implemented</div>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App;