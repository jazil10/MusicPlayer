// src/components/PlaybackBar.js
import React, { useContext, useState, useEffect } from 'react';
import { Box, IconButton, Slider, Typography, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { PlaybackContext } from '../contexts/PlaybackContext';

const emojis = ['😃', '😂', '😍', '🥳', '🤩', '😎', '🤪', '🙃', '🤠', '😇', '🦄', '🐱‍👤', '🍕', '🌟', '🚀'];

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
  } = useContext(PlaybackContext);

  const [randomEmoji, setRandomEmoji] = useState('😃');

  useEffect(() => {
    if (currentSong && !currentSong.coverArt) {
      const randomIndex = Math.floor(Math.random() * emojis.length);
      setRandomEmoji(emojis[randomIndex]);
    } else if (!currentSong) {
      setRandomEmoji('😃');
    }
  }, [currentSong]);

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleSeekChange = (event, newValue) => {
    seekSong(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    adjustVolume(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '90%', sm: '80%', md: '60%' },
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: 2, sm: 3 },
        color: '#fff',
        zIndex: 1000, 
      }}
    >
      {/* Song Info */}
      {currentSong && currentSong.coverArt ? (
        <Box
          component="img"
          src={currentSong.coverArt}
          alt={`${currentSong.title} cover art`}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '10px',
            objectFit: 'cover',
            marginRight: { xs: 2, sm: 3 },
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        />
      ) : currentSong ? (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: { xs: 2, sm: 3 },
            fontSize: '2.5rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {randomEmoji}
        </Box>
      ) : (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: { xs: 2, sm: 3 },
            fontSize: '1.5rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography variant="h6" color="rgba(255, 255, 255, 0.7)" textAlign="center">
            Select a song to vibe
          </Typography>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, mr: { xs: 2, sm: 3 } }}>
        {currentSong ? (
          <>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {currentSong.title}
            </Typography>
            <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.8)">
              {currentSong.artist}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption">{formatTime(currentTime)}</Typography>
              <Slider
                value={currentTime}
                max={duration}
                onChange={handleSeekChange}
                sx={{
                  color: '#1DB954',
                  mx: 1,
                  flexGrow: 1,
                }}
              />
              <Typography variant="caption">{formatTime(duration)}</Typography>
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="rgba(255, 255, 255, 0.7)" textAlign="center">
            Select a song to vibe
          </Typography>
        )}
      </Box>

      {/* Playback Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {currentSong ? (
          <IconButton
            onClick={() => playPauseSong()}
            sx={{ color: '#1DB954' }}
            aria-label={isPlaying ? 'Pause Song' : 'Play Song'}
          >
            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
        ) : null}
        {currentSong ? (
          <>
            <IconButton
              onClick={toggleMute}
              sx={{ color: '#1DB954', ml: 2 }}
              aria-label={isMuted ? 'Unmute Volume' : 'Mute Volume'}
            >
              {isMuted ? <VolumeOffIcon fontSize="large" /> : <VolumeUpIcon fontSize="large" />}
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              aria-labelledby="volume-slider"
              sx={{
                color: '#1DB954',
                ml: 1,
                width: 100, 
              }}
            />
          </>
        ) : null}
      </Box>
    </Paper>
  );
};

export default PlaybackBar;
