// Service Worker for RuralAssist Chatbot - Offline Support

const CACHE_NAME = 'ruralassist-chatbot-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/chatbot_new.html',
  '/schemes.html',
  '/ocr.html',
  '/report.html',
  '/digilocker.html',
  '/login.html',
  '/faq.html',
  '/assets/js/faq.js',
  '/assets/css/style.css',
  '/assets/css/chatbot.css',
  '/assets/css/theme.css',
  '/assets/js/main.js',
  '/assets/js/chatbot.js',
  '/assets/js/login.js',
  '/assets/js/ocr.js',
  '/assets/images/',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
];

// Install Service Worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache.filter(url => !url.includes('http')));
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // API calls - try network first, then cache
  if (event.request.url.includes('/api/') || event.request.url.includes('localhost:8000')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Return offline page or error response
              return new Response(
                JSON.stringify({
                  error: 'offline',
                  message: 'You are currently offline. Please check your internet connection.'
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'application/json'
                  })
                }
              );
            });
        })
    );
  } else {
    // Assets - cache first, fallback to network
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request)
            .then((response) => {
              // Only cache successful responses
              if (!response || response.status !== 200) {
                return response;
              }
              
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
              
              return response;
            })
            .catch(() => {
              // Return a placeholder for failed assets
              if (event.request.destination === 'image') {
                return new Response(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ccc" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="12" fill="#999">Offline</text></svg>',
                  {
                    headers: new Headers({
                      'Content-Type': 'image/svg+xml'
                    })
                  }
                );
              }
              
              return caches.match(event.request);
            });
        })
    );
  }
});

// Background sync for offline messages (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(
      // Implement logic to sync messages when back online
      Promise.resolve()
    );
  }
});

console.log('Service Worker registered and active');
