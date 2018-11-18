const CACHE_VERSION = 2
const CURRENT_CACHES = {
  prefetch: `window-cache-v${CACHE_VERSION}`
}

self.addEventListener('install', event => {

  /**
   * Define a list of URLs that the browser will prefetch.
   *
   * When the service worker has installed it will perform requests to
   * these defined URLs and will store them in the browsers cache via
   * the cache API. This allows progressive web applications and after
   * the initial data load each request can be served from the browsers
   * cache (preventing server requests per client).
   *
   * For caches to be enabled the web applicaton must register a service worker
   * that initialises the cache bins. This can cause issues with the initial
   * request, typically applications will listen to the service worker ready
   * event and then trigger loading the DOM from cache - in our demo we manually
   * trigger the cache loading via buttons.
   *
   * @see https://googlechrome.github.io/samples/service-worker/window-caches/
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/caches
   */
  const prefetchUrls = [
    process.env.DRUPAL_URL + '/jsonapi/node/dogs',
    process.env.DRUPAL_URL + '/jsonapi/node/dogs/bc2153d4-3426-4983-a33e-d57934dec3fa'
  ]

  // This is a blocking operation so initial loads may be affected based on how
  // many resources are being stored in the browser caches.
  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then((cache) => {
      return cache.addAll(prefetchUrls).then(() => {
        console.log('All resources have been fetched and cached')
        self.skipWaiting()
      }).catch((error) => {
        console.error('Pre-fetch failed:', error)
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  self.clients.claim()
  const expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) => CURRENT_CACHES[key])
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('Deleting out of date cache:', cacheName)
            return caches.delete(cacheName);
          }
        })
      )
    })
  )
})
