const VIMEO_TOKEN = process.env.VIMEO_TOKEN;
const LIVE_EVENT_ID = process.env.LIVE_EVENT_ID;

let cachedUrl = null;
let cachedAt = 0;
const CACHE_MS = 30_000;

export const handler = async (event) => {
  // throw new Error("test error");
  try {
    if (!VIMEO_TOKEN || !LIVE_EVENT_ID) {
      return json(500, {
        error: "Missing VIMEO_TOKEN or LIVE_EVENT_ID"
      });
    }

    const now = Date.now();

    if (!cachedUrl || now - cachedAt > CACHE_MS) {
      const response = await fetch(
        `https://api.vimeo.com/me/live_events/${LIVE_EVENT_ID}/m3u8_playback`,
        {
          headers: {
            Authorization: `Bearer ${VIMEO_TOKEN}`
          }
        }
      );

      const data = await response.json();

      if (!data.m3u8_playback_url) {
        console.warn("Vimeo stream not live yet", data);
        return json(503, {
          error: "Stream not live yet",
          details: data
        });
      }

      cachedUrl = data.m3u8_playback_url;
      cachedAt = now;
    }

    return {
      statusCode: 302,
      headers: {
        Location: cachedUrl,
        "Cache-Control": "no-store"
      },
      body: ""
    };
  } catch (err) {
    return json(500, {
      error: "Server error",
      details: err.message
    });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}
