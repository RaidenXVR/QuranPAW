const CACHE_NAME = "alquran-pwa-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/bookmarks.html",
    '/service-worker.js',
    "/src/pages/BookmarList.js",
    "/src/pages/BookmarkPage.js",
    "/src/pages/SurahList.js",
    "/src/pages/SurahPage.js",
    "/src/AddBookmark.js",
    "/src/index.js",
    "/src/serviceWorkerRegistration.js",
    "/src/context/AuthContext.js",
    "/src/context/BookmarkContext.js",
    "/src/styles/App.css",
    "/src/styles/Navbar.css",
    "/css/style.css",
    "/images/logo192.png",
    "/images/logo512.png",
    "/src/App.js",
    "/assets/quran_id.json",
    "/manifest.json",
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
    if (event.request.method !== 'GET') {
        return; // Bypass caching for non-GET requests
    }
    event.respondWith(
        fetch(event.request).then((networkResponse) => {
            // If the network request is successful, cache the response and return it
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone()); // Cache the new network response
                return networkResponse;
            });
        }).catch(() => {
            // If the network request fails, try to return the cached response
            return caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // Return the cached response if found
                }
                // Optionally, return a fallback page if the request is not in the cache
                return caches.match('/index.html');
            });
        })
    );
});
