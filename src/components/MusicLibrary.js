// src/components/MusicLibrary.js
import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Box,
  Typography,
  Divider,
  Paper,
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

const emojis = ['😃', '😂', '😍', '🥳', '🤩', '😎', '🤪', '🙃', '🤠', '😇', '🦄', '🐱‍👤', '🍕', '🌟', '🚀'];

const formatTime = (time) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

const MusicLibrary = () => {
  const [musicList, setMusicList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { playPauseSong } = useContext(PlaybackContext);

  const [songDurations, setSongDurations] = useState({});

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

  useEffect(() => {
    musicList.forEach((music) => {
      if (!songDurations[music.id] && music.url) {
        const audio = new Audio();
        audio.src = music.url;
        audio.addEventListener('loadedmetadata', () => {
          setSongDurations((prev) => ({
            ...prev,
            [music.id]: audio.duration,
          }));
        });
        audio.addEventListener('error', (e) => {
          console.error(`Error loading audio for ${music.title}:`, e);
          setSongDurations((prev) => ({
            ...prev,
            [music.id]: 0, 
          }));
        });
      }
    });
  }, [musicList, songDurations]);

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', 
      }}
    >

      <PlaybackBar />
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search by Title or Artist"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            style: { color: '#fff' },
          }}
          InputLabelProps={{
            style: { color: '#fff' },
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#1DB954',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1DB954',
              },
            },
          }}
        />
      </Box>

      {/* Music List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          pr: 1,
        }}
      >
        <List
          sx={{
            width: '100%',
            bgcolor: 'transparent',
          }}
        >
          {musicList.map((music, index) => (
            <React.Fragment key={music.id}>
              <Paper
                elevation={2}
                sx={{
                  mb: 2,
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, background 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => playPauseSong(music)}
              >
                <ListItem alignItems="center">
                  <ListItemAvatar>
                    {music.coverArt ? (
                      <Avatar
                        variant="rounded"
                        src={music.coverArt}
                        alt={`${music.title} cover art`}
                        sx={{ width: 80, height: 80, mr: 3 }}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 80,
                          height: 80,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          fontSize: 40,
                          mr: 3,
                        }}
                      >
                        {emojis[Math.floor(Math.random() * emojis.length)]}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: '#fff' }}>
                        {music.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.8)">
                        {music.artist}
                      </Typography>
                    }
                  />
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                    {songDurations[music.id] ? formatTime(songDurations[music.id]) : 'Loading...'}
                  </Typography>
                </ListItem>
              </Paper>
              {index < musicList.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default MusicLibrary;
