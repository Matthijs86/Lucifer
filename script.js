// ======================================
// LUCY
// Alles uit je hoofd.
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_INBOX = "lucyInbox";
const OPSLAG_TAKEN = "lucyTaken";
const OPSLAG_IDEEEN = "lucyIdeeen";
const OPSLAG_CATEGORIEEN = "lucyCategorieen";


// ======================================
// STANDAARD CATEGORIEËN
// ======================================

const STANDAARD_CATEGORIEEN = [
    "Sociaal",
    "Administratie",
    "Klussen",
    "Financiën",
    "Huis",
    "Auto",
    "Boodschappen",
    "Afspraken",
    "Ideeën",
    "Franciska (terwille)",
    "ADHD/Autisme",
    "Overig"
];


// ======================================
// DATA
// ======================================

let inbox = [];
let taken = [];
let ideeen = [];


// ======================================
// ACTIEVE VERWERKING
// ======================================

let huidigInboxId = null;


// ======================================
// ELEMENTEN
// ======================================

const snelToevoegenForm =
    document.getElementById("snelToevoegenForm");

const snelInput =
    document.getElementById("snelInput");

const inboxLijst =
    document.getElementById("inboxLijst");

const legeInbox =
    document.getElementById("legeInbox");

const verwerkKnop =
    document.getElementById("verwerkKnop");

const verwerkModal =
    document.getElementById("verwerkModal");

const modalSluiten =
    document.getElementById("modalSluiten");

const verwerkKeuzeScherm =
    document.getElementById("verwerkKeuzeScherm");

const taakScherm =
    document.getElementById("taakScherm");

const taakForm =
    document.getElementById("taakForm");

const taakTitel =
    document.getElementById("taakTitel");

const taakCategorie =
    document.getElementById("taakCategorie");

const taakDatum =
    document.getElementById("taakDatum");

const taakNotitie =
    document.getElementById("taakNotitie");

const taakSubtaken =
    document.getElementById("taakSubtaken");

const subtaakToevoegen =
    document.getElementById("subtaakToevoegen");

const terugNaarKeuzes =
    document.getElementById("terugNaarKeuzes");

const taakOpslaan =
    document.getElementById("taakOpslaan");

const ideeScherm =
    document.getElementById("ideeScherm");

const ideeTitel =
    document.getElementById("ideeTitel");

const ideeOpslaan =
    document.getElementById("ideeOpslaan");

const weggooienKnop =
    document.getElementById("weggooienKnop");

const verwerkTaakKnop =
    document.getElementById("verwerkTaakKnop");

const verwerkIdeeKnop =
    document.getElementById("verwerkIdeeKnop");


// ======================================
// INITIALISEREN
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        dataLaden();

        categorieenLaden();

        categorieSelectVullen();

        elementenControleren();

        inboxWeergeven();

        serviceWorkerRegistreren();

        if (snelInput) {
            snelInput.focus();
        }

    }
);


// ======================================
// ELEMENTEN CONTROLEREN
// ======================================

function elementenControleren() {

    const belangrijkeElementen = [

        ["snelToevoegenForm", snelToevoegenForm],
        ["snelInput", snelInput],
        ["inboxLijst", inboxLijst],
        ["verwerkModal", verwerkModal],
        ["modalSluiten", modalSluiten]

    ];


    belangrijkeElementen.forEach(
        ([naam, element]) => {

            if (!element) {

                console.warn(
                    `Lucy: element #${naam} ontbreekt in index.html`
                );

            }

        }
    );

}


// ======================================
// DATA LADEN
// ======================================

function dataLaden() {

    try {

        const opgeslagenInbox =
            localStorage.getItem(
                OPSLAG_INBOX
            );

        const opgeslagenTaken =
            localStorage.getItem(
                OPSLAG_TAKEN
            );

        const opgeslagenIdeeen =
            localStorage.getItem(
                OPSLAG_IDEEEN
            );


        if (opgeslagenInbox) {

            const data =
                JSON.parse(
                    opgeslagenInbox
                );

            if (Array.isArray(data)) {

                inbox =
                    inboxNormaliseren(data);

            }

        }


        if (opgeslagenTaken) {

            const data =
                JSON.parse(
                    opgeslagenTaken
                );

            if (Array.isArray(data)) {

                taken =
                    takenNormaliseren(data);

            }

        }


        if (opgeslagenIdeeen) {

            const data =
                JSON.parse(
                    opgeslagenIdeeen
                );

            if (Array.isArray(data)) {

                ideeen =
                    ideeenNormaliseren(data);

            }

        }

    } catch (fout) {

        console.error(
            "Lucy kon de gegevens niet laden:",
            fout
        );

        inbox = [];
        taken = [];
        ideeen = [];

    }

}


