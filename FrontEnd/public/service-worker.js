const CACHE_NAME = "alquran-pwa-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/bookmarks.html",
    "/BookmarList.js",
    "/BookmarkPage.js",
    "/css/style.css",
    "/images/logo192.png",
    "/images/logo512.png",
    "/src/App.js"
];

// Install Service Worker
self.addEventListener("install", (event) => {
    console.log("Service Worker: Installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Caching files...");
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activated");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Clearing old cache...");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('Network error occurred', {
          status: 500
        });
      })
    );
  });
