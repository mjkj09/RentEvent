import React from 'react';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import theme from './theme/theme';
import Home from './views/Home';
import Auth from './views/Auth';

function App() {
  return (
      <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/auth" element={<Auth/>}/>
          </Routes>
      </ThemeProvider>
  )
}

export default App;