// ======================================
// INBOX NORMALISEREN
// ======================================

function inboxNormaliseren(data) {

    return data.map(
        item => {

            return {

                id:
                    item.id ||
                    maakId(),

                tekst:
                    item.tekst ||
                    item.titel ||
                    "",

                aangemaakt:
                    item.aangemaakt ||
                    new Date().toISOString()

            };

        }
    );

}


// ======================================
// TAKEN NORMALISEREN
// ======================================

function takenNormaliseren(data) {

    return data.map(
        taak => {

            return {

                id:
                    taak.id ||
                    maakId(),

                titel:
                    taak.titel ||
                    "",

                categorie:
                    taak.categorie ||
                    "",

                datum:
                    taak.datum ||
                    "",

                notitie:
                    taak.notitie ||
                    "",

                subtaken:
                    subtakenNormaliseren(
                        taak.subtaken
                    ),

                afgerond:
                    taak.afgerond === true,

                aangemaakt:
                    taak.aangemaakt ||
                    new Date().toISOString(),

                gewijzigd:
                    taak.gewijzigd ||
                    new Date().toISOString()

            };

        }
    );

}


// ======================================
// IDEEËN NORMALISEREN
// ======================================

function ideeenNormaliseren(data) {

    return data.map(
        idee => {

            return {

                id:
                    idee.id ||
                    maakId(),

                tekst:
                    idee.tekst ||
                    idee.titel ||
                    "",

                aangemaakt:
                    idee.aangemaakt ||
                    new Date().toISOString()

            };

        }
    );

}


// ======================================
// SUBTAKEN NORMALISEREN
// ======================================

function subtakenNormaliseren(subtaken) {

    if (!Array.isArray(subtaken)) {
        return [];
    }


    return subtaken
        .map(
            subtaak => {

                if (
                    typeof subtaak ===
                    "string"
                ) {

                    return {

                        id: maakId(),

                        titel: subtaak,

                        afgerond: false

                    };

                }


                return {

                    id:
                        subtaak.id ||
                        maakId(),

                    titel:
                        subtaak.titel ||
                        "",

                    afgerond:
                        subtaak.afgerond === true

                };

            }
        )
        .filter(
            subtaak =>
                subtaak.titel !== ""
        );

}


// ======================================
// DATA OPSLAAN
// ======================================

function dataOpslaan() {

    localStorage.setItem(
        OPSLAG_INBOX,
        JSON.stringify(inbox)
    );

    localStorage.setItem(
        OPSLAG_TAKEN,
        JSON.stringify(taken)
    );

    localStorage.setItem(
        OPSLAG_IDEEEN,
        JSON.stringify(ideeen)
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
// SNEL TOEVOEGEN
// ======================================
// Dit is de belangrijkste functie van Lucy.
//
// Alles wat in je hoofd zit mag hier
// direct worden neergezet.
//
// Geen categorie.
// Geen keuze.
// Geen nadenken.
//
// ======================================

if (snelToevoegenForm) {

    snelToevoegenForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const tekst =
                snelInput.value.trim();


            if (!tekst) {

                snelInput.focus();

                return;

            }


            inbox.unshift({

                id: maakId(),

                tekst: tekst,

                aangemaakt:
                    new Date().toISOString()

            });


            dataOpslaan();


            snelInput.value = "";


            inboxWeergeven();


            snelInput.focus();

        }
    );

}


// ======================================
// INBOX WEERGEVEN
// ======================================

