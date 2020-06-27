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
        //event.respondWith(fetch(event.request));
        return;
    }

    // const formData = await event.request.formData();
    // const text = formData.get('text') || '';
    // alert(text);
    // let a = "hhh";
    // const blob = new Blob([`<!DOCTYPE html><html lang="en"><h1>${a}</h1></html>`],{type: "text/html"});
    // event.respondWith(new Response("blob"));


    event.respondWith((async () => {
        const formData = await event.request.formData();
        const text = formData.get('text') || '';
        // const media = formData.get('media') || '';
        const mediaFiles = formData.getAll('media') || [];
        const files = mediaFiles.map(file => ({
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