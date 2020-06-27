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

    if (event.request.method !== "POST") {
        event.respondWith((async () => {
            try {
                return await fetch(event.request);
            } catch (e) {
                const html = `<!DOCTYPE html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><h1>You are offline</h1></html>`;
                const blob = new Blob([html],{type: "text/html"});
                return new Response(blob, {status: 200});
            }
        })());
    }


    event.respondWith((async () => {
        const formData = await event.request.formData();
        const text = formData.get('text') || '';
        // const media = formData.get('media') || '';
        const mediaFiles = formData.getAll('media') || [];
        const files = mediaFiles.map(file => JSON.stringify({
            name: file.name,
            mtime: file.lastModified,
            size: file.size,
            type: file.type,
        }));


        // return new Response(event.request.url + `?text=${encodeURIComponent(text)}`);
        return Response.redirect(event.request.url +
            `?text=${encodeURIComponent(text)}` +
            `&files=${encodeURIComponent(files.toString())}`, 303);
        // return fetch(event.request.url + `?text=${encodeURIComponent(text)}`); // bad
    })());

});