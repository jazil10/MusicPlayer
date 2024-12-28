// src/components/MusicPlayer.js
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const MusicPlayer = ({ song, isPlaying, onPlay, onPause }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80); 
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef(new Audio(song.url));

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(song.url);
    audioRef.current.volume = volume / 100;
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
    setCurrentTime(0);
    setDuration(0);
  }, [song]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      onPause();
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPause]);

  const handleSliderChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
    setIsMuted(newValue === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(50); 
      audioRef.current.volume = 0.5;
      setIsMuted(false);
    } else {
      setVolume(0);
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    }`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={onPause} sx={{ color: '#1DB954' }}>
          <SkipPreviousIcon />
        </IconButton>

        <IconButton onClick={isPlaying ? onPause : onPlay} sx={{ color: '#1DB954', mx: 2 }}>
          {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
        </IconButton>

        <IconButton onClick={onPlay} sx={{ color: '#1DB954' }}>
          <SkipNextIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {formatTime(currentTime)}
        </Typography>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSliderChange}
          sx={{
            color: '#1DB954',
            mx: 2,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {formatTime(duration)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <IconButton onClick={toggleMute} sx={{ color: '#1DB954' }}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          sx={{
            color: '#1DB954',
            width: 100,
            ml: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default MusicPlayer;
