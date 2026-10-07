const CACHE_VERSION = 'll47-command-v4-11'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const scopeUrl = new URL(self.registration.scope)
const atScope = (path = '') => new URL(path, scopeUrl).toString()

const APP_SHELL = [
  atScope(''),
  atScope('index.html'),
  atScope('manifest.webmanifest'),
  atScope('logo-bchqs-bu-gia-map.png'),
  atScope('icons/icon-192.png'),
  atScope('icons/icon-512.png'),
  atScope('icons/icon-maskable-512.png'),
  atScope('icons/apple-touch-icon.png')
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => {
          return (await caches.match(request)) || (await caches.match(atScope('index.html'))) || (await caches.match(atScope('')))
        })
    )
    return
  }

  const cacheable = ['script', 'style', 'image', 'font', 'manifest'].includes(request.destination)
  if (!cacheable) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
