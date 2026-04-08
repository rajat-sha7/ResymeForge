# Resume PDF Worker (Docker)

This directory contains a minimal Dockerized worker that runs Puppeteer and exposes a simple HTTP API to generate PDFs from either a URL or raw HTML. It is intended to be used as a scalable worker behind your Next.js app (or any service) to offload CPU-heavy PDF rendering.

Endpoints:
- `POST /generate-pdf` — JSON body: `{ "url": "https://..." }` or `{ "html": "<html>...</html>" }`. Returns `application/pdf`.
- `GET /health` — simple health check.

Build:

```
docker build -t resume-pdf-worker ./docker-worker
```

Run (local):

```
docker run --rm -p 3001:3000 resume-pdf-worker
```

Usage example (curl):

```
curl -X POST http://localhost:3001/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"url":"http://example.com"}' --output resume.pdf
```

Notes:
- The container uses the full `puppeteer` package and installs required system libraries. For production/deployments you can switch to `puppeteer-core` and provide a separate Chromium binary or use a prebuilt base image that includes Chromium.
- Consider adding a reverse-proxy, autoscaling group, or queue (e.g. Redis/Sidekiq, RabbitMQ) to scale requests and manage concurrency.
