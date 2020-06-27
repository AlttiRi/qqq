self.addEventListener('install', (event) => {
  console.log('👷', 'install', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('👷', 'activate', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  console.log('👷', 'fetch', event);
  event.respondWith(new Response("<!DOCTYPE html><h1>1234567</h1>"));
});