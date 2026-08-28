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
// DATA
// ======================================

let inbox = [];
let taken = [];
let ideeen = [];
let categorieen = [];


// ======================================
// ACTIEVE VERWERKING
// ======================================

let huidigInboxId = null;


// ======================================
// ACTIEVE CATEGORIE
// ======================================

let actieveCategorie = null;


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

const verwerkLijst =
    document.getElementById("verwerkLijst");

const legeVerwerkLijst =
    document.getElementById("legeVerwerkLijst");

const verwerkModal =
    document.getElementById("verwerkModal");

const modalSluiten =
    document.getElementById("modalSluiten");

const verwerkKeuzeScherm =
    document.getElementById("verwerkKeuzeScherm");

const taakForm =
    document.getElementById("taakForm");

const taakTitel =
    document.getElementById("bewerkTitel");

const taakCategorie =
    document.getElementById("categorieSelect");

const taakDatum =
    document.getElementById("datumSelect");

const taakNotitie =
    document.getElementById("notitieInput");

const taakSubtaken =
    document.getElementById("subtakenLijst");

const subtaakToevoegen =
    document.getElementById("subtaakToevoegenKnop");

const terugNaarKeuzes =
    document.getElementById("terugNaarKeuzes");

const ideeScherm =
    document.getElementById("ideeScherm");

const ideeTitel =
    document.getElementById("ideeTitel");

const ideeOpslaan =
    document.getElementById("ideeOpslaan");

const maakTaakKnop =
    document.getElementById("maakTaakKnop");

const maakIdeeKnop =
    document.getElementById("maakIdeeKnop");

const verwijderInboxKnop =
    document.getElementById("verwijderInboxKnop");

const verwerkItemTekst =
    document.getElementById("verwerkItemTekst");

const taakAnnulerenKnop =
    document.getElementById("taakAnnulerenKnop");

const paginaHoofd =
    document.getElementById("paginaHoofd");

const paginaVerwerken =
    document.getElementById("paginaVerwerken");

const paginaVandaag =
    document.getElementById("paginaVandaag");

const paginaIdeeen =
    document.getElementById("paginaIdeeen");

const paginaCategorieen =
    document.getElementById("paginaCategorieen");

const paginaInstellingen =
    document.getElementById("paginaInstellingen");

const vandaagLijst =
    document.getElementById("vandaagLijst");

const legeVandaag =
    document.getElementById("legeVandaag");

const datumVandaag =
    document.getElementById("datumVandaag");

const ideeenLijst =
    document.getElementById("ideeenLijst");

const legeIdeeen =
    document.getElementById("legeIdeeen");

