const offlineHtml =
`<!DOCTYPE html>
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1">
<h1>You are offline</h1>
</html>`;


async function postMessage(message) {
    const clients = await self.clients.matchAll({type: "window"});
    console.log(clients);
    clients.forEach(client => client.postMessage(message));
}


self.addEventListener("install", event => {
    const handler = async event => {
        console.log("SW: install", event);
        return self.skipWaiting();
    }
    event.waitUntil(handler(event));
});

self.addEventListener("activate", event => {
    const handler = async event => {
        console.log("SW: activate", event);
        await postMessage("activated");
        return self.clients.claim();
    }
    event.waitUntil(handler(event));
});

self.addEventListener("fetch", event => {
    console.log("SW: fetch", event);

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

        const mediaFiles = formData.getAll("images") || [];
        const files = mediaFiles.map(file => JSON.stringify({
            name: file.name,
            mtime: file.lastModified,
            date: new Date(file.lastModified),
            size: file.size,
            type: file.type,
        }, null, " "));

        const redirectUrl = new URL(event.request.url);
        redirectUrl.searchParams.append("text", text);
        redirectUrl.searchParams.append("files", files.toString());

        return Response.redirect(redirectUrl.toString(), 303);
    })());

});