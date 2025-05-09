// src/components/PlaybackBar.js
import React, { useContext } from 'react';
import { Box, IconButton, Slider, Typography, Paper, Avatar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { PlaybackContext } from '../contexts/PlaybackContext';

const PlaybackBar = () => {
  const {
    currentSong,
    isPlaying,
    playPauseSong,
    currentTime,
    duration,
    volume,
    isMuted,
    seekSong,
    toggleMute,
    adjustVolume,
    nextSong,
    prevSong,
  } = useContext(PlaybackContext);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100vw',
        minHeight: 80,
        bgcolor: '#181818',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        zIndex: 1300,
        boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.7)',
      }}
    >
      {/* Song Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
        {currentSong ? (
          currentSong.thumbnail ? (
            <Avatar src={currentSong.thumbnail} alt={currentSong.title} sx={{ width: 56, height: 56, mr: 2 }} />
          ) : (
            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#232323', color: '#1DB954', fontWeight: 700, fontSize: 28 }}>
              {currentSong.title && currentSong.title.length > 0 ? currentSong.title[0].toUpperCase() : <MusicNoteIcon fontSize="large" />}
            </Avatar>
          )
        ) : (
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: '#232323', color: '#b3b3b3' }}>
            <MusicNoteIcon fontSize="large" />
          </Avatar>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
            {currentSong ? currentSong.title : 'No song selected'}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: '#b3b3b3', fontSize: 13 }}>
            {currentSong ? currentSong.artist : ''}
          </Typography>
        </Box>
      </Box>

      {/* Playback Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            sx={{ color: '#b3b3b3', '&:hover': { color: '#fff' } }} 
            onClick={prevSong}
            disabled={!currentSong}
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={() => playPauseSong()}
            sx={{ 
              color: '#fff', 
              bgcolor: '#1DB954', 
              mx: 1, 
              '&:hover': { bgcolor: '#1ed760' }, 
              width: 48, 
              height: 48 
            }}
            disabled={!currentSong}
          >
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
          <IconButton 
            sx={{ color: '#b3b3b3', '&:hover': { color: '#fff' } }} 
            onClick={nextSong}
            disabled={!currentSong}
          >
            <SkipNextIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#b3b3b3', minWidth: 40 }}>{formatTime(currentTime)}</Typography>
          <Slider
            value={currentTime}
            min={0}
            max={duration || 1}
            onChange={(_, v) => seekSong(v)}
            sx={{ color: '#1DB954', mx: 1, flex: 1 }}
            disabled={!currentSong}
          />
          <Typography variant="caption" sx={{ color: '#b3b3b3', minWidth: 40 }}>{formatTime(duration)}</Typography>
        </Box>
      </Box>

      {/* Volume Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <IconButton onClick={toggleMute} sx={{ color: '#b3b3b3', mr: 1 }}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <Slider
          value={volume}
          onChange={(_, v) => adjustVolume(v)}
          min={0}
          max={100}
          sx={{ color: '#1DB954', width: 100 }}
        />
      </Box>
    </Paper>
  );
};

export default PlaybackBar;
