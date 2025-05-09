// src/components/MusicLibrary.js
import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  TextField,
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { PlaybackContext } from '../contexts/PlaybackContext';
import PlaybackBar from './PlaybackBar';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const MusicLibrary = () => {
  const [musicList, setMusicList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { playPauseSong } = useContext(PlaybackContext);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    let qTitle, qArtist;
    let unsubscribeTitle, unsubscribeArtist;

    if (debouncedSearchTerm) {
      const searchTermLower = debouncedSearchTerm.toLowerCase();

      qTitle = query(
        collection(db, 'music'),
        where('title_lowercase', '>=', searchTermLower),
        where('title_lowercase', '<=', searchTermLower + '\uf8ff'),
        orderBy('title_lowercase')
      );

      qArtist = query(
        collection(db, 'music'),
        where('artist_lowercase', '>=', searchTermLower),
        where('artist_lowercase', '<=', searchTermLower + '\uf8ff'),
        orderBy('artist_lowercase')
      );

      unsubscribeTitle = onSnapshot(
        qTitle,
        (querySnapshot) => {
          const musicsTitle = [];
          querySnapshot.forEach((doc) => {
            musicsTitle.push({ id: doc.id, ...doc.data() });
          });
          setMusicList((prevMusics) => {
            const merged = [...prevMusics, ...musicsTitle];
            const uniqueMusics = Array.from(new Map(merged.map((item) => [item.id, item])).values());
            return uniqueMusics;
          });
        },
        (error) => {
          console.error('Firestore snapshot listener error (title):', error);
        }
      );

      unsubscribeArtist = onSnapshot(
        qArtist,
        (querySnapshot) => {
          const musicsArtist = [];
          querySnapshot.forEach((doc) => {
            musicsArtist.push({ id: doc.id, ...doc.data() });
          });
          setMusicList((prevMusics) => {
            const merged = [...prevMusics, ...musicsArtist];
            const uniqueMusics = Array.from(new Map(merged.map((item) => [item.id, item])).values());
            return uniqueMusics;
          });
        },
        (error) => {
          console.error('Firestore snapshot listener error (artist):', error);
        }
      );
    } else {
      const q = query(collection(db, 'music'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const musics = [];
          querySnapshot.forEach((doc) => {
            musics.push({ id: doc.id, ...doc.data() });
          });
          setMusicList(musics);
        },
        (error) => {
          console.error('Firestore snapshot listener error:', error);
        }
      );

      return () => unsubscribe();
    }

    // Cleanup listeners on unmount or searchTerm change
    return () => {
      if (unsubscribeTitle) unsubscribeTitle();
      if (unsubscribeArtist) unsubscribeArtist();
    };
  }, [debouncedSearchTerm]);

  const handlePlay = (music) => {
    console.log('Raw music data:', music);
    
    // Create a song object with the required format
    const song = {
      id: music.id,
      title: music.title,
      artist: music.artist,
      videoId: music.id, // Use the document ID as videoId
      audioUrl: music.url, // Include the Firebase storage URL
      duration: music.duration,
      thumbnail: music.coverArt || music.url // Use coverArt if available, otherwise use the audio URL
    };
    
    console.log('Formatted song for playback:', song);
    playPauseSong(song);
    setCurrentlyPlayingId(song.id);
  };

  return (
    <Box sx={{ p: 0, minHeight: '100vh', bgcolor: '#181818' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 4, p: 4, pb: 2 }}>
        <Box
          sx={{
            width: 180,
            height: 180,
            bgcolor: '#282828',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 3,
          }}
        >
          <MusicNoteIcon sx={{ fontSize: 80, color: '#b3b3b3' }} />
        </Box>
        <Box>
          <Typography variant="overline" sx={{ color: '#fff', opacity: 0.7 }}>
            PLAYLIST
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1 }}>
            Liked Songs
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b3b3b3', mt: 1 }}>
            Your Profile • {musicList.length} songs
          </Typography>
        </Box>
      </Box>

      {/* Play Button */}
      <Box sx={{ pl: 4, pt: 2 }}>
        <PlayCircleFilledWhiteIcon sx={{ fontSize: 64, color: '#1DB954', cursor: 'pointer', transition: 'transform 0.1s', '&:hover': { transform: 'scale(1.08)' } }} />
      </Box>

      {/* Song Table */}
      <Box sx={{ p: 4, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#b3b3b3', fontWeight: 700, fontSize: 14, pb: 1, borderBottom: '1px solid #232323' }}>
          <Box sx={{ width: 32, mr: 2 }}>#</Box>
          <Box sx={{ flex: 2 }}>TITLE</Box>
          <Box sx={{ flex: 1 }}>ARTIST</Box>
          <Box sx={{ flex: 1 }}>DATE ADDED</Box>
          <Box sx={{ width: 48, textAlign: 'right' }}>
            <span role="img" aria-label="duration">⏱️</span>
          </Box>
        </Box>
        {musicList.map((music, idx) => (
          <Box
            key={music.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.5,
              px: 1,
              borderRadius: 1,
              mt: 1,
              bgcolor: currentlyPlayingId === music.id ? 'rgba(29,185,84,0.2)' : 'transparent',
              color: currentlyPlayingId === music.id ? '#1DB954' : '#fff',
              fontWeight: currentlyPlayingId === music.id ? 700 : 400,
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
            onClick={() => handlePlay(music)}
          >
            <Box sx={{ width: 32, mr: 2 }}>{idx + 1}</Box>
            <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {music.coverArt ? (
                <Box
                  component="img"
                  src={music.coverArt}
                  alt={music.title}
                  sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', mr: 2, boxShadow: 1 }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#232323',
                    color: '#1DB954',
                    fontWeight: 700,
                    fontSize: 22,
                    mr: 2,
                  }}
                >
                  {music.title && music.title.length > 0 ? music.title[0].toUpperCase() : <MusicNoteIcon fontSize="small" />}
                </Avatar>
              )}
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'inherit', fontWeight: 700, fontSize: 16 }}>
                  {music.title}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>{music.artist || '-'}</Box>
            <Box sx={{ flex: 1 }}>{music.createdAt ? new Date(music.createdAt.seconds * 1000).toLocaleDateString() : '-'}</Box>
            <Box sx={{ width: 48, textAlign: 'right' }}>{music.duration ? `${Math.floor(music.duration / 60)}:${String(Math.floor(music.duration % 60)).padStart(2, '0')}` : '--:--'}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MusicLibrary;
