import React from 'react';

const WaveOverlay = () => {
  return (
    <svg
      viewBox="0 0 1440 320"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 'auto',
        zIndex: -1, 
      }}
    >
      <path
        fill="#FFC3A0"
        fillOpacity="1"
        d="M0,160L48,165.3C96,171,192,181,288,181.3C384,181,480,171,576,149.3C672,128,768,96,864,85.3C960,75,1056,85,1152,106.7C1248,128,1344,160,1392,176L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      ></path>
    </svg>
  );
};

export default WaveOverlay;
