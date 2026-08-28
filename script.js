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

const verwerkLijst =
    document.getElementById("verwerkLijst");

const legeVerwerkLijst =
    document.getElementById("legeVerwerkLijst");

const verwerkModal =
    document.getElementById("verwerkModal");

const modalSluiten =
    document.getElementById("modalSluiten");

const verwerkItemTekst =
    document.getElementById("verwerkItemTekst");


// Verwerk-keuzes
const maakTaakKnop =
    document.getElementById("maakTaakKnop");

const maakIdeeKnop =
    document.getElementById("maakIdeeKnop");

const verwijderInboxKnop =
    document.getElementById("verwijderInboxKnop");


// Taakformulier
const taakForm =
    document.getElementById("taakForm");

const bewerkTitel =
    document.getElementById("bewerkTitel");

const categorieSelect =
    document.getElementById("categorieSelect");

const taakDatum =
    document.getElementById("datumSelect");

const notitieInput =
    document.getElementById("notitieInput");

const labelSelect =
    document.getElementById("labelSelect");

const subtakenLijst =
    document.getElementById("subtakenLijst");

const subtaakToevoegenKnop =
    document.getElementById("subtaakToevoegenKnop");

const taakAnnulerenKnop =
    document.getElementById("taakAnnulerenKnop");


// Idee
const ideeScherm =
    document.getElementById("ideeScherm");

const ideeTitel =
    document.getElementById("ideeTitel");

const ideeOpslaan =
    document.getElementById("ideeOpslaan");


// Vandaag
const vandaagLijst =
    document.getElementById("vandaagLijst");

const legeVandaag =
    document.getElementById("legeVandaag");

const datumVandaag =
    document.getElementById("datumVandaag");


// Ideeën
const ideeenLijst =
    document.getElementById("ideeenLijst");

const legeIdeeen =
    document.getElementById("legeIdeeen");


// Categorieën
const categorieLijst =
    document.getElementById("categorieLijst");


// Instellingen
const instellingenKnop =
    document.getElementById("instellingenKnop");

const backupKnop =
    document.getElementById("backupKnop");

const backupInput =
    document.getElementById("backupInput");

const allesWissenKnop =
    document.getElementById("allesWissenKnop");


// ======================================
// INITIALISEREN
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        dataLaden();

        categorieenLaden();

        categorieSelectVullen();

        navigatieInstellen();

        datumVandaagInstellen();

        lijstenVernieuwen();

        serviceWorkerRegistreren();

        if (snelInput) {
            snelInput.focus();
        }

    }
);


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
// DATA NORMALISEREN
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

                label:
                    taak.label ||
                    "",

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
// Hier hoeft de gebruiker NIETS te kiezen.
// Gewoon schrijven en verder.
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
// NAVIGATIE
// ======================================

function navigatieInstellen() {

    document
        .querySelectorAll(".nav-knop")
        .forEach(
            knop => {

                knop.addEventListener(
                    "click",
                    () => {

                        const pagina =
                            knop.dataset.pagina;

                        paginaOpenen(
                            pagina
                        );

                    }
                );

            }
        );


    if (instellingenKnop) {

        instellingenKnop.addEventListener(
            "click",
            () => {

                paginaOpenen(
                    "paginaInstellingen"
                );

            }
        );

    }

}


