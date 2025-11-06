# Karbon Carbon Badge

A lightweight JavaScript widget that displays CO2 emissions data for web pages.

## Features

- 🌱 Shows CO2 emissions per page view
- 📊 Displays carbon rating (A-F)
- 💾 Client-side caching (24-hour TTL)
- 🚀 Lightweight and fast (3.35 kB, 1.45 kB gzipped)
- 🎨 Customizable styling
- ⚡ Production-ready minified build

## Installation

### Production (Recommended)

Add this HTML where you want the badge to appear:

```html
<!-- Badge container -->
<div id="karbon-badge"></div>

<!-- Badge script (minified) -->
<script src="https://unpkg.com/@statikbe/karbon-badge@1.0.0/dist/karbon-badge.min.js"></script>
```

### If you want extra control over structure and layout

You can add the HTML structure yourself to the page as a template.
You can add the optional attribute `data-custom-style` if you want to take care of the styling yourself

```html
<template id="karbon-badge" data-custom-style>
  <div class="karbon-container">
    ${ data.co2_grams ? `<span id="karbon-result">${data.co2_grams}g of CO<sub>2</sub></span
    >` : '<span id="karbon-no-result">Measuring CO<sub>2</sub>&hellip;</span>' }
    <a id="karbon-link" href="https://karbon.statik.be" target="_blank" rel="noopener">Karbon</a>
  </div>
  <div id="karbon-rating">Rating: <strong>${data.co2_rating}</strong></div>
</template>
```

::: warning The link to the karbon page is mandatory
If you alter the structure of the badge, you need to provide a link to `https://karbon.statik.be` on your page.
:::

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
npm install @statikbe/karbon-badge
# or
yarn add @statikbe/karbon-badge
```

And reference it via:

```html
<script src="https://unpkg.com/@statikbe/karbon-badge/dist/karbon-badge.min.js"></script>
```
