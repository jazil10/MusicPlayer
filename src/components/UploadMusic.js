import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UploadMusic = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!file) {
      setError('Please select a music file to upload.');
      return;
    }

    const storageRef = ref(storage, `music/${auth.currentUser.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setError(error.message);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'music'), {
            title,
            artist,
            url: downloadURL,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            likes: 0,
          });
          setSuccess('Music uploaded successfully!');
          setFile(null);
          setTitle('');
          setArtist('');
          setUploadProgress(0);
        } catch (err) {
          setError(err.message);
        }
      }
    );
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upload Music
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleUpload}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
          <TextField
            label="Artist"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
          />
          <Button
            variant="contained"
            component="label"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Select Music File
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              Selected File: {file.name}
            </Typography>
          )}
          {uploadProgress > 0 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" align="center">
                {Math.round(uploadProgress)}%
              </Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Upload
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UploadMusic;
