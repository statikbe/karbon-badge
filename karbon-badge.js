/**
 * Karbon Carbon Badge Widget
 * Displays CO2 emissions for the current page
 *
 * Usage:
 * <div id="karbon-badge"></div>
 * <script src="https://your-domain.com/badge/karbon-badge.js"></script>
 */
(function() {
  'use strict';

  const CONFIG = {
    apiEndpoint: 'https://karbon.statik.be/api/v1/carbon',
    cacheDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    containerId: 'karbon-badge',
    cachePrefix: 'karbon_'
  };

  // Helper: Get element by ID
  const getEl = (id) => document.getElementById(id);

  // Helper: Get current page URL
  const getCurrentUrl = () => encodeURIComponent(window.location.href);

  // Helper: Get cache key for current URL
  const getCacheKey = () => CONFIG.cachePrefix + getCurrentUrl();

  /**
   * Fetch carbon data from Karbon API
   * @param {boolean} shouldRender - Whether to render immediately
   */
  const fetchCarbonData = async (shouldRender = true) => {
    try {
      const response = await fetch(`${CONFIG.apiEndpoint}?url=${getCurrentUrl()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (shouldRender) {
        renderBadge(data.data);
      }

      // Cache with timestamp
      const cacheData = {
        ...data.data,
        cachedAt: Date.now()
      };
      localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));

    } catch (error) {
      console.error('Karbon badge error:', error);
      getEl('karbon-result').innerHTML = 'Data unavailable';
      localStorage.removeItem(getCacheKey());
    }
  };

  /**
   * Render the badge with carbon data
   * @param {Object} data - Carbon data from API
   */
  const renderBadge = (data) => {
    const resultEl = getEl('karbon-result');
    const ratingEl = getEl('karbon-rating');

    // Display CO2 amount
    resultEl.innerHTML = `${data.co2_grams}g of CO<sub>2</sub>/view`;

    // Display rating
    ratingEl.innerHTML = `Rating: <strong>${data.co2_rating}</strong>`;

    // Optional: Display project name
    if (data.project) {
      const projectEl = getEl('karbon-project');
      if (projectEl) {
        projectEl.innerHTML = `Project: ${data.project.name}`;
      }
    }
  };

  /**
   * Badge CSS styles
   */
  const styles = `
    <style>
      #karbon-badge {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 15px;
        text-align: center;
        line-height: 1.15;
        margin: 1em 0;
      }

      #karbon-badge sub {
        vertical-align: middle;
        font-size: 0.7em;
      }

      .karbon-container {
        display: inline-flex;
        border-radius: 0.5em;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      #karbon-result {
        padding: 0.5em 1em;
        background: #ffffff;
        border: 2px solid #10b981;
        border-right: none;
        min-width: 10em;
      }

      #karbon-link {
        padding: 0.5em 1em;
        background: #10b981;
        color: #ffffff;
        text-decoration: none;
        font-weight: 600;
        border: 2px solid #10b981;
        transition: background 0.2s;
      }

      #karbon-link:hover {
        background: #059669;
      }

      #karbon-rating {
        margin-top: 0.5em;
        font-size: 0.9em;
        color: #666;
      }
    </style>
  `;

  /**
   * Badge HTML template
   */
  const template = `
    <div class="karbon-container">
      <span id="karbon-result">Measuring CO<sub>2</sub>&hellip;</span>
      <a id="karbon-link" href="https://karbon.statik.be" target="_blank" rel="noopener">
        Karbon
      </a>
    </div>
    <div id="karbon-rating">&nbsp;</div>
    <div id="karbon-project"></div>
  `;

  /**
   * Initialize the badge
   */
  const init = () => {
    // Check browser support
    if (!('fetch' in window)) {
      console.warn('Karbon badge requires fetch API support');
      return;
    }

    const container = getEl(CONFIG.containerId);
    if (!container) {
      console.warn(`Karbon badge container #${CONFIG.containerId} not found`);
      return;
    }

    // Inject styles and HTML
    container.insertAdjacentHTML('beforeend', styles);
    container.insertAdjacentHTML('beforeend', template);

    // Check for cached data
    const cached = localStorage.getItem(getCacheKey());
    const now = Date.now();

    if (cached) {
      try {
        const cachedData = JSON.parse(cached);

        // Render cached data immediately
        renderBadge(cachedData);

        // Refresh in background if stale
        if (now - cachedData.cachedAt > CONFIG.cacheDuration) {
          fetchCarbonData(false);
        }
      } catch (error) {
        console.error('Error parsing cached data:', error);
        fetchCarbonData();
      }
    } else {
      // No cache, fetch fresh data
      fetchCarbonData();
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
