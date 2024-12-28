// src/theme.js
import { createTheme } from '@mui/material/styles';

// Function to generate theme based on mode
const getTheme = (mode) =>
  createTheme({
    palette: {
        mode,
        primary: {
          main: mode === 'light' ? '#1DB954' : '#1DB954', 
        },
        secondary: {
          main: mode === 'light' ? '#191414' : '#191414', 
        },
        background: {
          default: mode === 'light' ? '#FFFFFF' : '#121212', 
          paper: mode === 'light' ? '#F8F9FA' : '#181818', 
        },
        text: {
          primary: mode === 'light' ? '#191414' : '#FFFFFF',
          secondary: mode === 'light' ? '#535353' : '#B3B3B3',
        },
    },
    typography: {
      fontFamily: 'Nunito, sans-serif',
      h1: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '2.5rem',
      },
      h2: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
      },
      button: {
        fontFamily: 'Poppins, sans-serif',
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12, 
    },
    components: {
      MuiSlider: {
        styleOverrides: {
          root: {
            color: '#1DB954',
          },
        },
      },
    },
  });

export default getTheme;