const categorieLijst =
    document.getElementById("categorieLijst");

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

        elementenControleren();

        paginaOpenen("paginaHoofd");

        modalSluitenZonderTerugkeer();

        document.body.style.overflow = "";

        inboxWeergeven();

        verwerkLijstWeergeven();

        vandaagWeergeven();

        ideeenWeergeven();

        categorieenWeergeven();

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
        ["verwerkModal", verwerkModal],
        ["modalSluiten", modalSluiten],
        ["maakTaakKnop", maakTaakKnop],
        ["maakIdeeKnop", maakIdeeKnop],
        ["verwijderInboxKnop", verwijderInboxKnop]

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
            localStorage.getItem(OPSLAG_INBOX);

        const opgeslagenTaken =
            localStorage.getItem(OPSLAG_TAKEN);

        const opgeslagenIdeeen =
            localStorage.getItem(OPSLAG_IDEEEN);


        if (opgeslagenInbox) {

            const data =
                JSON.parse(opgeslagenInbox);

            if (Array.isArray(data)) {
                inbox = inboxNormaliseren(data);
            }

        }


        if (opgeslagenTaken) {

            const data =
                JSON.parse(opgeslagenTaken);

            if (Array.isArray(data)) {
                taken = takenNormaliseren(data);
            }

        }


        if (opgeslagenIdeeen) {

            const data =
                JSON.parse(opgeslagenIdeeen);

            if (Array.isArray(data)) {
                ideeen = ideeenNormaliseren(data);
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

                categorie:
                    idee.categorie ||
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
                    typeof subtaak === "string"
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

    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
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
// PAGINA NAVIGATIE
// ======================================

document
    .querySelectorAll(".nav-knop")
    .forEach(
        knop => {

            knop.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const pagina =
                        knop.dataset.pagina;

                    paginaOpenen(pagina);

                }
            );

        }
    );


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


    const gewenstePagina =
        document.getElementById(paginaId);


    if (!gewenstePagina) {
        return;
    }


    gewenstePagina.classList.add(
        "actief"
    );


    document
        .querySelectorAll(".nav-knop")
        .forEach(
            knop => {

                knop.classList.toggle(
                    "actief",
                    knop.dataset.pagina === paginaId
                );

            }
        );


    if (paginaId === "paginaVerwerken") {
        verwerkLijstWeergeven();
    }


    if (paginaId === "paginaVandaag") {
        vandaagWeergeven();
    }


    if (paginaId === "paginaIdeeen") {
        ideeenWeergeven();
    }


    if (paginaId === "paginaCategorieen") {
        categorieenWeergeven();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================
// INSTELLINGEN
// ======================================

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


// ======================================
// SNEL TOEVOEGEN
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

            verwerkLijstWeergeven();

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


    if (legeInbox) {

        legeInbox.hidden =
            inbox.length !== 0;

    }


    inbox.forEach(
        item => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "inbox-kaart";


            const tekst =
                document.createElement("div");

            tekst.className =
                "inbox-tekst";

            tekst.textContent =
                item.tekst;


            const datum =
                document.createElement("small");

            datum.className =
                "inbox-datum";

            datum.textContent =
                datumTijdMooi(item.aangemaakt);


            const knop =
                document.createElement("button");

            knop.type = "button";

            knop.className =
                "inbox-verwerk-knop";

            knop.textContent =
                "⚡ Verwerken";


            knop.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    verwerkingOpenen(item.id);

                }
            );


            kaart.appendChild(tekst);

            kaart.appendChild(datum);

            kaart.appendChild(knop);

            inboxLijst.appendChild(kaart);

        }
    );

}


// ======================================
// VERWERKEN LIJST
// ======================================

function verwerkLijstWeergeven() {

    if (!verwerkLijst) {
        return;
    }


    verwerkLijst.innerHTML = "";


    if (legeVerwerkLijst) {

        legeVerwerkLijst.hidden =
            inbox.length !== 0;

    }


    inbox.forEach(
        item => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "inbox-kaart";


            const tekst =
                document.createElement("div");

            tekst.className =
                "inbox-tekst";

            tekst.textContent =
                item.tekst;


            const datum =
                document.createElement("small");

            datum.className =
                "inbox-datum";

            datum.textContent =
                datumTijdMooi(item.aangemaakt);


            const knop =
                document.createElement("button");

            knop.type = "button";

            knop.className =
                "inbox-verwerk-knop";

            knop.textContent =
                "⚡ Verwerken";


            knop.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    verwerkingOpenen(item.id);

                }
            );


            kaart.appendChild(tekst);

            kaart.appendChild(datum);

            kaart.appendChild(knop);

            verwerkLijst.appendChild(kaart);

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


    huidigInboxId = id;


    if (verwerkItemTekst) {
        verwerkItemTekst.textContent = item.tekst;
    }


    if (taakTitel) {
        taakTitel.value = item.tekst;
    }


    if (ideeTitel) {
        ideeTitel.value = item.tekst;
    }


    if (taakCategorie) {
        taakCategorie.value = "";
    }


    if (taakDatum) {
        taakDatum.value = "";
    }


    if (taakNotitie) {
        taakNotitie.value = "";
    }


    if (taakSubtaken) {
        taakSubtaken.innerHTML = "";
    }


    keuzeSchermTonen();


    if (verwerkModal) {

        verwerkModal.hidden = false;

        verwerkModal.classList.add("open");

    }


    document.body.style.overflow = "hidden";

}


// ======================================
// KEUZESCHERM
// ======================================

