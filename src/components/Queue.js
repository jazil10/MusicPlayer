import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePlayback } from '../contexts/PlaybackContext';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Queue = () => {
  const { 
    queue, 
    removeFromQueue, 
    currentSong, 
    isLoading, 
    error,
    playPauseSong 
  } = usePlayback();

  const handleQueueItemClick = (song) => {
    playPauseSong(song);
  };

  if (error) {
    return (
      <Box sx={{ p: 1 }}>
        <Alert severity="error" sx={{ fontSize: '0.75rem' }}>{error}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (queue.length === 0 && !currentSong) {
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: '0.75rem' }}>
          Queue is empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {currentSong && (
        <>
          <Typography variant="subtitle2" sx={{ color: '#b3b3b3', px: 1, py: 0.5, fontSize: '0.75rem' }}>
            Now Playing
          </Typography>
          <ListItem
            sx={{
              bgcolor: 'action.selected',
              borderRadius: 1,
              mb: 1,
              py: 0.5,
              px: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
            onClick={() => handleQueueItemClick(currentSong)}
          >
            <ListItemAvatar>
              {currentSong.thumbnail ? (
                <Avatar src={currentSong.thumbnail} alt={currentSong.title} sx={{ width: 40, height: 40 }} />
              ) : (
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#232323', color: '#1DB954' }}>
                  {currentSong.title && currentSong.title.length > 0 ? currentSong.title[0].toUpperCase() : <MusicNoteIcon />}
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={currentSong.title}
              secondary={currentSong.artist}
              primaryTypographyProps={{
                sx: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.2 },
              }}
              secondaryTypographyProps={{
                sx: { fontSize: '0.7rem', lineHeight: 1.2 },
              }}
            />
          </ListItem>
        </>
      )}

      {queue.length > 0 && (
        <>
          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="subtitle2" sx={{ color: '#b3b3b3', px: 1, py: 0.5, fontSize: '0.75rem' }}>
            Up Next
          </Typography>
          <List sx={{ width: '100%', p: 0 }}>
            {queue.map((song, index) => (
              <ListItem
                key={song.id || index}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  py: 0.5,
                  px: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }}
                onClick={() => handleQueueItemClick(song)}
              >
                <ListItemAvatar>
                  {song.thumbnail ? (
                    <Avatar src={song.thumbnail} alt={song.title} sx={{ width: 40, height: 40 }} />
                  ) : (
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#232323', color: '#1DB954' }}>
                      {song.title && song.title.length > 0 ? song.title[0].toUpperCase() : <MusicNoteIcon />}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={song.title}
                  secondary={song.artist}
                  primaryTypographyProps={{
                    sx: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.2 },
                  }}
                  secondaryTypographyProps={{
                    sx: { fontSize: '0.7rem', lineHeight: 1.2 },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(index);
                  }}
                  sx={{ color: '#b3b3b3', '&:hover': { color: '#fff' } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default Queue; 