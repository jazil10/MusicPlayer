const express = require('express');
const cors = require('cors');
const { Client } = require('soundcloud-scraper');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize SoundCloud client
const client = new Client('AXHkknI02RnaQ0vVJ3FK3pVcoToTlmFK');

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchResults = await client.search(query, 'track');
    console.log('First search result:', JSON.stringify(searchResults[0], null, 2));
    
    // Format the results to match our frontend needs
    const formattedResults = searchResults.slice(0, 3).map(track => {
      console.log('Processing track:', track.name);
      console.log('Track data:', JSON.stringify(track, null, 2));
      
      return {
        id: track.url.split('/').pop(), // Extract ID from URL
        title: track.name,
        artist: track.artist,
        thumbnail: `https://i1.sndcdn.com/artworks-${track.url.split('/').pop()}-large.jpg`, // Construct thumbnail URL
        duration: '0:00', // Duration not available in basic response
        url: track.url
      };
    });

    res.json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

// Audio streaming endpoint
app.get('/api/audio/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    console.log(`Audio request received for trackId: ${trackId}`);

    // Get track info using the complete URL
    const trackUrl = decodeURIComponent(trackId);
    console.log('Fetching track info from URL:', trackUrl);
    
    try {
      const track = await client.getSongInfo(trackUrl);
      console.log('Track info:', JSON.stringify(track, null, 2));
      
      // Set appropriate headers for streaming
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');

      // Get the stream
      const stream = await track.downloadProgressive();
      
      // Handle errors
      stream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: 'Failed to stream audio',
            message: 'An error occurred while streaming the audio.'
          });
        }
      });

      // Handle stream end
      stream.on('end', () => {
        console.log('Stream ended successfully');
      });

      // Pipe the stream directly to the response
      stream.pipe(res);
    } catch (trackError) {
      console.error('Error getting track info:', trackError);
      res.status(500).json({ 
        error: 'Failed to get track info',
        message: 'Could not retrieve track information.'
      });
    }
  } catch (error) {
    console.error('Error streaming audio:', error);
    res.status(500).json({ 
      error: 'Failed to stream audio',
      message: 'An error occurred while streaming the audio file.'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});