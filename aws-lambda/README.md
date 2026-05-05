# Vimeo Livestream Proxy (AWS Lambda)

## Overview

Serverless proxy for Vimeo livestream playback.

Provides a single, stable URL that dynamically resolves and redirects to the current Vimeo HLS stream. This allows websites, apps, and streaming platforms to use one permanent link without needing updates for each livestream.

---

## How It Works

- Receives a request at the Lambda Function URL
- Calls the Vimeo API to retrieve the current livestream playback URL
- Returns an HTTP `302` redirect to the active HLS stream
- If the stream is not live, returns a `503` response

---

## Environment Variables

Set the following in AWS Lambda:
```
VIMEO_TOKEN=your_vimeo_personal_access_token
LIVE_EVENT_ID=your_vimeo_live_event_id
```

### Vimeo Token Requirements

- Use a **Personal Access Token**
- Required scopes:
  - `private`
  - `video_files`

---

## AWS Configuration

Lambda settings:
```
Runtime: Node.js 22+ (or newer)
Handler: index.handler
Architecture: arm64
```

Access:
```
Lambda Function URL enabled
Auth Type: NONE (public access)
```
---

## Endpoint

The Lambda Function URL acts as the public endpoint:
```
https://.lambda-url..on.aws/
```

This URL should be used anywhere the livestream is embedded or referenced.

---

## Behavior

- `302 Redirect` → When livestream is active
- `503 Service Unavailable` → When stream is not live
- `500 Internal Server Error` → Unexpected failure

---

## Caching

Includes short in-memory caching (~30 seconds) to:

- Reduce Vimeo API calls
- Improve response time

Note: Cache is per Lambda instance and may vary under high concurrency.

---

## Monitoring

Basic monitoring is configured using AWS CloudWatch:

- Alarm triggers on repeated Lambda errors
- Notifications sent via SNS (email)

---

## Cost

- AWS Lambda usage is expected to remain within the free tier under normal traffic
- No ongoing hosting cost

---

## Development Notes

- Do not commit environment variables or tokens
- Token should be stored securely in Lambda environment variables
- This service is stateless and requires no database

---

## Future Enhancements (Optional)

- Custom domain (e.g. `live.yourdomain.com`)
- CDN layer (CloudFront) for additional caching
- Enhanced alerting or logging

---
