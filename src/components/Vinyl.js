import React from 'react';
import { Box } from '@mui/material';

const Vinyl = ({ coverArt, size = 80 }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        animation: 'spin 3s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #000, #333)',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {coverArt ? (
          <Box
            component="img"
            src={coverArt}
            alt="Cover Art"
            sx={{
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              background: '#1DB954',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Vinyl; 