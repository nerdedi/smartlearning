/* ============================================================
   Smart Learning for Independence – Service Worker
   Offline support for PWA functionality
   ============================================================ */

const CACHE_NAME = 'smartlearning-v1'
const OFFLINE_URL = '/offline.html'

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/gallery.md',
  '/modules-data.js',
  '/manifest.webmanifest',
  '/offline.html',
  '/css/styles.css',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/icon.svg',
  '/js/modules.js',
  '/js/storage.js',
  '/js/app.js',
  '/js/media.js',
  '/js/educator.js',
  '/js/export.js',
  '/js/moneygame.js',
  '/manifest.json',
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell')
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName === CACHE_NAME) return null
          console.log('[SW] Removing old cache:', cacheName)
          return caches.delete(cacheName)
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }
        })
    }),
  )
})

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})
