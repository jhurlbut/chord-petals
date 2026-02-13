/*! coi-service-worker v0.1.7 - Guido Zuidhof, licensed under MIT */
let coepCredentialless = false;
if (typeof window === 'undefined') {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
  self.addEventListener("message", (ev) => {
    if (ev.data && ev.data.type === "deregister") {
      self.registration.unregister().then(() => self.clients.matchAll()).then(clients => {
        clients.forEach((client) => client.navigate(client.url));
      });
    }
  });
  self.addEventListener("fetch", function(event) {
    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.status === 0) return response;
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", coepCredentialless ? "credentialless" : "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }).catch((e) => console.error(e))
    );
  });
} else {
  (() => {
    const reloadedBySelf = window.sessionStorage.getItem("coiReloadedBySelf");
    window.sessionStorage.removeItem("coiReloadedBySelf");
    const coepDegrading = reloadedBySelf === "coepdegrade";
    if (window.crossOriginIsolated !== false || reloadedBySelf) return;
    if (!window.isSecureContext) {
      console.log("COOP/COEP Service Worker: Not a secure context, cannot register.");
      return;
    }
    if (coepDegrading) coepCredentialless = true;
    window.sessionStorage.setItem("coiReloadedBySelf", coepDegrading ? "coepdegrade" : "");
    navigator.serviceWorker.register(window.document.currentScript?.src || "coi-serviceworker.js").then(
      (registration) => {
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker.addEventListener("statechange", () => {
            if (worker.state === "activated") window.location.reload();
          });
        });
        if (registration.active && !navigator.serviceWorker.controller) window.location.reload();
      },
      (err) => console.error("COOP/COEP Service Worker failed to register:", err)
    );
  })();
}
