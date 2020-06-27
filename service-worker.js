self.addEventListener('install', (event) => {
  console.log('👷', 'install', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('👷', 'activate', event);
  return self.clients.claim();
});

self.addEventListener('fetch', async function(event) {
    console.log('👷', 'fetch', event);

    if (event.request.method !== 'POST') {
        event.respondWith(fetch(event.request));
        return;
    }

    const formData = await event.request.formData();
    const text = formData.get('text') || '';
    const blob = new Blob([`<!DOCTYPE html><html lang="en"><h1>${text}</h1></html>`],{type: "text/html"});
    event.respondWith(new Response(blob));


    // event.respondWith((async () => {
    //     const formData = await event.request.formData();
    //     const text = formData.get('text') || '';
    //     const media = formData.get('media') || '';
    //     return event.respondWith(fetch(event.request + "?text=qqqq"));
    // })());

});