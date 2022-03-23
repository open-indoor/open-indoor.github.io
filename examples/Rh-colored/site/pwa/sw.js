var cacheName = 'Kingconf-rh';
var filesToCache = [
    '/',
    '/index.html',
    'https://unpkg.com/maplibre-gl@2.1.6/dist/maplibre-gl.js',
    'https://unpkg.com/maplibre-gl@2.1.6/dist/maplibre-gl.css',
    'https://app.openindoor.io/openindoor.js',
    'https://kingconf-rh.openindoor.io/indoor-kingconf-rh.json',
    'https://kingconf-rh.openindoor.io/PLAN_GENERAL-btouleau.geojson'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});