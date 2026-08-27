// ======================================
// LUCY - SERVICE WORKER
// ======================================

const CACHE_NAME = "lucy-v3";

const APP_BESTANDEN = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192x192.png",
    "./icon-512x512.png"
];


// ======================================
// INSTALLEREN
// ======================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    cache => {

                        return cache.addAll(
                            APP_BESTANDEN
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


// ======================================
// ACTIVEREN
// ======================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNamen => {

                        return Promise.all(

                            cacheNamen
                                .filter(
                                    naam =>
                                        naam !== CACHE_NAME
                                )
                                .map(
                                    naam =>
                                        caches.delete(
                                            naam
                                        )
                                )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


// ======================================
// OPVRAGEN BESTANDEN
// ======================================

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !== "GET"
        ) {
            return;
        }


        event.respondWith(

            caches
                .match(event.request)
                .then(
                    opgeslagen => {

                        if (opgeslagen) {
                            return opgeslagen;
                        }


                        return fetch(
                            event.request
                        )
                            .then(
                                response => {

                                    if (
                                        !response ||
                                        response.status !== 200 ||
                                        response.type === "opaque"
                                    ) {

                                        return response;

                                    }


                                    const kopie =
                                        response.clone();


                                    caches
                                        .open(
                                            CACHE_NAME
                                        )
                                        .then(
                                            cache => {

                                                cache.put(
                                                    event.request,
                                                    kopie
                                                );

                                            }
                                        );


                                    return response;

                                }
                            )
                            .catch(
                                () => {

                                    return caches.match(
                                        "./index.html"
                                    );

                                }
                            );

                    }
                )

        );

    }
);
