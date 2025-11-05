# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Karbon Carbon Badge is a standalone JavaScript widget that displays CO2 emissions data for web pages. It's designed as an npm package (`@statibke/karbon-badge`) that can be embedded via a single script tag.

## Architecture

### Single-File Widget Pattern
The entire badge is implemented as a self-contained IIFE (Immediately Invoked Function Expression) in `karbon-badge.js`. This design ensures:
- Zero dependencies
- Simple deployment via CDN (unpkg)
- Inline CSS and HTML template generation
- No build tooling required for development

### Key Components
- **CONFIG object** (lines 12-17): Contains API endpoint, cache settings, and DOM identifiers
- **Caching layer**: 24-hour localStorage-based cache with background refresh when stale
- **API integration**: Fetches from Karbon API at `https://karbon.statik.be/api/v1/carbon`
- **Rendering**: Inline CSS and HTML template injected into `#karbon-badge` container

### Data Flow
1. Widget initializes on DOM ready
2. Checks localStorage cache with URL-specific keys (`karbon_{encoded_url}`)
3. If cached and fresh (<24h): Renders immediately from cache
4. If cached but stale: Renders from cache, fetches fresh data in background
5. If no cache: Shows loading state, fetches and caches new data

## Development Commands

### Build
```bash
yarn build:badge
```
Note: The `build:badge` script is referenced in package.json but not yet defined. When implementing, it should minify `karbon-badge.js` to `dist/karbon-badge.min.js`.

### Publishing
```bash
npm run prepublishOnly  # Automatically runs build before publish
```

## Important Configuration

### API Endpoint
The production API endpoint is hardcoded in `karbon-badge.js:13`:
```javascript
apiEndpoint: 'https://karbon.statik.be/api/v1/carbon'
```
This must be updated before building for different environments.

### Badge Link
The Karbon website link is hardcoded in the template (line 144):
```javascript
href="https://karbon.statik.be"
```
This should be updated to the production URL before publishing.

## Distribution

- Source file: `karbon-badge.js` (development version with comments)
- Built file: `dist/karbon-badge.min.js` (production minified)
- The `dist/` folder is gitignored but included in npm package via `files` field
- Package is published to npm as `@statibke/karbon-badge`
- Users can access via unpkg CDN: `https://unpkg.com/@statibke/karbon-badge/dist/karbon-badge.min.js`

## Testing the Widget

To test locally, create an HTML file with:
```html
<div id="karbon-badge"></div>
<script src="./karbon-badge.js"></script>
```

The widget requires:
- Modern browser with fetch API support
- localStorage available
- CORS-enabled access to the Karbon API
