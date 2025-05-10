const express = require('express');
const cors = require('cors');
const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const agent = ytdl.createAgent([
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.875094,
      "hostOnly": false,
      "httpOnly": false,
      "name": "__Secure-1PAPISID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "rCJhSRz6nUJgJC0f/A5GObxNlrj-8XrghT",
      "id": 1
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.875282,
      "hostOnly": false,
      "httpOnly": true,
      "name": "__Secure-1PSID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "g.a000wwg47I6_d6SPQGXFbRMZI7oWrUWfHURK-u8hdk1dqJWOqD_t4qTZ-CJvcmMH8fZLiwjhlwACgYKAfISARUSFQHGX2MiBoCd-VVYuofHxeXd5TvZ8RoVAUF8yKq5bnyuMyB5Db6vZENAY7lH0076",
      "id": 2
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1778418732.067765,
      "hostOnly": false,
      "httpOnly": true,
      "name": "__Secure-1PSIDCC",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "AKEyXzW-Wgp0Iol_wven4ZRFt_xblY4nHD6nMEkRWs-TVLwY2nQP1mxHAsdB-p3r2UBvX-ufJjY",
      "id": 3
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1778418648.874618,
      "hostOnly": false,
      "httpOnly": true,
      "name": "__Secure-1PSIDTS",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "sidts-CjEBjplskL9MrWi12PYWGa84QADR3TtJ50i5lNF8Fn47ej79APZYVolVYCpNafMATyZWEAA",
      "id": 4
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.875156,
      "hostOnly": false,
      "httpOnly": false,
      "name": "__Secure-3PAPISID",
      "path": "/",
      "sameSite": "no_restriction",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "rCJhSRz6nUJgJC0f/A5GObxNlrj-8XrghT",
      "id": 5
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.875346,
      "hostOnly": false,
      "httpOnly": true,
      "name": "__Secure-3PSID",
      "path": "/",
      "sameSite": "no_restriction",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "g.a000wwg47I6_d6SPQGXFbRMZI7oWrUWfHURK-u8hdk1dqJWOqD_tTQER2S0nuSUQu-vqn0tjGwACgYKAZMSARUSFQHGX2MiKAHp1sqaHmaLPV0yGaT5lhoVAUF8yKp0SJ9EkI_guvFS2aiE5kJr0076",
      "id": 6
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1778418732.067953,
      "hostOnly": false,
      "httpOnly": true,
      "name": "__Secure-3PSIDCC",
      "path": "/",
      "sameSite": "no_restriction",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "AKEyXzVubdgtrWoUAYhG8FmOkBA0uqOrZyn0jwEWTn8zAIBXwvLHNHIMgeeeujJT_GmWsEWJCg",
      "id": 7
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1778418648.874767,
      "hostOnly": false,
      "httpOnly": true,
      "name": "__Secure-3PSIDTS",
      "path": "/",
      "sameSite": "no_restriction",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "sidts-CjEBjplskL9MrWi12PYWGa84QADR3TtJ50i5lNF8Fn47ej79APZYVolVYCpNafMATyZWEAA",
      "id": 8
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.874967,
      "hostOnly": false,
      "httpOnly": false,
      "name": "APISID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": false,
      "session": false,
      "storeId": "0",
      "value": "IrojqrrIloA6zQMA/AovPW-P946sFWsYfr",
      "id": 9
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.874845,
      "hostOnly": false,
      "httpOnly": true,
      "name": "HSID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": false,
      "session": false,
      "storeId": "0",
      "value": "Am_2REFA1l7LiidRL",
      "id": 10
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442649.551321,
      "hostOnly": false,
      "httpOnly": true,
      "name": "LOGIN_INFO",
      "path": "/",
      "sameSite": "no_restriction",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "AFmmF2swRQIgKsSRz1EHmY16RUQfmQERGtzPdN5SkD_8tRS6YQdYmp0CIQCgeoI9mPoqdiStkURSYuw1Q3i3NXHvzQNYWc0k6Q7fcw:QUQ3MjNmelhoWXpRNU4tZU92dUV6cVRramlBclRxQjhpOGZRbFh6dlhnU05YQjhsM1g3NFZxaWJDY0N0d1JNMmJqSVRMRURuT0kxc0V0ZFVka3hiNFlIcms2VTAwc1RGdUxXWVJFTDMxak9lV0hMWHhuaFFoVC1TY2NLUUdOMV9md3J3Z195YkhJN2h5MVNHNk1zQ0RySFpaQU5TbUpVa1hB",
      "id": 11
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442663.784564,
      "hostOnly": false,
      "httpOnly": false,
      "name": "PREF",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "tz=Asia.Karachi&f7=100&f6=40000000",
      "id": 12
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.87503,
      "hostOnly": false,
      "httpOnly": false,
      "name": "SAPISID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "rCJhSRz6nUJgJC0f/A5GObxNlrj-8XrghT",
      "id": 13
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.875216,
      "hostOnly": false,
      "httpOnly": false,
      "name": "SID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": false,
      "session": false,
      "storeId": "0",
      "value": "g.a000wwg47I6_d6SPQGXFbRMZI7oWrUWfHURK-u8hdk1dqJWOqD_tPfftGW8Djs8yWZBXrgLuRQACgYKAeMSARUSFQHGX2MiXw6b1eAh-kORpQNnbRbEshoVAUF8yKoWx0_sJbUUmDwLnz-YPPVI0076",
      "id": 14
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1778418732.067432,
      "hostOnly": false,
      "httpOnly": false,
      "name": "SIDCC",
      "path": "/",
      "sameSite": "unspecified",
      "secure": false,
      "session": false,
      "storeId": "0",
      "value": "AKEyXzVUl-7onLif4NpG1kl-6BFE4YKw7mISNlOA1SP0s_EZ9mP1976tQKAF0bYRoUnxKa54USs",
      "id": 15
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1781442648.874908,
      "hostOnly": false,
      "httpOnly": true,
      "name": "SSID",
      "path": "/",
      "sameSite": "unspecified",
      "secure": true,
      "session": false,
      "storeId": "0",
      "value": "AV50SaklJnyN2srz_",
      "id": 16
  },
  {
      "domain": ".youtube.com",
      "expirationDate": 1746882737,
      "hostOnly": false,
      "httpOnly": false,
      "name": "ST-3opvp5",
      "path": "/",
      "sameSite": "unspecified",
      "secure": false,
      "session": false,
      "storeId": "0",
      "value": "session_logininfo=AFmmF2swRQIgKsSRz1EHmY16RUQfmQERGtzPdN5SkD_8tRS6YQdYmp0CIQCgeoI9mPoqdiStkURSYuw1Q3i3NXHvzQNYWc0k6Q7fcw%3AQUQ3MjNmelhoWXpRNU4tZU92dUV6cVRramlBclRxQjhpOGZRbFh6dlhnU05YQjhsM1g3NFZxaWJDY0N0d1JNMmJqSVRMRURuT0kxc0V0ZFVka3hiNFlIcms2VTAwc1RGdUxXWVJFTDMxak9lV0hMWHhuaFFoVC1TY2NLUUdOMV9md3J3Z195YkhJN2h5MVNHNk1zQ0RySFpaQU5TbUpVa1hB",
      "id": 17
  }
]);

// Read cookies from file
const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf8'));

// Create cookie string
const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

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
    
    // Get video info with cookies
    const info = await ytdl.getInfo(videoUrl, agent);
    
    // Get the best audio format
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    // Set appropriate headers for streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    
    // Create the download stream with cookies
    const downloadStream = ytdl(videoUrl, agent);
    
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