function inboxWeergeven() {

    if (!inboxLijst) {
        return;
    }


    inboxLijst.innerHTML = "";


    if (
        legeInbox
    ) {

        legeInbox.hidden =
            inbox.length !== 0;

    }


    inbox.forEach(
        item => {

            const kaart =
                document.createElement(
                    "article"
                );


            kaart.className =
                "inbox-kaart";


            const tekst =
                document.createElement(
                    "div"
                );


            tekst.className =
                "inbox-tekst";


            tekst.textContent =
                item.tekst;


            const datum =
                document.createElement(
                    "small"
                );


            datum.className =
                "inbox-datum";


            datum.textContent =
                datumTijdMooi(
                    item.aangemaakt
                );


            const knop =
                document.createElement(
                    "button"
                );


            knop.type =
                "button";


            knop.className =
                "inbox-verwerk-knop";


            knop.textContent =
                "⚡ Verwerken";


            knop.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    verwerkingOpenen(
                        item.id
                    );

                }
            );


            kaart.appendChild(
                tekst
            );

            kaart.appendChild(
                datum
            );

            kaart.appendChild(
                knop
            );


            inboxLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// VERWERKEN OPENEN
// ======================================

function verwerkingOpenen(id) {

    const item =
        inbox.find(
            inboxItem =>
                inboxItem.id === id
        );


    if (!item) {
        return;
    }


    huidigInboxId =
        id;


    // Zet de tekst alvast klaar.

    if (taakTitel) {

        taakTitel.value =
            item.tekst;

    }


    if (ideeTitel) {

        ideeTitel.value =
            item.tekst;

    }


    keuzeSchermTonen();


    if (verwerkModal) {

        verwerkModal.hidden =
            false;

        verwerkModal.classList.add(
            "open"
        );

    }


    document.body.style.overflow =
        "hidden";

}


// ======================================
// KEUZESCHERM TONEN
// ======================================

function keuzeSchermTonen() {

    if (verwerkKeuzeScherm) {

        verwerkKeuzeScherm.hidden =
            false;

    }


    if (taakScherm) {

        taakScherm.hidden =
            true;

    }


    if (ideeScherm) {

        ideeScherm.hidden =
            true;

    }

}


// ======================================
// TAAKSCHERM TONEN
// ======================================

function taakSchermTonen() {

    if (verwerkKeuzeScherm) {

        verwerkKeuzeScherm.hidden =
            true;

    }


    if (taakScherm) {

        taakScherm.hidden =
            false;

    }


    if (ideeScherm) {

        ideeScherm.hidden =
            true;

    }


    if (taakTitel) {

        taakTitel.focus();

    }

}


// ======================================
// IDEESCHERM TONEN
// ======================================

function ideeSchermTonen() {

    if (verwerkKeuzeScherm) {

        verwerkKeuzeScherm.hidden =
            true;

    }


    if (taakScherm) {

        taakScherm.hidden =
            true;

    }


    if (ideeScherm) {

        ideeScherm.hidden =
            false;

    }


    if (ideeTitel) {

        ideeTitel.focus();

    }

}


// ======================================
// MODAL SLUITEN
// ======================================

function modalSluitenFunctie() {

    if (verwerkModal) {

        verwerkModal.hidden =
            true;

        verwerkModal.classList.remove(
            "open"
        );

    }


    document.body.style.overflow =
        "";


    huidigInboxId =
        null;


    keuzeSchermTonen();

}


// ======================================
// KRUISJE
// ======================================

if (modalSluiten) {

    modalSluiten.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            modalSluitenFunctie();

        }
    );

}


// ======================================
// KLIK BUITEN MODAL
// ======================================

if (verwerkModal) {

    verwerkModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                verwerkModal
            ) {

                modalSluitenFunctie();

            }

        }
    );

}


// ======================================
// ESCAPE
// ======================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            verwerkModal &&
            !verwerkModal.hidden
        ) {

            modalSluitenFunctie();

        }

    }
);


// ======================================
// TAAK KIEZEN
// ======================================

if (verwerkTaakKnop) {

    verwerkTaakKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            taakSchermTonen();

        }
    );

}


// ======================================
// IDEE KIEZEN
// ======================================

if (verwerkIdeeKnop) {

    verwerkIdeeKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            ideeSchermTonen();

        }
    );

}


// ======================================
// WEGGOOIEN
// ======================================

if (weggooienKnop) {

    weggooienKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!huidigInboxId) {
                return;
            }


            inbox =
                inbox.filter(
                    item =>
                        item.id !==
                        huidigInboxId
                );


            dataOpslaan();


            modalSluitenFunctie();


            inboxWeergeven();

        }
    );

}


// ======================================
// TAAK OPSLAAN
// ======================================

if (taakForm) {

    taakForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!huidigInboxId) {
                return;
            }


            const titel =
                taakTitel
                    ? taakTitel.value.trim()
                    : "";


            if (!titel) {

                if (taakTitel) {
                    taakTitel.focus();
                }

                return;

            }


            const nieuweTaak = {

                id: maakId(),

                titel: titel,

                categorie:
                    taakCategorie
                        ? taakCategorie.value
                        : "",

                datum:
                    taakDatum
                        ? taakDatum.value
                        : "",

                notitie:
                    taakNotitie
                        ? taakNotitie.value.trim()
                        : "",

                subtaken:
                    subtakenUitFormulier(),

                afgerond: false,

                aangemaakt:
                    new Date().toISOString(),

                gewijzigd:
                    new Date().toISOString()

            };


            taken.unshift(
                nieuweTaak
            );


            inbox =
                inbox.filter(
                    item =>
                        item.id !==
                        huidigInboxId
                );


            dataOpslaan();


            modalSluitenFunctie();


            inboxWeergeven();

        }
    );

}


// ======================================
// IDEE OPSLAAN
// ======================================

