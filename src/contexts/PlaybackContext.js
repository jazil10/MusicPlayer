import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80); 
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentSong(null);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []); 

  const playPauseSong = (song = null) => {
    const audio = audioRef.current;

    if (song) {
      if (currentSong && currentSong.id === song.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
          setIsPlaying(true);
        }
      } else {
        audio.pause();
        audio.src = song.url;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setCurrentSong(song);
        setIsPlaying(true);
      }
    } else {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  const pauseSong = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };

  const resumeSong = () => {
    const audio = audioRef.current;
    audio.play().catch((error) => {
      console.error('Error resuming audio:', error);
    });
    setIsPlaying(true);
  };

  const stopSong = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
  };

  const seekSong = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const adjustVolume = (newVolume) => {
    const audio = audioRef.current;
    audio.volume = newVolume / 100;
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
      audio.muted = true;
    } else {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playPauseSong,
        pauseSong,
        resumeSong,
        stopSong,
        seekSong,
        toggleMute,
        adjustVolume,
        audioRef,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};
