import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { Link, useLocation } from 'react-router-dom';
import Queue from './Queue';

const navLinks = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Search', icon: <SearchIcon />, path: '/search' },
  { label: 'Your Library', icon: <LibraryMusicIcon />, path: '/library' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: '#121212',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        borderRight: '1px solid #232323',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, letterSpacing: 1 }}>
        <span style={{ color: '#1DB954' }}>●</span> MusicApp
      </Typography>
      <List>
        {navLinks.map((link) => (
          <ListItem
            button={true}
            key={link.label}
            component={Link}
            to={link.path}
            sx={{
              mb: 1,
              borderRadius: 2,
              bgcolor: location.pathname === link.path ? '#232323' : 'transparent',
              color: location.pathname === link.path ? '#1DB954' : '#fff',
              '&:hover': {
                bgcolor: '#232323',
                color: '#1DB954',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 4, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ color: '#b3b3b3', mb: 1, display: 'flex', alignItems: 'center' }}>
          <QueueMusicIcon sx={{ mr: 1 }} /> Queue
        </Typography>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Queue />
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar; 