// ======================================
// LUCY - SERVICE WORKER
// ======================================

const CACHE_NAME = "lucy-v26";

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

        // Alleen GET-verzoeken behandelen.

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        // ==================================
        // ALLEEN HTTP / HTTPS
        // ==================================
        // Hiermee voorkomen we de fout:
        //
        // Request scheme 'chrome-extension'
        // is unsupported
        //
        // Browser-extensies mogen niet door
        // onze Cache Storage worden verwerkt.

        const url =
            new URL(
                event.request.url
            );


        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            return;

        }


        // ==================================
        // REQUEST AFHANDELEN
        // ==================================

        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(
                    opgeslagen => {

                        // Eerst kijken of Lucy het
                        // bestand al lokaal heeft.

                        if (opgeslagen) {

                            return opgeslagen;

                        }


                        // ==================================
                        // NIET IN CACHE
                        // ==================================

                        return fetch(
                            event.request
                        )
                            .then(
                                response => {

                                    // Ongeldige responses niet
                                    // proberen te cachen.

                                    if (
                                        !response ||
                                        response.status !== 200 ||
                                        response.type === "opaque"
                                    ) {

                                        return response;

                                    }


                                    // Response kopiëren zodat
                                    // hij zowel aan de browser
                                    // als aan de cache gegeven
                                    // kan worden.

                                    const kopie =
                                        response.clone();


                                    // ==================================
                                    // ALLEEN HTTP/HTTPS CACHEN
                                    // ==================================

                                    caches
                                        .open(
                                            CACHE_NAME
                                        )
                                        .then(
                                            cache => {

                                                return cache.put(
                                                    event.request,
                                                    kopie
                                                );

                                            }
                                        )
                                        .catch(
                                            fout => {

                                                console.warn(
                                                    "Lucy kon een bestand niet cachen:",
                                                    fout
                                                );

                                            }
                                        );


                                    return response;

                                }
                            )
                            .catch(
                                () => {

                                    // ==================================
                                    // OFFLINE FALLBACK
                                    // ==================================

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