function paginaOpenen(paginaId) {

    document
        .querySelectorAll(".pagina")
        .forEach(
            pagina => {

                pagina.classList.remove(
                    "actief"
                );

            }
        );


    const pagina =
        document.getElementById(
            paginaId
        );


    if (!pagina) {
        return;
    }


    pagina.classList.add(
        "actief"
    );


    document
        .querySelectorAll(".nav-knop")
        .forEach(
            knop => {

                knop.classList.toggle(
                    "actief",
                    knop.dataset.pagina ===
                    paginaId
                );

            }
        );


    if (
        paginaId ===
        "paginaVerwerken"
    ) {

        inboxWeergeven();

    }


    if (
        paginaId ===
        "paginaVandaag"
    ) {

        vandaagWeergeven();

    }


    if (
        paginaId ===
        "paginaIdeeen"
    ) {

        ideeenWeergeven();

    }


    if (
        paginaId ===
        "paginaCategorieen"
    ) {

        categorieenWeergeven();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================
// LIJSTEN VERNIEUWEN
// ======================================

function lijstenVernieuwen() {

    inboxWeergeven();

    vandaagWeergeven();

    ideeenWeergeven();

    categorieenWeergeven();

}


// ======================================
// INBOX / VERWERKEN
// ======================================

function inboxWeergeven() {

    if (!verwerkLijst) {
        return;
    }


    verwerkLijst.innerHTML = "";


    if (legeVerwerkLijst) {

        legeVerwerkLijst.classList.toggle(
            "zichtbaar",
            inbox.length === 0
        );

    }


    inbox.forEach(
        item => {

            const kaart =
                document.createElement(
                    "article"
                );

            kaart.className =
                "verwerk-kaart";


            const tekst =
                document.createElement(
                    "div"
                );

            tekst.className =
                "verwerk-kaart-tekst";

            tekst.textContent =
                item.tekst;


            const datum =
                document.createElement(
                    "small"
                );

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
                "verwerk-knop";

            knop.textContent =
                "⚡ Verwerken";


            knop.addEventListener(
                "click",
                event => {

                    event.preventDefault();

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


            verwerkLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// VERWERKING OPENEN
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


    if (verwerkItemTekst) {

        verwerkItemTekst.textContent =
            item.tekst;

    }


    if (bewerkTitel) {

        bewerkTitel.value =
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
// KEUZESCHERM
// ======================================

function keuzeSchermTonen() {

    const keuzes =
        document.querySelector(
            ".verwerk-keuzes"
        );


    if (keuzes) {
        keuzes.hidden = false;
    }


    if (taakForm) {
        taakForm.hidden = true;
    }


    if (ideeScherm) {
        ideeScherm.hidden = true;
    }

}


// ======================================
// TAAKSCHERM
// ======================================

function taakSchermTonen() {

    const keuzes =
        document.querySelector(
            ".verwerk-keuzes"
        );


    if (keuzes) {
        keuzes.hidden = true;
    }


    if (taakForm) {

        taakForm.hidden =
            false;

    }


    if (ideeScherm) {

        ideeScherm.hidden =
            true;

    }


    if (bewerkTitel) {

        bewerkTitel.focus();

    }

}


// ======================================
// IDEESCHERM
// ======================================

function ideeSchermTonen() {

    const keuzes =
        document.querySelector(
            ".verwerk-keuzes"
        );


    if (keuzes) {
        keuzes.hidden = true;
    }


    if (taakForm) {

        taakForm.hidden =
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

if (maakTaakKnop) {

    maakTaakKnop.addEventListener(
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

if (maakIdeeKnop) {

    maakIdeeKnop.addEventListener(
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

if (verwijderInboxKnop) {

    verwijderInboxKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!huidigInboxId) {
                return;
            }


            const akkoord =
                confirm(
                    "Deze invoer weggooien?"
                );


            if (!akkoord) {
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
                bewerkTitel
                    ? bewerkTitel.value.trim()
                    : "";


            if (!titel) {

                if (bewerkTitel) {
                    bewerkTitel.focus();
                }

                return;

            }


            const nieuweTaak = {

                id: maakId(),

                titel: titel,

                categorie:
                    categorieSelect
                        ? categorieSelect.value
                        : "",

                datum:
                    taakDatum
                        ? taakDatum.value
                        : "",

                notitie:
                    notitieInput
                        ? notitieInput.value.trim()
                        : "",

                subtaken:
                    subtakenUitFormulier(),

                label:
                    labelSelect
                        ? labelSelect.value
                        : "",

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


            lijstenVernieuwen();

        }
    );

}


// ======================================
// TAAK ANNULEREN
// ======================================

if (taakAnnulerenKnop) {

    taakAnnulerenKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            keuzeSchermTonen();

        }
    );

}


// ======================================
// LABEL KIEZEN
// ======================================

document
    .querySelectorAll(".keuze-knop")
    .forEach(
        knop => {

            knop.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const label =
                        knop.dataset.label;


                    if (labelSelect) {

                        labelSelect.value =
                            label;

                    }


                    document
                        .querySelectorAll(
                            ".keuze-knop"
                        )
                        .forEach(
                            item => {

                                item.classList.toggle(
                                    "geselecteerd",
                                    item === knop
                                );

                            }
                        );

                }
            );

        }
    );


// ======================================
// SUBTAKEN TOEVOEGEN
// ======================================

if (subtaakToevoegenKnop) {

    subtaakToevoegenKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


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


            if (subtakenLijst) {

                subtakenLijst.appendChild(
                    regel
                );

            }


            input.focus();

        }
    );

}


// ======================================
// SUBTAKEN UIT FORMULIER
// ======================================

function subtakenUitFormulier() {

    if (!subtakenLijst) {
        return [];
    }


    const regels =
        subtakenLijst.querySelectorAll(
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


            lijstenVernieuwen();

        }
    );

}


// ======================================
// IDEEËN WEERGEVEN
// ======================================

function ideeenWeergeven() {

    if (!ideeenLijst) {
        return;
    }


    ideeenLijst.innerHTML =
        "";


    if (legeIdeeen) {

        legeIdeeen.classList.toggle(
            "zichtbaar",
            ideeen.length === 0
        );

    }


    ideeen.forEach(
        idee => {

            const kaart =
                document.createElement(
                    "article"
                );

            kaart.className =
                "idee-kaart";


            const tekst =
                document.createElement(
                    "p"
                );

            tekst.textContent =
                idee.tekst;


            const datum =
                document.createElement(
                    "small"
                );

            datum.textContent =
                datumTijdMooi(
                    idee.aangemaakt
                );


            const verwijderen =
                document.createElement(
                    "button"
                );

            verwijderen.type =
                "button";

            verwijderen.className =
                "kleine-verwijder-knop";

            verwijderen.textContent =
                "✕";


            verwijderen.setAttribute(
                "aria-label",
                "Idee verwijderen"
            );


            verwijderen.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    ideeen =
                        ideeen.filter(
                            item =>
                                item.id !==
                                idee.id
                        );


                    dataOpslaan();

                    ideeenWeergeven();

                }
            );


            kaart.appendChild(
                tekst
            );

            kaart.appendChild(
                datum
            );

            kaart.appendChild(
                verwijderen
            );


            ideeenLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// VANDAAG
// ======================================

function datumVandaagInstellen() {

    if (!datumVandaag) {
        return;
    }


    datumVandaag.textContent =
        new Date().toLocaleDateString(
            "nl-NL",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

}


function vandaagWeergeven() {

    if (!vandaagLijst) {
        return;
    }


    vandaagLijst.innerHTML =
        "";


    const vandaag =
        datumNaarString(
            new Date()
        );


    const vandaagTaken =
        taken.filter(
            taak =>
                !taak.afgerond &&
                taak.datum === vandaag
        );


    if (legeVandaag) {

        legeVandaag.classList.toggle(
            "zichtbaar",
            vandaagTaken.length === 0
        );

    }


    vandaagTaken.forEach(
        taak => {

            vandaagLijst.appendChild(
                taakKaartMaken(
                    taak
                )
            );

        }
    );

}


// ======================================
// TAAKKAART
// ======================================

function taakKaartMaken(taak) {

    const kaart =
        document.createElement(
            "article"
        );

    kaart.className =
        "taak-kaart";


    const check =
        document.createElement(
            "button"
        );

    check.type =
        "button";

    check.className =
        "taak-check";

    check.textContent =
        "✓";


    check.setAttribute(
        "aria-label",
        "Taak afronden"
    );


    check.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            taak.afgerond =
                true;


            taak.gewijzigd =
                new Date().toISOString();


            dataOpslaan();


            lijstenVernieuwen();

        }
    );


    const inhoud =
        document.createElement(
            "div"
        );

    inhoud.className =
        "taak-inhoud";


    const titel =
        document.createElement(
            "h3"
        );

    titel.textContent =
        taak.titel;


    const meta =
        document.createElement(
            "div"
        );

    meta.className =
        "taak-meta";


    if (taak.categorie) {

        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            "badge";

        badge.textContent =
            categorieIcoon(
                taak.categorie
            ) +
            " " +
            taak.categorie;

        meta.appendChild(
            badge
        );

    }


    if (taak.datum) {

        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            "badge";

        badge.textContent =
            "📅 " +
            datumKort(
                taak.datum
            );

        meta.appendChild(
            badge
        );

    }


    if (taak.label) {

        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            "badge " +
            taak.label;

        badge.textContent =
            labelTekst(
                taak.label
            );

        meta.appendChild(
            badge
        );

    }


    inhoud.appendChild(
        titel
    );

    inhoud.appendChild(
        meta
    );


    const subtaken =
        taak.subtaken || [];


    if (subtaken.length > 0) {

        const klaar =
            subtaken.filter(
                subtaak =>
                    subtaak.afgerond
            ).length;


        const mini =
            document.createElement(
                "div"
            );

        mini.className =
            "subtaken-mini";

        mini.textContent =
            "☑ " +
            klaar +
            "/" +
            subtaken.length +
            " subtaken";


        inhoud.appendChild(
            mini
        );

    }


    kaart.appendChild(
        check
    );

    kaart.appendChild(
        inhoud
    );


    return kaart;

}


// ======================================
// LABEL TEKST
// ======================================

function labelTekst(label) {

    if (label === "nu") {
        return "🔴 Nu";
    }

    if (label === "later") {
        return "🟠 Later";
    }

    if (label === "bewaren") {
        return "🔵 Bewaren";
    }

    return label;

}


// ======================================
// CATEGORIEËN LADEN
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

        console.warn(
            "Categorieën konden niet worden geladen:",
            fout
        );

    }


    if (!Array.isArray(categorieen)) {

        categorieen =
            [...STANDAARD_CATEGORIEEN];

    }


    // Oude dubbele varianten opruimen.
    categorieen =
        categorieen.filter(
            (categorie, index, lijst) =>
                lijst.indexOf(categorie) === index
        );


    // Eventuele oude schrijfwijzen
    // omzetten naar de huidige namen.

    categorieen =
        categorieen.map(
            categorie => {

                if (
                    categorie ===
                    "Franciska (Terwille)"
                ) {
                    return "Franciska (terwille)";
                }

                if (
                    categorie ===
                    "ADHD / Autisme"
                ) {
                    return "ADHD/Autisme";
                }

                return categorie;

            }
        );


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


    // Nog één keer dubbele waarden verwijderen.

    categorieen =
        categorieen.filter(
            (categorie, index, lijst) =>
                lijst.indexOf(categorie) === index
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

    if (!categorieSelect) {
        return;
    }


    categorieSelect.innerHTML =
        "";


    const leeg =
        document.createElement(
            "option"
        );

    leeg.value =
        "";

    leeg.textContent =
        "Geen categorie";


    categorieSelect.appendChild(
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


            categorieSelect.appendChild(
                optie
            );

        }
    );

}


// ======================================
// CATEGORIEËN WEERGEVEN
// ======================================

function categorieenWeergeven() {

    if (!categorieLijst) {
        return;
    }


    categorieLijst.innerHTML =
        "";


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

            const aantal =
                taken.filter(
                    taak =>
                        !taak.afgerond &&
                        taak.categorie ===
                        categorie
                ).length;


            const kaart =
                document.createElement(
                    "div"
                );

            kaart.className =
                "categorie-kaart";


            const icoon =
                document.createElement(
                    "div"
                );

            icoon.className =
                "categorie-icoon";

            icoon.textContent =
                categorieIcoon(
                    categorie
                );


            const naam =
                document.createElement(
                    "div"
                );

            naam.className =
                "categorie-naam";

            naam.textContent =
                categorie;


            const aantalElement =
                document.createElement(
                    "div"
                );

            aantalElement.className =
                "categorie-aantal";

            aantalElement.textContent =
                aantal +
                (
                    aantal === 1
                        ? " taak"
                        : " taken"
                );


            kaart.appendChild(
                icoon
            );

            kaart.appendChild(
                naam
            );

            kaart.appendChild(
                aantalElement
            );


            categorieLijst.appendChild(
                kaart
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
// BACKUP MAKEN
// ======================================

if (backupKnop) {

    backupKnop.addEventListener(
        "click",
        () => {

            const backup = {

                app:
                    "Lucy",

                versie:
                    "2.0",

                datum:
                    new Date().toISOString(),

                inbox:
                    inbox,

                taken:
                    taken,

                ideeen:
                    ideeen,

                categorieen:
                    JSON.parse(
                        localStorage.getItem(
                            OPSLAG_CATEGORIEEN
                        )
                    ) ||
                    STANDAARD_CATEGORIEEN

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
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "lucy-backup-" +
                datumNaarString(
                    new Date()
                ) +
                ".json";


            link.click();


            URL.revokeObjectURL(
                url
            );

        }
    );

}


// ======================================
// BACKUP TERUGZETTEN
// ======================================

if (backupInput) {

    backupInput.addEventListener(
        "change",
        event => {

            const bestand =
                event.target.files[0];


            if (!bestand) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    try {

                        const backup =
                            JSON.parse(
                                reader.result
                            );


                        if (
                            !backup ||
                            !Array.isArray(
                                backup.taken
                            )
                        ) {

                            throw new Error(
                                "Ongeldige backup."
                            );

                        }


                        const akkoord =
                            confirm(
                                "De huidige gegevens worden vervangen door deze backup. Doorgaan?"
                            );


                        if (!akkoord) {
                            return;
                        }


                        inbox =
                            Array.isArray(
                                backup.inbox
                            )
                                ? inboxNormaliseren(
                                    backup.inbox
                                )
                                : [];


                        taken =
                            takenNormaliseren(
                                backup.taken
                            );


                        ideeen =
                            Array.isArray(
                                backup.ideeen
                            )
                                ? ideeenNormaliseren(
                                    backup.ideeen
                                )
                                : [];


                        if (
                            Array.isArray(
                                backup.categorieen
                            )
                        ) {

                            localStorage.setItem(
                                OPSLAG_CATEGORIEEN,
                                JSON.stringify(
                                    backup.categorieen
                                )
                            );

                        }


                        categorieenLaden();

                        categorieSelectVullen();

                        dataOpslaan();

                        lijstenVernieuwen();


                        alert(
                            "Backup succesvol teruggezet."
                        );


                    } catch (fout) {

                        console.error(
                            fout
                        );


                        alert(
                            "Deze backup kon niet worden teruggezet."
                        );

                    }

                };


            reader.readAsText(
                bestand
            );


            event.target.value =
                "";

        }
    );

}


// ======================================
// ALLES WISSEN
// ======================================

if (allesWissenKnop) {

    allesWissenKnop.addEventListener(
        "click",
        () => {

            const eersteVraag =
                confirm(
                    "Weet je zeker dat je ALLE gegevens van Lucy wilt verwijderen?"
                );


            if (!eersteVraag) {
                return;
            }


            const tweedeVraag =
                confirm(
                    "Dit kan niet automatisch worden teruggedraaid. Echt alles wissen?"
                );


            if (!tweedeVraag) {
                return;
            }


            localStorage.removeItem(
                OPSLAG_INBOX
            );

            localStorage.removeItem(
                OPSLAG_TAKEN
            );

            localStorage.removeItem(
                OPSLAG_IDEEEN
            );


            inbox = [];

            taken = [];

            ideeen = [];


            lijstenVernieuwen();


            alert(
                "Lucy is weer helemaal leeg."
            );

        }
    );

}


// ======================================
// DATUM
// ======================================

function datumNaarString(datum) {

    const jaar =
        datum.getFullYear();


    const maand =
        String(
            datum.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dag =
        String(
            datum.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        jaar +
        "-" +
        maand +
        "-" +
        dag
    );

}


function datumKort(datum) {

    if (!datum) {
        return "";
    }


    const delen =
        datum.split("-");


    if (delen.length !== 3) {
        return datum;
    }


    return (
        delen[2] +
        "-" +
        delen[1]
    );

}


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



