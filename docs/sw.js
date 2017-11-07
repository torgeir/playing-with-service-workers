// https://developers.google.com/web/fundamentals/primers/service-workers/
// https://github.com/w3c/ServiceWorker/blob/master/explainer.md

const version = "v2";

const files = ["./index.html", "./index.js"];

// install the web page on first load
self.addEventListener("install", e =>
  e.waitUntil(async function () {
    console.log("sw: caching", files);
    const cache = await caches.open(version);
    await cache.addAll(files);

    // don't wait for page reload to activate
    return this.skipWaiting();
  }()));

// intercept fetch requests
self.addEventListener("fetch", e =>
  e.respondWith(async function () {
    const { request } = e;
    console.log("sw: fetch", request.url);

    // expose version to the web page
    if (request.url.includes('/sw-version')) {
      return new Response(version, { headers: { 'content-type': 'text/plain' } });
    }

    const response = await caches.match(request);
    return response || fetch(request);
  }()));

// fired once a new service worker takes control of the web page
self.addEventListener("activate", e =>
  e.waitUntil(async function () {
    console.log("sw: activate");
    const names = await caches.keys();
    return Promise.all(
      names.map(name => {
        if (name == version) {
          return Promise.resolve();
        }

        console.log("sw: clearing cache", name);
        return caches.delete(name);
      })
    )
    // take control of the page imediately on first install
    .then(_ => clients.claim());
  }()));