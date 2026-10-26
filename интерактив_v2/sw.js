// Service Worker: кэшируем файлы для работы офлайн (PWA)
const CACHE_NAME = "hat-v2-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data/labs.js",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./assets/labs/lab01.png",
  "./assets/labs/lab02.jpg",
  "./assets/labs/lab06.jpg",
  "./assets/labs/lab07.jpg",
  "./assets/labs/lab08.jpg",
  "./assets/labs/lab11.jpeg",
  "./assets/labs/lab16.jpg",
  "./assets/labs/lab17.jpg",
  "./assets/labs/lab18.jpg",
  "./assets/labs/lab20.png",
  "./assets/labs/lab25.jpg",
  "./assets/labs/lab27.png",
  "./assets/labs/lab31.png",
  "./assets/labs/lab33.jpg",
  "./assets/labs/lab37.jpg",
  "./assets/labs/lab38.jpg",
  "./assets/labs/lab40.jpg",
  "./assets/labs/lab41.jpg",
  "./assets/labs/lab42.jpg",
  "./assets/labs/lab45.jpg",
  "./assets/labs/lab46.jpg",
  "./assets/labs/lab49.jpg",
  "./assets/labs/lab57.jpg",
  "./assets/labs/lab67.jpg",
  "./assets/labs/lab68.jpg",
  "./assets/labs/lab69.png",
  "./assets/labs/lab77.jpg",
  "./assets/labs/lab79.jpg",
  "./assets/labs/lab80.jpg",
  "./assets/labs/lab81.png",
  "./assets/labs/lab82.png",
  "./assets/labs/lab90.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) { return k !== CACHE_NAME; })
          .map(function (k) { return caches.delete(k); })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});