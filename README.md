# Karbon Carbon Badge

A lightweight JavaScript widget that displays CO2 emissions data for web pages.

## Features

- 🌱 Shows CO2 emissions per page view
- 📊 Displays carbon rating (A-F)
- 💾 Client-side caching (24-hour TTL)
- 🚀 Lightweight and fast (2.6 kB, 1.2 kB gzipped)
- 🎨 Customizable styling
- ⚡ Production-ready minified build

## Installation

### Production (Recommended)

Add this HTML where you want the badge to appear:

```html
<!-- Badge container -->
<div id="karbon-badge"></div>

<!-- Badge script (minified) -->
<script src="https://unpkg.com/karbon-badge.min.js"></script>
```


## How It Works

1. **Fetches data** from the Karbon API (`/api/v1/carbon?url=...`)
2. **Caches results** in localStorage for 24 hours
3. **Displays badge** with CO2 emissions and rating
4. **Auto-refreshes** stale cache in background


## NPM Package

This badge is designed to be published to npm. The `dist/` folder is gitignored but will be included in the npm package.

### Package Structure

When published to npm, users can install via:

```bash
npm install @statibke/karbon-badge
# or
yarn add @statibke/karbon-badge
```

And reference it via:
```html
<script src="https://unpkg.com/@statibke/karbon-badge/dist/karbon-badge.min.js"></script>
```

## Production

For production deployment:
1. Run `yarn build:badge` to create minified version
2. Update `apiEndpoint` in source to your production domain before building
3. Publish to npm or deploy `badge/dist/karbon-badge.min.js` to your CDN
4. Add proper CORS headers if serving cross-domain
5. Monitor API rate limits (60 req/min/IP)
