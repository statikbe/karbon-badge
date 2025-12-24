/**
 * Karbon Carbon Badge Widget
 * Displays CO2 emissions for the current page
 *
 * Usage:
 * <div id="karbon-badge"></div>
 * <script src="https://your-domain.com/badge/karbon-badge.js"></script>
 */
(function () {
  "use strict";

  const CONFIG = {
    apiEndpoint: "https://karbon.statik.be/api/v1/carbon",
    // apiEndpoint: "/testdata.json",
    cacheDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    containerId: "karbon-badge",
    cachePrefix: "karbon_",
  };

  // Helper: Get element by ID
  const getEl = (id) => document.getElementById(id);

  // Helper: Get current page URL
  const getCurrentUrl = () => encodeURIComponent(window.location.href);

  // Helper: Get cache key for current URL
  const getCacheKey = () => CONFIG.cachePrefix + getCurrentUrl();

  const evaluateJSTemplate = (templateString, data) => {
    try {
      // Create a function that evaluates the template string with the provided data
      const functionBody = `
        with (data) {
          return \`${templateString.replace(/&gt;/g, ">")}\`;
        }
      `;
      const templateFunction = new Function("data", functionBody);
      return templateFunction(data);
    } catch (error) {
      console.error("Error evaluating JS template:", error);
      return "";
    }
  };

  let container = getEl(CONFIG.containerId);

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

      // Only cache if we have valid CO2 data
      if (data.data && data.data.co2_grams) {
        const cacheData = {
          ...data.data,
          cachedAt: Date.now(),
        };
        localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error("Karbon badge error:", error);
      getEl("karbon-result").innerHTML = "Data unavailable";
      localStorage.removeItem(getCacheKey());
    }
  };

  /**
   * Render the badge with carbon data
   * @param {Object} data - Carbon data from API
   */
  const renderBadge = (data) => {
    container.innerHTML = evaluateJSTemplate(template, data);
    const karbonLink = document.querySelector('a[href="https://karbon.statik.be"]');
    if (!karbonLink || karbonLink.textContent.trim() !== "Karbon") {
      console.warn(
        "Karbon badge link not found. Please ensure the link to karbon.statik.be is present for proper attribution."
      );
      container.remove();
    }
  };

  /**
   * Badge HTML template
   */
  let template = `
    <div class="karbon-container">
        <span id="karbon-result">\${data.co2_grams ? \`\${data.co2_grams}g of CO<sub>2</sub>\` : 'No data'}</span>
        <a id="karbon-link" href="https://karbon.statik.be" target="_blank" rel="noopener">Karbon</a>
      </div>
      <div id="karbon-rating">Rating: <strong>\${data.co2_rating}</strong></div>
  `;

  /**
   * Initialize the badge
   */
  const init = () => {
    // Check browser support
    if (!("fetch" in window)) {
      console.warn("Karbon badge requires fetch API support");
      return;
    }

    if (!container) {
      console.warn(`Karbon badge container #${CONFIG.containerId} not found`);
      return;
    }

    // Inject styles and HTML
    if (!container.hasAttribute("data-custom-style")) {
      container.insertAdjacentHTML(
        "afterend",
        `<style>
        #karbon-badge {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          text-align: center;
          line-height: 1;
        }

        #karbon-badge sub {
          vertical-align: middle;
          font-size: 1rem;
        }

        .karbon-container {
          display: flex;
          border-radius: 0.25rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        #karbon-result {
          flex-grow: 1;
          border-top-left-radius: 0.25rem;
          border-bottom-left-radius: 0.25rem;
          padding: 0.5rem 1rem;
          background: #ffffff;
          border: 2px solid #02875a;
          border-right: none;
          min-width: 10em;
        }

        #karbon-link {
          padding: 0.5em 1em;
          background: #02875a;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          border: 2px solid #02875a;
        }

        #karbon-rating {
          text-align: center;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        </style>`
      );
    }
    if (container.tagName.toLowerCase() === "template") {
      template = container.innerHTML;
      container.insertAdjacentHTML("afterend", `<div id="${CONFIG.containerId}"></div>`);
      container.remove();
      container = getEl(CONFIG.containerId);
    }

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
        console.error("Error parsing cached data:", error);
        fetchCarbonData();
      }
    } else {
      // No cache, fetch fresh data
      fetchCarbonData();
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
