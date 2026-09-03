// ======================================
// LUCY
// Alles uit je hoofd.
//
// Simpele versie:
// - Gedachten dumpen
// - Later verwerken
// - Geen taken
// - Geen subtaken
// - Geen categorieën
// - Geen ideeën
// - Geen planning
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_INBOX = "lucyInbox";

let gedachten = [];
let huidigePagina = "paginaHoofd";


// ======================================
// ELEMENTEN
// ======================================

const snelToevoegenForm =
    document.getElementById("snelToevoegenForm");

const snelInput =
    document.getElementById("snelInput");

const verwerkLijst =
    document.getElementById("verwerkLijst");

const legeVerwerkLijst =
    document.getElementById("legeVerwerkLijst");

const terugNaarLucyKnop =
    document.getElementById("terugNaarLucy");

const verwerkKnop =
    document.getElementById("verwerkKnop");

const paginaHoofd =
    document.getElementById("paginaHoofd");

const paginaVerwerken =
    document.getElementById("paginaVerwerken");


// ======================================
// START
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    gegevensLaden();

    paginaOpenen("paginaHoofd");

    gedachtenWeergeven();

    if (snelInput) {
        snelInput.focus();
    }

    serviceWorkerRegistreren();
});


// ======================================
// GEGEVENS LADEN
// ======================================

function gegevensLaden() {

    try {

        const opgeslagen =
            localStorage.getItem(OPSLAG_INBOX);

        if (!opgeslagen) {
            gedachten = [];
            return;
        }

        const data = JSON.parse(opgeslagen);

        if (!Array.isArray(data)) {
            gedachten = [];
            return;
        }

        gedachten = data
            .map(gedachte => {

                if (typeof gedachte === "string") {

                    return {
                        id: maakId(),
                        tekst: gedachte.trim(),
                        aangemaakt:
                            new Date().toISOString()
                    };
                }

                return {
                    id:
                        gedachte.id ||
                        maakId(),

                    tekst:
                        String(
                            gedachte.tekst ||
                            gedachte.titel ||
                            ""
                        ).trim(),

                    aangemaakt:
                        gedachte.aangemaakt ||
                        new Date().toISOString()
                };
            })
            .filter(
                gedachte =>
                    gedachte.tekst !== ""
            );

    } catch (fout) {

        console.error(
            "Lucy kon de gedachten niet laden:",
            fout
        );

        gedachten = [];
    }
}


// ======================================
// GEGEVENS OPSLAAN
// ======================================

function gegevensOpslaan() {

    localStorage.setItem(
        OPSLAG_INBOX,
        JSON.stringify(gedachten)
    );
}


// ======================================
// ID MAKEN
// ======================================

function maakId() {

    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


// ======================================
// NAVIGATIE
// ======================================

function paginaOpenen(paginaId) {

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("actief");
        });


    const pagina =
        document.getElementById(paginaId);


    if (!pagina) {
        return;
    }


    pagina.classList.add("actief");

    huidigePagina = paginaId;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (paginaId === "paginaVerwerken") {

        gedachtenWeergeven();
    }


    if (
        paginaId === "paginaHoofd" &&
        snelInput
    ) {

        setTimeout(() => {
            snelInput.focus();
        }, 100);
    }
}


// ======================================
// GEDACHTE OPSLAAN
// ======================================

if (snelToevoegenForm) {

    snelToevoegenForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!snelInput) {
                return;
            }


            const tekst =
                snelInput.value.trim();


            if (!tekst) {

                snelInput.focus();
                return;
            }


            gedachten.unshift({

                id: maakId(),

                tekst: tekst,

                aangemaakt:
                    new Date().toISOString()
            });


            gegevensOpslaan();


            snelInput.value = "";


            // Het hoofdscherm blijft leeg.
            // Alleen de invoer wordt opnieuw
            // klaargezet voor de volgende gedachte.

            snelInput.focus();


            // Verwerkpagina alvast bijwerken
            // zonder er naartoe te gaan.
            gedachtenWeergeven();
        }
    );
}


// ======================================
// VERWERKEN KNOP
// ======================================

if (verwerkKnop) {

    verwerkKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            paginaOpenen(
                "paginaVerwerken"
            );
        }
    );
}


// ======================================
// TERUG NAAR LUCY
// ======================================

if (terugNaarLucyKnop) {

    terugNaarLucyKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            paginaOpenen(
                "paginaHoofd"
            );
        }
    );
}


// ======================================
// GEDACHTEN WEERGEVEN
// ======================================

