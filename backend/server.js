const express = require('express');
const cors = require('cors');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Range']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchResults = await ytSearch(query);
    
    // Format the results to match our frontend needs
    const formattedResults = searchResults.videos.slice(0, 3).map(video => ({
      id: video.videoId,
      title: video.title,
      artist: video.author.name,
      thumbnail: video.thumbnail,
      videoId: video.videoId,
      duration: video.duration.timestamp
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Failed to search videos',
      message: error.message 
    });
  }
});

// Audio streaming endpoint
app.get('/api/audio/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Get video info with timeout
    const info = await Promise.race([
      ytdl.getInfo(videoUrl),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout getting video info')), 10000)
      )
    ]);
    
    // Get the best audio format
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    if (!format) {
      return res.status(404).json({ error: 'No suitable audio format found' });
    }

    // Set appropriate headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Create the download stream with timeout
    const downloadStream = ytdl(videoUrl, { 
      format,
      requestOptions: {
        timeout: 10000
      }
    });
    
    // Handle errors
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Failed to stream audio',
          message: error.message
        });
      }
    });

    // Handle successful streaming
    downloadStream.on('end', () => {
      console.log('Stream completed successfully');
    });

    // Pipe the stream directly to the response
    downloadStream.pipe(res);

    // Handle client disconnect
    req.on('close', () => {
      downloadStream.destroy();
    });

  } catch (error) {
    console.error('Error streaming audio:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to stream audio',
        message: error.message
      });
    }
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export the Express API
module.exports = app;

// function checking(){
//     ytdl('https://www.youtube.com/watch?v=erWlHBJLA20')
//   .pipe(fs.createWriteStream('video.mp4'));
//   console.log("checking")
// }

// checking();