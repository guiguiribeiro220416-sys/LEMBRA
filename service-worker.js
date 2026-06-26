const CACHE_NAME = 'NOTAS-VOZ-V1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon.svg'
];

// INSTALACAO DO SERVICE WORKER E ARMAZENAMENTO EM CACHE DOS ARQUIVOS ESTRUTURAIS
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ATIVACAO E LIMPEZA DE CACHES ANTIGOS
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ESTRATEGIA DE CACHE-FIRST COM FALLBACK PARA REDE PARA PERMITIR FUNCIONAMENTO TOTALMENTE OFFLINE
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // RETORNA O INDEX CASO SEJA UMA REQUISICAO DE NAVEGACAO E ESTEJA OFFLINE
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
