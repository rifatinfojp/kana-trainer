self.addEventListener("install", event => {

  event.waitUntil(

    caches.open("kana-cache").then(cache => {

      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js",
        "./kana-data.js",
        "./manifest.json",
        "./icon-192.png"
      ]);

    })

  );

});


self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(response => {

      return response || fetch(event.request);

    })

  );

});
