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

    const blob = new Blob([`<!DOCTYPE html><html lang="en"><h1>5555</h1></html>`],{type: "text/html"});
    event.respondWith(new Response(blob));

});