if (ideeOpslaan) {

    ideeOpslaan.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!huidigInboxId) {
                return;
            }


            const tekst =
                ideeTitel
                    ? ideeTitel.value.trim()
                    : "";


            if (!tekst) {

                if (ideeTitel) {
                    ideeTitel.focus();
                }

                return;

            }


            ideeen.unshift({

                id: maakId(),

                tekst: tekst,

                aangemaakt:
                    new Date().toISOString()

            });


            inbox =
                inbox.filter(
                    item =>
                        item.id !==
                        huidigInboxId
                );


            dataOpslaan();


            modalSluitenFunctie();


            inboxWeergeven();

        }
    );

}


// ======================================
// TERUG NAAR KEUZES
// ======================================

if (terugNaarKeuzes) {

    terugNaarKeuzes.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            keuzeSchermTonen();

        }
    );

}


// ======================================
// SUBTAKEN TOEVOEGEN
// ======================================

if (subtaakToevoegen) {

    subtaakToevoegen.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!taakSubtaken) {
                return;
            }


            const regel =
                document.createElement(
                    "div"
                );


            regel.className =
                "subtaak-regel";


            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";

            input.className =
                "subtaak-input";

            input.placeholder =
                "Kleine opdracht...";


            const verwijderen =
                document.createElement(
                    "button"
                );


            verwijderen.type =
                "button";

            verwijderen.className =
                "subtaak-verwijder";

            verwijderen.textContent =
                "✕";


            verwijderen.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    regel.remove();

                }
            );


            regel.appendChild(
                input
            );

            regel.appendChild(
                verwijderen
            );


            taakSubtaken.appendChild(
                regel
            );


            input.focus();

        }
    );

}


// ======================================
// SUBTAKEN UIT FORMULIER
// ======================================

function subtakenUitFormulier() {

    if (!taakSubtaken) {
        return [];
    }


    const regels =
        taakSubtaken.querySelectorAll(
            ".subtaak-regel"
        );


    return Array.from(regels)
        .map(
            regel => {

                const input =
                    regel.querySelector(
                        ".subtaak-input"
                    );


                return {

                    id: maakId(),

                    titel:
                        input
                            ? input.value.trim()
                            : "",

                    afgerond: false

                };

            }
        )
        .filter(
            subtaak =>
                subtaak.titel !== ""
        );

}


// ======================================
// CATEGORIEËN
// ======================================

function categorieenLaden() {

    let categorieen = [];


    try {

        const opgeslagen =
            localStorage.getItem(
                OPSLAG_CATEGORIEEN
            );


        if (opgeslagen) {

            categorieen =
                JSON.parse(
                    opgeslagen
                );

        }

    } catch (fout) {

        console.error(
            "Categorieën konden niet worden geladen:",
            fout
        );

    }


    if (!Array.isArray(categorieen)) {

        categorieen =
            [
                ...STANDAARD_CATEGORIEEN
            ];

    }


    STANDAARD_CATEGORIEEN.forEach(
        categorie => {

            if (
                !categorieen.includes(
                    categorie
                )
            ) {

                categorieen.push(
                    categorie
                );

            }

        }
    );


    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
    );

}


// ======================================
// CATEGORIE SELECT
// ======================================

function categorieSelectVullen() {

    if (!taakCategorie) {
        return;
    }


    taakCategorie.innerHTML =
        "";


    const leeg =
        document.createElement(
            "option"
        );


    leeg.value =
        "";


    leeg.textContent =
        "Geen categorie";


    taakCategorie.appendChild(
        leeg
    );


    let categorieen =
        STANDAARD_CATEGORIEEN;


    try {

        categorieen =
            JSON.parse(
                localStorage.getItem(
                    OPSLAG_CATEGORIEEN
                )
            ) ||
            STANDAARD_CATEGORIEEN;

    } catch (fout) {

        console.warn(
            fout
        );

    }


    categorieen.forEach(
        categorie => {

            const optie =
                document.createElement(
                    "option"
                );


            optie.value =
                categorie;


            optie.textContent =
                categorieIcoon(
                    categorie
                ) +
                " " +
                categorie;


            taakCategorie.appendChild(
                optie
            );

        }
    );

}


// ======================================
// CATEGORIE ICONEN
// ======================================

function categorieIcoon(categorie) {

    const iconen = {

        "Sociaal":
            "👥",

        "Administratie":
            "📋",

        "Klussen":
            "🔨",

        "Financiën":
            "💰",

        "Huis":
            "🏠",

        "Auto":
            "🚗",

        "Boodschappen":
            "🛒",

        "Afspraken":
            "📅",

        "Ideeën":
            "💡",

        "Franciska (terwille)":
            "🤝",

        "ADHD/Autisme":
            "🧠",

        "Overig":
            "📦"

    };


    return (
        iconen[categorie] ||
        "📁"
    );

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
// SERVICE WORKER
// ======================================

function serviceWorkerRegistreren() {

    if (
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "sw.js"
                )
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
