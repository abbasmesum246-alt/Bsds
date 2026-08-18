const CACHE = "bsds-v1";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    e.respondWith(fetch(request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(request, c)).catch(() => {}); return r; }).catch(() => caches.match(request).then((r) => r || caches.match("/"))));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(request).then((c) => c || fetch(request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((x) => x.put(request, copy)).catch(() => {}); return r; })));
  }
});
