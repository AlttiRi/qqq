const offlineHtml =
`<!DOCTYPE html>
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1">
<h1>You are offline</h1>
</html>`;



self.addEventListener("install", (event) => {
  console.log("👷", "install", event);
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("👷", "activate", event);
  return self.clients.claim();
});

self.addEventListener("fetch", async function(event) {
    console.log("👷", "fetch", event);

    if (event.request.method !== "POST") {
        return event.respondWith((async () => {
            try {
                return await fetch(event.request);
            } catch (e) {
                const blob = new Blob([offlineHtml],{type: "text/html"});
                return new Response(blob, {status: 200});
            }
        })());
    }


    return event.respondWith((async () => {
        const formData = await event.request.formData();
        const text = formData.get("text") || "";
        const title = formData.get("title") || "";
        const url = formData.get("url") || "";

        const mediaFiles = formData.getAll("medias_") || [];
        const files = mediaFiles.map(file => JSON.stringify({
            name: file.name,
            mtime: file.lastModified,
            size: file.size,
            type: file.type,
        }));

        return Response.redirect(event.request.url +
            `?text=${encodeURIComponent(text)}` +
            `&title=${encodeURIComponent(title)}` +
            `&url=${encodeURIComponent(url)}` +
            `&files=${encodeURIComponent(files.toString())}`, 303);

        // return new Response(event.request.url + `?text=${encodeURIComponent(text)}`);
        // return fetch(event.request.url + `?text=${encodeURIComponent(text)}`); // bad
    })());

});