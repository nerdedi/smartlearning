const CACHE = 'smartlearning-v2'
const CORE_ASSETS = [
  './',
  './index.html',
  './game/index.html',
  './game/game.js',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/modules.js',
  './js/storage.js',
  './js/media.js',
  './js/educator.js',
  './js/export.js',
  './js/moneygame.js',
  './offline.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE_ASSETS))
      .catch(console.error),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((res) => {
            // Cache static assets (images, css, js)
            if (
              request.url.startsWith(self.location.origin) &&
              /\\.(png|jpg|jpeg|svg|webp|ico|css|js)$/.test(request.url)
            ) {
              const copy = res.clone()
              caches.open(CACHE).then((c) => c.put(request, copy))
            }
            return res
          })
          .catch(() => caches.match('./offline.html'))
      )
    }),
  )
})
