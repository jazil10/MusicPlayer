// server.js

const express = require('express');
const cors = require('cors');
const { Client } = require('soundcloud-scraper');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize SoundCloud client (or use process.env.SOUNDCLOUD_CLIENT_ID)
const client = new Client(process.env.SOUNDCLOUD_CLIENT_ID || 'AXHkknI02RnaQ0vVJ3FK3pVcoToTlmFK');

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await client.search(query, 'track');
    const formatted = results.slice(0, 3).map(track => ({
      id: encodeURIComponent(track.url),             // full URL, URL-encoded
      title: track.name,
      artist: track.artist,
      thumbnail: track.thumbnail,
      duration: formatDuration(track.duration),
      url: track.url
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

// Audio streaming endpoint
app.get('/api/audio/:trackId', async (req, res) => {
  try {
    const trackUrl = decodeURIComponent(req.params.trackId);
    console.log(`Fetching track info from: ${trackUrl}`);

    const track = await client.getSongInfo(trackUrl);
    
    // The scraper may expose streams under `.streams` or `.track`
    const streams = track.streams || track.track;
    const progURL = streams?.progressive;
    const hlsURL  = streams?.hls;
    
    // For seeking functionality, we need to properly handle range requests
    const rangeHeader = req.headers.range;
    let stream;
    
    // First, let's determine which download method to use
    if (progURL && progURL.includes('/hls')) {
      console.log('Progressive URL is HLS; falling back to HLS download');
      stream = await track.downloadHLS();
    } else {
      console.log('Using progressive download');
      stream = await track.downloadProgressive();
    }
    
    // Set the proper headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Create an empty buffer to hold the audio data
    let audioBuffer = Buffer.alloc(0);
    let totalLength = 0;
    
    // Use event-based approach to first collect the entire audio
    stream.on('data', chunk => {
      audioBuffer = Buffer.concat([audioBuffer, chunk]);
      totalLength += chunk.length;
    });
    
    stream.on('end', () => {
      console.log('Stream data fully loaded, total size:', totalLength);
      
      // Now handle range requests if present
      if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1;
        
        // Calculate the chunk length and set content-range header
        const chunkLength = (end - start) + 1;
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${totalLength}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkLength,
          'Content-Type': 'audio/mpeg',
        };
        
        // Send partial content status
        res.writeHead(206, headers);
        
        // Send the specific range of bytes requested
        const slicedBuffer = audioBuffer.slice(start, end + 1);
        res.end(slicedBuffer);
        
        console.log(`Served range request: bytes ${start}-${end}/${totalLength}`);
      } else {
        // No range header, serve the entire file
        res.writeHead(200, {
          'Content-Length': totalLength,
          'Content-Type': 'audio/mpeg',
        });
        res.end(audioBuffer);
        console.log('Served entire audio file');
      }
    });
    
    stream.on('error', err => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to stream audio',
          message: 'An error occurred while streaming.'
        });
      }
    });
    
    req.on('close', () => {
      if (!res.finished) {
        console.log('Client disconnected; destroying stream');
        stream.destroy();
      }
    });

  } catch (err) {
    console.error('Audio endpoint error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to stream audio',
        message: 'An unexpected error occurred.'
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Helper: convert ms → m:ss
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