function keuzeSchermTonen() {

    if (verwerkKeuzeScherm) {
        verwerkKeuzeScherm.hidden = false;
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

    if (verwerkKeuzeScherm) {
        verwerkKeuzeScherm.hidden = true;
    }


    if (taakForm) {
        taakForm.hidden = false;
    }


    if (ideeScherm) {
        ideeScherm.hidden = true;
    }


    if (taakTitel) {
        taakTitel.focus();
    }

}


// ======================================
// IDEESCHERM
// ======================================

function ideeSchermTonen() {

    if (verwerkKeuzeScherm) {
        verwerkKeuzeScherm.hidden = true;
    }


    if (taakForm) {
        taakForm.hidden = true;
    }


    if (ideeScherm) {
        ideeScherm.hidden = false;
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

        verwerkModal.hidden = true;

        verwerkModal.classList.remove("open");

    }


    document.body.style.overflow = "";

    huidigInboxId = null;

    keuzeSchermTonen();


    paginaOpenen("paginaHoofd");


    if (snelInput) {

        setTimeout(
            () => {
                snelInput.focus();
            },
            100
        );

    }

}


// ======================================
// MODAL INITIEEL SLUITEN
// ======================================

function modalSluitenZonderTerugkeer() {

    if (!verwerkModal) {
        return;
    }


    verwerkModal.hidden = true;

    verwerkModal.classList.remove("open");

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
// BUITEN MODAL KLIKKEN
// ======================================

if (verwerkModal) {

    verwerkModal.addEventListener(
        "click",
        event => {

            if (event.target === verwerkModal) {

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


            inbox =
                inbox.filter(
                    item =>
                        item.id !== huidigInboxId
                );


            dataOpslaan();

            inboxWeergeven();

            verwerkLijstWeergeven();

            modalSluitenFunctie();

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


            const categorie =
                taakCategorie
                    ? taakCategorie.value.trim()
                    : "";


            const nieuweTaak = {

                id: maakId(),

                titel: titel,

                categorie: categorie,

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


            if (
                categorie &&
                !categorieen.includes(categorie)
            ) {

                categorieen.push(categorie);

                categorieenOpslaan();

            }


            taken.unshift(nieuweTaak);


            inbox =
                inbox.filter(
                    item =>
                        item.id !== huidigInboxId
                );


            dataOpslaan();

            inboxWeergeven();

            verwerkLijstWeergeven();

            vandaagWeergeven();

            categorieenWeergeven();

            categorieSelectVullen();


            modalSluitenFunctie();

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

            modalSluitenFunctie();

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

                categorie: "",

                aangemaakt:
                    new Date().toISOString()

            });


            inbox =
                inbox.filter(
                    item =>
                        item.id !== huidigInboxId
                );


            dataOpslaan();

            inboxWeergeven();

            verwerkLijstWeergeven();

            ideeenWeergeven();

            modalSluitenFunctie();

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
                document.createElement("div");

            regel.className =
                "subtaak-regel";


            const input =
                document.createElement("input");

            input.type = "text";

            input.className =
                "subtaak-input";

            input.placeholder =
                "Kleine opdracht...";

            input.autocomplete =
                "off";


            const verwijderen =
                document.createElement("button");

            verwijderen.type = "button";

            verwijderen.className =
                "subtaak-verwijder";

            verwijderen.textContent = "✕";


            verwijderen.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    regel.remove();

                }
            );


            regel.appendChild(input);

            regel.appendChild(verwijderen);

            taakSubtaken.appendChild(regel);

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
// CATEGORIEËN LADEN
// ======================================

function categorieenLaden() {

    try {

        const opgeslagen =
            localStorage.getItem(
                OPSLAG_CATEGORIEEN
            );


        if (opgeslagen) {

            const data =
                JSON.parse(opgeslagen);


            if (Array.isArray(data)) {

                categorieen =
                    data
                        .filter(
                            categorie =>
                                typeof categorie === "string"
                        )
                        .map(
                            categorie =>
                                categorie.trim()
                        )
                        .filter(
                            categorie =>
                                categorie !== ""
                        );

            }

        }

    } catch (fout) {

        console.error(
            "Categorieën konden niet worden geladen:",
            fout
        );

        categorieen = [];

    }


    // ==================================
    // OUDE VASTE CATEGORIEËN NIET MEER
    // AUTOMATISCH TOEVOEGEN
    // ==================================

    categorieen =
        [...new Set(categorieen)];

}


// ======================================
// CATEGORIEËN OPSLAAN
// ======================================

function categorieenOpslaan() {

    categorieen =
        [...new Set(
            categorieen
                .map(
                    categorie =>
                        categorie.trim()
                )
                .filter(
                    categorie =>
                        categorie !== ""
                )
        )];


    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
    );

}


// ======================================
// CATEGORIE SELECT VULLEN
// ======================================

function categorieSelectVullen() {

    if (!taakCategorie) {
        return;
    }


    taakCategorie.innerHTML = "";


    const leeg =
        document.createElement("option");

    leeg.value = "";

    leeg.textContent =
        "Geen categorie";

    taakCategorie.appendChild(leeg);


    categorieen.forEach(
        categorie => {

            const optie =
                document.createElement("option");

            optie.value =
                categorie;

            optie.textContent =
                categorie;

            taakCategorie.appendChild(optie);

        }
    );


    // ==================================
    // NIEUWE CATEGORIE
    // ==================================

    const nieuweCategorie =
        document.createElement("option");

    nieuweCategorie.value =
        "__nieuwe_categorie__";

    nieuweCategorie.textContent =
        "＋ Nieuwe categorie...";

    taakCategorie.appendChild(
        nieuweCategorie
    );

}


// ======================================
// NIEUWE CATEGORIE KIEZEN
// ======================================

if (taakCategorie) {

    taakCategorie.addEventListener(
        "change",
        () => {

            if (
                taakCategorie.value !==
                "__nieuwe_categorie__"
            ) {

                return;

            }


            const nieuweNaam =
                prompt(
                    "Naam van de nieuwe categorie:"
                );


            if (!nieuweNaam) {

                taakCategorie.value = "";

                return;

            }


            const categorie =
                nieuweNaam.trim();


            if (!categorie) {

                taakCategorie.value = "";

                return;

            }


            const bestaandeCategorie =
                categorieen.find(
                    item =>
                        item.toLowerCase() ===
                        categorie.toLowerCase()
                );


            if (bestaandeCategorie) {

                taakCategorie.value =
                    bestaandeCategorie;

                return;

            }


            categorieen.push(categorie);

            categorieenOpslaan();

            categorieSelectVullen();

            taakCategorie.value =
                categorie;

        }
    );

}


// ======================================
// CATEGORIE ICONEN
// ======================================
// Geen vaste categorieën meer.
// Daarom gebruiken we één neutraal
// map-icoon voor zelfbedachte categorieën.
// ======================================

function categorieIcoon() {

    return "📁";

}


// ======================================
// VANDAAG
// ======================================

function vandaagWeergeven() {

    if (!vandaagLijst) {
        return;
    }


    vandaagLijst.innerHTML = "";


    const vandaag =
        datumNaarString(new Date());


    if (datumVandaag) {

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


    const vandaagTaken =
        taken.filter(
            taak =>
                !taak.afgerond &&
                taak.datum === vandaag
        );


    if (legeVandaag) {

        legeVandaag.hidden =
            vandaagTaken.length !== 0;

    }


    vandaagTaken.forEach(
        taak => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "taak-kaart";


            const titel =
                document.createElement("h3");

            titel.textContent =
                taak.titel;

            kaart.appendChild(titel);


            if (taak.categorie) {

                const categorie =
                    document.createElement("small");

                categorie.textContent =
                    categorieIcoon() +
                    " " +
                    taak.categorie;

                kaart.appendChild(categorie);

            }


            subtakenWeergeven(
                kaart,
                taak
            );


            vandaagLijst.appendChild(kaart);

        }
    );

}


// ======================================
// SUBTAKEN WEERGEVEN
// ======================================

function subtakenWeergeven(
    container,
    taak
) {

    if (
        !taak.subtaken ||
        taak.subtaken.length === 0
    ) {

        return;

    }


    const lijst =
        document.createElement("div");

    lijst.className =
        "subtaken-weergave";


    taak.subtaken.forEach(
        subtaak => {

            const regel =
                document.createElement("div");

            regel.className =
                "subtaak-weergave-regel";


            const vinkje =
                document.createElement("span");

            vinkje.textContent =
                subtaak.afgerond
                    ? "☑"
                    : "☐";


            const tekst =
                document.createElement("span");

            tekst.textContent =
                subtaak.titel;


            if (subtaak.afgerond) {

                tekst.classList.add(
                    "subtaak-afgerond"
                );

            }


            regel.appendChild(vinkje);

            regel.appendChild(tekst);

            lijst.appendChild(regel);

        }
    );


    container.appendChild(lijst);

}


// ======================================
// IDEEËN
// ======================================

function ideeenWeergeven() {

    if (!ideeenLijst) {
        return;
    }


    ideeenLijst.innerHTML = "";


    if (legeIdeeen) {

        legeIdeeen.hidden =
            ideeen.length !== 0;

    }


    ideeen.forEach(
        idee => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "idee-kaart";


            const tekst =
                document.createElement("div");

            tekst.className =
                "idee-tekst";

            tekst.textContent =
                idee.tekst;


            const datum =
                document.createElement("small");

            datum.className =
                "idee-datum";

            datum.textContent =
                datumTijdMooi(
                    idee.aangemaakt
                );


            kaart.appendChild(tekst);

            kaart.appendChild(datum);


            kaart.addEventListener(
                "contextmenu",
                event => {

                    event.preventDefault();

                    ideeVerwijderen(
                        idee.id
                    );

                }
            );


            ideeenLijst.appendChild(kaart);

        }
    );

}


// ======================================
// IDEE VERWIJDEREN
// ======================================

function ideeVerwijderen(id) {

    const akkoord =
        confirm(
            "Dit idee verwijderen?"
        );


    if (!akkoord) {
        return;
    }


    ideeen =
        ideeen.filter(
            idee =>
                idee.id !== id
        );


    dataOpslaan();

    ideeenWeergeven();

}


// ======================================
// CATEGORIEËN WEERGEVEN
// ======================================

function categorieenWeergeven() {

    if (!categorieLijst) {
        return;
    }


    categorieLijst.innerHTML = "";


    categorieen.forEach(
        categorie => {

            const aantal =
                taken.filter(
                    taak =>
                        !taak.afgerond &&
                        taak.categorie === categorie
                ).length;


            const kaart =
                document.createElement("div");

            kaart.className =
                "categorie-kaart";

            kaart.dataset.categorie =
                categorie;


            const icoon =
                document.createElement("div");

            icoon.className =
                "categorie-icoon";

            icoon.textContent =
                categorieIcoon();


            const naam =
                document.createElement("div");

            naam.className =
                "categorie-naam";

            naam.textContent =
                categorie;


            const aantalElement =
                document.createElement("div");

            aantalElement.className =
                "categorie-aantal";

            aantalElement.textContent =
                aantal +
                (
                    aantal === 1
                        ? " taak"
                        : " taken"
                );


            kaart.appendChild(icoon);

            kaart.appendChild(naam);

            kaart.appendChild(aantalElement);


            // ==========================
            // KLIKBAAR
            // ==========================

            kaart.addEventListener(
                "click",
                () => {

                    categorieOpenen(
                        categorie
                    );

                }
            );


            categorieLijst.appendChild(kaart);

        }
    );

}


// ======================================
// CATEGORIE OPENEN
// ======================================

function categorieOpenen(categorie) {

    actieveCategorie =
        categorie;


    const takenInCategorie =
        taken.filter(
            taak =>
                taak.categorie === categorie
        );


    if (!categorieLijst) {
        return;
    }


    categorieLijst.innerHTML = "";


    const terug =
        document.createElement("button");

    terug.type = "button";

    terug.className =
        "categorie-terug-knop";

    terug.textContent =
        "← Terug naar categorieën";


    terug.addEventListener(
        "click",
        () => {

            actieveCategorie = null;

            categorieenWeergeven();

        }
    );


    categorieLijst.appendChild(terug);


    const titel =
        document.createElement("h2");

    titel.className =
        "categorie-detail-titel";

    titel.textContent =
        categorieIcoon() +
        " " +
        categorie;


    categorieLijst.appendChild(titel);


    if (takenInCategorie.length === 0) {

        const leeg =
            document.createElement("p");

        leeg.className =
            "categorie-leeg";

        leeg.textContent =
            "Nog geen taken in deze categorie.";

        categorieLijst.appendChild(leeg);

        return;

    }


    takenInCategorie.forEach(
        taak => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "taak-kaart";


            if (taak.afgerond) {

                kaart.classList.add(
                    "taak-afgerond"
                );

            }


            const titelTaak =
                document.createElement("h3");

            titelTaak.textContent =
                taak.titel;

            kaart.appendChild(titelTaak);


            if (taak.datum) {

                const datum =
                    document.createElement("small");

                datum.textContent =
                    "📅 " +
                    datumMooi(taak.datum);

                kaart.appendChild(datum);

            }


            if (taak.notitie) {

                const notitie =
                    document.createElement("p");

                notitie.textContent =
                    taak.notitie;

                kaart.appendChild(notitie);

            }


            subtakenWeergeven(
                kaart,
                taak
            );


            categorieLijst.appendChild(
                kaart
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
// DATUM MOOI
// ======================================

function datumMooi(datum) {

    if (!datum) {
        return "";
    }


    const onderdelen =
        datum.split("-");


    if (onderdelen.length !== 3) {
        return datum;
    }


    return (
        onderdelen[2] +
        "-" +
        onderdelen[1] +
        "-" +
        onderdelen[0]
    );

}


// ======================================
// DATUM / TIJD MOOI
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
// BACKUP MAKEN
// ======================================

if (backupKnop) {

    backupKnop.addEventListener(
        "click",
        () => {

            const backup = {

                app: "Lucy",

                versie: "3.0",

                datum:
                    new Date().toISOString(),

                inbox: inbox,

                taken: taken,

                ideeen: ideeen,

                categorieen:
                    categorieen

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
                datumNaarString(new Date()) +
                ".json";


            link.click();


            URL.revokeObjectURL(url);

        }
    );

}


// ======================================
// BACKUP HERSTELLEN
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
                function () {

                    try {

                        const backup =
                            JSON.parse(
                                reader.result
                            );


                        if (
                            !backup ||
                            !Array.isArray(
                                backup.inbox
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
                            inboxNormaliseren(
                                backup.inbox
                            );


                        taken =
                            Array.isArray(
                                backup.taken
                            )
                                ? takenNormaliseren(
                                    backup.taken
                                )
                                : [];


                        ideeen =
                            Array.isArray(
                                backup.ideeen
                            )
                                ? ideeenNormaliseren(
                                    backup.ideeen
                                )
                                : [];


                        categorieen =
                            Array.isArray(
                                backup.categorieen
                            )
                                ? backup.categorieen
                                    .filter(
                                        categorie =>
                                            typeof categorie === "string"
                                    )
                                    .map(
                                        categorie =>
                                            categorie.trim()
                                    )
                                    .filter(
                                        categorie =>
                                            categorie !== ""
                                    )
                                : [];


                        categorieenOpslaan();

                        categorieSelectVullen();

                        dataOpslaan();

                        inboxWeergeven();

                        verwerkLijstWeergeven();

                        vandaagWeergeven();

                        ideeenWeergeven();

                        categorieenWeergeven();

                        paginaOpenen(
                            "paginaHoofd"
                        );


                        alert(
                            "Backup succesvol teruggezet."
                        );


                    } catch (fout) {

                        console.error(fout);


                        alert(
                            "Deze backup kon niet worden teruggezet."
                        );

                    }

                };


            reader.readAsText(bestand);

            event.target.value = "";

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

            localStorage.removeItem(
                OPSLAG_CATEGORIEEN
            );


            inbox = [];

            taken = [];

            ideeen = [];

            categorieen = [];

            actieveCategorie = null;


            categorieSelectVullen();

            inboxWeergeven();

            verwerkLijstWeergeven();

            vandaagWeergeven();

            ideeenWeergeven();

            categorieenWeergeven();


            paginaOpenen(
                "paginaHoofd"
            );


            alert(
                "Lucy is weer helemaal leeg."
            );

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






