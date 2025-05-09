import React, { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import { usePlayback } from '../contexts/PlaybackContext';

const API_URL = 'http://localhost:5000/api';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToQueue, playPauseSong, currentSong } = usePlayback();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const results = await response.json();
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (song) => {
    // If there's no current song, play this one
    if (!currentSong) {
      playPauseSong(song);
    } else {
      // If there is a current song, add this one to queue
      addToQueue(song);
    }
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
              '&:hover': {
                '& > fieldset': { borderColor: 'primary.main' },
              },
            },
          }}
        />
      </form>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {searchResults.map((song) => (
            <ListItem
              key={song.id}
              sx={{
                bgcolor: 'background.paper',
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              secondaryAction={
                <Box>
                  <Tooltip title="Add to Queue">
                    <IconButton
                      edge="end"
                      onClick={() => handleAddToQueue(song)}
                      sx={{ color: 'primary.main', mr: 1 }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Play">
                    <IconButton
                      edge="end"
                      onClick={() => handlePlay(song)}
                      sx={{ color: 'primary.main' }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar src={song.thumbnail} alt={song.title} />
              </ListItemAvatar>
              <ListItemText
                primary={song.title}
                secondary={`${song.artist} • ${song.duration}`}
                primaryTypographyProps={{
                  sx: { fontWeight: 500 },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}

      {!loading && searchResults.length === 0 && searchQuery && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No results found
        </Typography>
      )}
    </Box>
  );
};

export default Search; 