const CACHE_NAME = "iturri-pwa-v1";

const ARCHIVOS_INICIALES = [
  "/",
  "/index.html",
  "/foro.html",
  "/galeria.html",
  "/inscripciones.html",
  "/app-movil.html",
  "/estilos-comunes.css",
  "/manifest.webmanifest",
  "/offline.html",
  "/assets/img/icon-192.png",
  "/assets/img/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARCHIVOS_INICIALES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("iturri-pwa-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/__/") ||
    url.pathname.includes("firestore") ||
    url.pathname.includes("firebase")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copia = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copia));
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) ||
                 (await caches.match("/offline.html")) ||
                 (await caches.match("/index.html"));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (
          response.ok &&
          response.type === "basic" &&
          !url.pathname.startsWith("/assets/audio/") &&
          !url.pathname.startsWith("/assets/video/")
        ) {
          const copia = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copia));
        }
        return response;
      });
    })
  );
});
