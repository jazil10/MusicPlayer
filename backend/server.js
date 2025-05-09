const express = require('express');
const cors = require('cors');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

// Audio streaming endpoint
app.get('/api/audio/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const range = req.headers.range;
    console.log(`Audio request received for videoId: ${videoId}, range: ${range}`);

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    
    // Get the best audio format
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    // Set appropriate headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Create the download stream
    const downloadStream = ytdl(videoUrl, { format });
    
    // Handle errors
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Failed to stream audio',
          message: 'An error occurred while streaming the audio.'
        });
      }
    });

    // Pipe the stream directly to the response
    downloadStream.pipe(res);
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

// function checking(){
//     ytdl('https://www.youtube.com/watch?v=erWlHBJLA20')
//   .pipe(fs.createWriteStream('video.mp4'));
//   console.log("checking")
// }

// checking();