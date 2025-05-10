import React, { createContext, useState, useRef, useEffect, useContext } from 'react';

export const PlaybackContext = createContext();

// Custom hook to use the playback context
export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};

const API_URL = 'https://musicbackend-nojm61ic.b4a.run/api';

export const PlaybackProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playHistory, setPlayHistory] = useState([]);

  const audioRef = useRef(new Audio());

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume / 100;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (queue.length > 0) {
        const nextSong = queue[0];
        setQueue(prevQueue => prevQueue.slice(1));
        setCurrentSong(nextSong);
        const audioUrl = nextSong.audioUrl || `${API_URL}/audio/${nextSong.videoId}`;
        audio.src = audioUrl;
        audio.play();
      } else {
        setIsPlaying(false);
        setCurrentSong(null);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue]);

  const playSong = async (song) => {
    try {
      setIsLoading(true);
      console.log('Starting playback for song:', song);
      
      const audio = audioRef.current;
      const audioUrl = song.audioUrl || `${API_URL}/audio/${song.videoId}`;
      console.log('Audio URL:', audioUrl);
      
      audio.src = audioUrl;
      
      try {
        await audio.play();
        console.log('Playback started successfully');
        setCurrentSong(song);
        setIsPlaying(true);
        if (currentSong) {
          setPlayHistory(prev => [currentSong, ...prev]);
        }
      } catch (playError) {
        console.error('Error during playback:', playError);
        setIsPlaying(false);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading song:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const playPauseSong = async (song = null) => {
    console.log('playPauseSong called with:', song);
    
    if (song) {
      if (currentSong?.id === song.id) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error resuming playback:', error);
          }
        }
      } else {
        await playSong(song);
      }
    } else if (currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error resuming playback:', error);
        }
      }
    }
  };

  const nextSong = async () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setQueue(prevQueue => prevQueue.slice(1));
      await playSong(nextSong);
    }
  };

  const prevSong = async () => {
    if (playHistory.length > 0) {
      const prevSong = playHistory[0];
      setPlayHistory(prev => prev.slice(1));
      if (currentSong) {
        setQueue(prevQueue => [currentSong, ...prevQueue]);
      }
      await playSong(prevSong);
    }
  };

  const addToQueue = (song) => {
    setQueue(prevQueue => [...prevQueue, song]);
    if (!currentSong) {
      playSong(song);
    }
  };

  const removeFromQueue = (index) => {
    setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
  };

  const reorderQueue = (newQueue) => {
    setQueue(newQueue);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const seekSong = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const adjustVolume = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
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
        queue,
        isLoading,
        playPauseSong,
        seekSong,
        adjustVolume,
        toggleMute,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        nextSong,
        prevSong,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};
