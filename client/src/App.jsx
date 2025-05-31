import React from 'react';
import {ThemeProvider, CssBaseline} from "@mui/material";
import {Routes, Route} from "react-router-dom";
import theme from './theme/theme';
import Landing from './views/Landing';
import Auth from './views/Auth';
import {AuthProvider} from './contexts/AuthProvider';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/auth" element={<Auth/>}/>
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default App;