function gedachtenWeergeven() {

    if (!verwerkLijst) {
        return;
    }


    verwerkLijst.innerHTML = "";


    if (legeVerwerkLijst) {

        legeVerwerkLijst.hidden =
            gedachten.length > 0;
    }


    gedachten.forEach(gedachte => {

        verwerkLijst.appendChild(
            maakGedachteKaart(gedachte)
        );
    });
}


// ======================================
// GEDACHTE KAART
// ======================================

function maakGedachteKaart(gedachte) {

    const kaart =
        document.createElement("article");

    kaart.className =
        "gedachte-kaart";


    // ----------------------------------
    // TEKST
    // ----------------------------------

    const tekst =
        document.createElement("div");

    tekst.className =
        "gedachte-tekst";

    tekst.textContent =
        gedachte.tekst;


    kaart.appendChild(tekst);


    // ----------------------------------
    // DATUM
    // ----------------------------------

    const datum =
        document.createElement("small");

    datum.className =
        "gedachte-datum";

    datum.textContent =
        datumTijdMooi(
            gedachte.aangemaakt
        );


    kaart.appendChild(datum);


    // ----------------------------------
    // ACTIES
    // ----------------------------------

    const acties =
        document.createElement("div");

    acties.className =
        "gedachte-acties";


    // ----------------------------------
    // OPGESCHREVEN
    // ----------------------------------

    const opgeschreven =
        document.createElement("button");

    opgeschreven.type =
        "button";

    opgeschreven.className =
        "gedachte-klaar";

    opgeschreven.textContent =
        "✓ Opgeschreven";

    opgeschreven.setAttribute(
        "aria-label",
        "Gedachte is opgeschreven"
    );


    opgeschreven.addEventListener(
        "click",
        event => {

            event.preventDefault();

            gedachteVerwijderen(
                gedachte.id
            );
        }
    );


    // ----------------------------------
    // WEGGOOIEN
    // ----------------------------------

    const weggooien =
        document.createElement("button");

    weggooien.type =
        "button";

    weggooien.className =
        "gedachte-verwijderen";

    weggooien.textContent =
        "🗑 Weggooien";

    weggooien.setAttribute(
        "aria-label",
        "Gedachte weggooien"
    );


    weggooien.addEventListener(
        "click",
        event => {

            event.preventDefault();

            gedachteVerwijderen(
                gedachte.id
            );
        }
    );


    acties.appendChild(
        opgeschreven
    );

    acties.appendChild(
        weggooien
    );


    kaart.appendChild(acties);


    return kaart;
}


// ======================================
// GEDACHTE VERWIJDEREN
// ======================================

function gedachteVerwijderen(id) {

    gedachten =
        gedachten.filter(
            gedachte =>
                gedachte.id !== id
        );


    gegevensOpslaan();

    gedachtenWeergeven();
}


// ======================================
// DATUM / TIJD
// ======================================

function datumTijdMooi(datum) {

    if (!datum) {
        return "";
    }


    const d =
        new Date(datum);


    if (
        Number.isNaN(
            d.getTime()
        )
    ) {
        return "";
    }


    return d.toLocaleString(
        "nl-NL",
        {
            weekday: "short",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ======================================
// BACKUP
// ======================================
//
// Deze functies blijven bewust klein.
// Ze kunnen later vanuit Instellingen
// worden aangeroepen als we die pagina
// willen behouden.
// ======================================

function backupMaken() {

    const backup = {

        app: "Lucy",

        versie: "5.0",

        datum:
            new Date().toISOString(),

        gedachten: gedachten
    };


    const inhoud =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [inhoud],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "lucy-backup-" +
        datumNaarString(
            new Date()
        ) +
        ".json";


    document.body.appendChild(link);

    link.click();

    link.remove();


    URL.revokeObjectURL(url);
}


// ======================================
// BACKUP DATUM
// ======================================

function datumNaarString(datum) {

    const jaar =
        datum.getFullYear();

    const maand =
        String(
            datum.getMonth() + 1
        ).padStart(2, "0");

    const dag =
        String(
            datum.getDate()
        ).padStart(2, "0");


    return (
        jaar +
        "-" +
        maand +
        "-" +
        dag
    );
}


// ======================================
// SERVICE WORKER
// ======================================

function serviceWorkerRegistreren() {

    if (
        !(
            "serviceWorker"
            in navigator
        )
    ) {
        return;
    }


    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("sw.js")
                .then(
                    registratie => {

                        console.log(
                            "Lucy service worker actief:",
                            registratie.scope
                        );
                    }
                )
                .catch(
                    fout => {

                        console.error(
                            "Service worker fout:",
                            fout
                        );
                    }
                );
        }
    );
}
