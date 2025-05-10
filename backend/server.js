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
    console.log('Track info:', JSON.stringify(track, null, 2));

    // Prepare response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');

    // The scraper may expose streams under `.streams` or `.track`
    const streams = track.streams || track.track;
    const progURL = streams?.progressive;
    const hlsURL  = streams?.hls;

    let stream;
    if (progURL && progURL.includes('/hls')) {
      console.log('Progressive URL is HLS; falling back to HLS download');
      stream = await track.downloadHLS();
    } else {
      console.log('Using progressive download');
      stream = await track.downloadProgressive();
    }

    // Pipe with back-pressure
    stream.on('data', chunk => {
      if (!res.write(chunk)) {
        stream.pause();
      }
    });
    res.on('drain', () => stream.resume());

    stream.on('end', () => {
      console.log('Stream ended');
      res.end();
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
      console.log('Client disconnected; destroying stream');
      stream.destroy();
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
