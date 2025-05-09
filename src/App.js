// src/App.js
import React, { useState, useMemo } from 'react';
import getTheme from './theme';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AnimatedGradient from './components/AnimatedGradient';
import WaveOverlay from './components/WaveOverlay';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import Login from './components/Login';
import UploadMusic from './components/UploadMusic';
import MusicLibrary from './components/MusicLibrary';
import PlaybackBar from './components/PlaybackBar';
import Sidebar from './components/Sidebar';
import Search from './components/Search';

import { PlaybackProvider } from './contexts/PlaybackContext';


function App() {
  const [mode, setMode] = useState('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlaybackProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#181818' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, ml: '240px', minHeight: '100vh', position: 'relative' }}>
              <AnimatedGradient />
              <WaveOverlay />
              <ContainerWithScroll>
                <Routes>
                  <Route path="/" element={<MusicLibrary />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/upload" element={<UploadMusic />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
              </ContainerWithScroll>
              <PlaybackBar />
            </Box>
          </Box>
        </Router>
      </PlaybackProvider>
    </ThemeProvider>
  );
}


const ContainerWithScroll = ({ children }) => {
  return (
    <Box
      sx={{
        mt: 8,
        mb: 16, 
        height: 'calc(100vh - 250px)', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          pr: 1, 

          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#1DB954',
            borderRadius: '4px',
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#000000 transparent',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default App;
