const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const LIVE_EVENT_ID = process.env.LIVE_EVENT_ID;

app.get('/live', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.vimeo.com/me/live_events/${LIVE_EVENT_ID}/m3u8_playback`,
      {
        headers: {
          Authorization: `Bearer ${VIMEO_TOKEN}`
        }
      }
    );
    const data = await response.json();
    if (data.m3u8_playback_url) {
      res.redirect(data.m3u8_playback_url);
    } else {
      res.status(503).json({ error: 'Stream not live yet', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
