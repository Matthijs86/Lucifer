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

const ideeCategorie =
    document.getElementById("ideeCategorie");

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

const backupKnop =
    document.getElementById("backupKnop");

const backupInput =
    document.getElementById("backupInput");

const allesWissenKnop =
    document.getElementById("allesWissenKnop");


// ======================================
// START
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    dataLaden();

    categorieenLaden();

    elementenControleren();

    categorieSelectVullen();

    ideeCategorieVullen();

    paginaOpenen("paginaHoofd");

    modalSluitenZonderNavigatie();

    inboxWeergeven();
    verwerkLijstWeergeven();
    vandaagWeergeven();
    ideeenWeergeven();
    categorieenWeergeven();

    serviceWorkerRegistreren();

    if (snelInput) {
        snelInput.focus();
    }

});


// ======================================
// ELEMENTEN CONTROLEREN
// ======================================

function elementenControleren() {

    const elementen = [
        ["snelToevoegenForm", snelToevoegenForm],
        ["snelInput", snelInput],
        ["verwerkModal", verwerkModal],
        ["modalSluiten", modalSluiten],
        ["maakTaakKnop", maakTaakKnop],
        ["maakIdeeKnop", maakIdeeKnop],
        ["verwijderInboxKnop", verwijderInboxKnop]
    ];

    elementen.forEach(([naam, element]) => {

        if (!element) {
            console.warn(
                `Lucy: element #${naam} ontbreekt in index.html`
            );
        }

    });

}


// ======================================
// DATA LADEN
// ======================================

function dataLaden() {

    inbox = lokaleDataLaden(
        OPSLAG_INBOX,
        []
    );

    taken = lokaleDataLaden(
        OPSLAG_TAKEN,
        []
    );

    ideeen = lokaleDataLaden(
        OPSLAG_IDEEEN,
        []
    );

    inbox = inboxNormaliseren(inbox);
    taken = takenNormaliseren(taken);
    ideeen = ideeenNormaliseren(ideeen);

}


// ======================================
// LOKALE DATA LADEN
// ======================================

function lokaleDataLaden(sleutel, standaard) {

    try {

        const opgeslagen =
            localStorage.getItem(sleutel);

        if (!opgeslagen) {
            return standaard;
        }

        const data =
            JSON.parse(opgeslagen);

        return data;

    } catch (fout) {

        console.error(
            `Lucy kon ${sleutel} niet laden:`,
            fout
        );

        return standaard;

    }

}


// ======================================
// INBOX NORMALISEREN
// ======================================

function inboxNormaliseren(data) {

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(item => {

        return {
            id: item.id || maakId(),

            tekst:
                item.tekst ||
                item.titel ||
                "",

            aangemaakt:
                item.aangemaakt ||
                new Date().toISOString()
        };

    }).filter(item => item.tekst.trim() !== "");

}


// ======================================
// TAKEN NORMALISEREN
// ======================================

function takenNormaliseren(data) {

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(taak => {

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

    }).filter(
        taak =>
            taak.titel.trim() !== ""
    );

}


// ======================================
// IDEEËN NORMALISEREN
// ======================================

function ideeenNormaliseren(data) {

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(idee => {

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

    }).filter(
        idee =>
            idee.tekst.trim() !== ""
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
        .map(subtaak => {

            if (typeof subtaak === "string") {

                return {

                    id: maakId(),

                    titel:
                        subtaak.trim(),

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

        })
        .filter(
            subtaak =>
                subtaak.titel.trim() !== ""
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
// ID
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

document
    .querySelectorAll(".nav-knop")
    .forEach(knop => {

        knop.addEventListener("click", event => {

            event.preventDefault();

            paginaOpenen(
                knop.dataset.pagina
            );

        });

    });


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


    document
        .querySelectorAll(".nav-knop")
        .forEach(knop => {

            knop.classList.toggle(
                "actief",
                knop.dataset.pagina === paginaId
            );

        });


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
            inbox.length > 0;

    }


    inbox.forEach(item => {

        inboxLijst.appendChild(
            maakInboxKaart(item)
        );

    });

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
            inbox.length > 0;

    }


    inbox.forEach(item => {

        verwerkLijst.appendChild(
            maakInboxKaart(item)
        );

    });

}


// ======================================
// INBOX KAART
// ======================================

function maakInboxKaart(item) {

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
        datumTijdMooi(
            item.aangemaakt
        );


    const knop =
        document.createElement("button");

    knop.type =
        "button";

    knop.className =
        "inbox-verwerk-knop";

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


    kaart.appendChild(tekst);
    kaart.appendChild(datum);
    kaart.appendChild(knop);


    return kaart;

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


    if (taakTitel) {

        taakTitel.value =
            item.tekst;

    }


    if (ideeTitel) {

        ideeTitel.value =
            item.tekst;

    }


    if (ideeCategorie) {
        ideeCategorie.value = "";
    }


    taakFormulierLeegmaken();

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
// TAAK SCHERM
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
// IDEE SCHERM
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


    if (taakForm) {
        taakForm.reset();
    }

    if (ideeScherm) {

        const formulier =
            ideeScherm.querySelector("form");

        if (formulier) {
            formulier.reset();
        }

    }


    paginaOpenen(
        "paginaHoofd"
    );


    if (snelInput) {

        setTimeout(() => {

            snelInput.focus();

        }, 100);

    }

}


// ======================================
// MODAL SLUITEN ZONDER NAVIGATIE
// ======================================

function modalSluitenZonderNavigatie() {

    if (!verwerkModal) {
        return;
    }

    verwerkModal.hidden = true;

    verwerkModal.classList.remove(
        "open"
    );

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


            inbox =
                inbox.filter(
                    item =>
                        item.id !==
                        huidigInboxId
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


            if (categorie) {
                categorieToevoegen(categorie);
            }


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

            inboxWeergeven();
            verwerkLijstWeergeven();
            vandaagWeergeven();
            categorieenWeergeven();

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


            const categorie =
                ideeCategorie
                    ? ideeCategorie.value.trim()
                    : "";


            if (categorie) {
                categorieToevoegen(categorie);
            }


            ideeen.unshift({

                id: maakId(),

                tekst: tekst,

                categorie: categorie,

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

            inboxWeergeven();
            verwerkLijstWeergeven();
            ideeenWeergeven();
            categorieenWeergeven();

            modalSluitenFunctie();

        }
    );

}


// ======================================
// TAAK FORMULIER LEEGMAKEN
// ======================================

function taakFormulierLeegmaken() {

    if (taakDatum) {
        taakDatum.value = "";
    }

    if (taakNotitie) {
        taakNotitie.value = "";
    }

    if (taakCategorie) {
        taakCategorie.value = "";
    }

    if (taakSubtaken) {
        taakSubtaken.innerHTML = "";
    }

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

            input.type =
                "text";

            input.className =
                "subtaak-input";

            input.placeholder =
                "Kleine opdracht...";

            input.autocomplete =
                "off";


            const verwijderen =
                document.createElement("button");

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
        .map(regel => {

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

        })
        .filter(
            subtaak =>
                subtaak.titel !== ""
        );

}


// ======================================
// CATEGORIEËN LADEN
// ======================================

function categorieenLaden() {

    const opgeslagen =
        lokaleDataLaden(
            OPSLAG_CATEGORIEEN,
            []
        );


    if (Array.isArray(opgeslagen)) {

        categorieen =
            opgeslagen
                .map(categorie =>
                    String(categorie).trim()
                )
                .filter(Boolean);

    } else {

        categorieen = [];

    }


    categorieen =
        [...new Set(categorieen)];


    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
    );

}


// ======================================
// CATEGORIE TOEVOEGEN
// ======================================

function categorieToevoegen(naam) {

    const nieuweCategorie =
        String(naam || "").trim();


    if (!nieuweCategorie) {
        return;
    }


    const bestaatAl =
        categorieen.some(
            categorie =>
                categorie.toLowerCase() ===
                nieuweCategorie.toLowerCase()
        );


    if (!bestaatAl) {

        categorieen.push(
            nieuweCategorie
        );

        categorieen.sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "nl"
                )
        );

        localStorage.setItem(
            OPSLAG_CATEGORIEEN,
            JSON.stringify(categorieen)
        );

    }


    categorieSelectVullen();
    ideeCategorieVullen();

}


// ======================================
// CATEGORIE VERWIJDEREN
// ======================================

function categorieVerwijderen(naam) {

    const akkoord =
        confirm(
            `Categorie "${naam}" verwijderen?`
        );


    if (!akkoord) {
        return;
    }


    categorieen =
        categorieen.filter(
            categorie =>
                categorie !== naam
        );


    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
    );


    categorieSelectVullen();
    ideeCategorieVullen();
    categorieenWeergeven();

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


    categorieen.forEach(categorie => {

        const optie =
            document.createElement("option");

        optie.value =
            categorie;

        optie.textContent =
            categorie;


        taakCategorie.appendChild(optie);

    });

}


// ======================================
// IDEE CATEGORIE VULLEN
// ======================================

function ideeCategorieVullen() {

    if (!ideeCategorie) {
        return;
    }


    ideeCategorie.innerHTML = "";


    const leeg =
        document.createElement("option");

    leeg.value = "";

    leeg.textContent =
        "Geen categorie";


    ideeCategorie.appendChild(leeg);


    categorieen.forEach(categorie => {

        const optie =
            document.createElement("option");

        optie.value =
            categorie;

        optie.textContent =
            categorie;


        ideeCategorie.appendChild(optie);

    });

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
        datumNaarString(
            new Date()
        );


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
            vandaagTaken.length > 0;

    }


    vandaagTaken.forEach(taak => {

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
                taak.categorie;

            kaart.appendChild(categorie);

        }


        if (
            Array.isArray(taak.subtaken) &&
            taak.subtaken.length > 0
        ) {

            const subtaken =
                document.createElement("div");

            subtaken.className =
                "taak-subtaken";


            taak.subtaken.forEach(subtaak => {

                const regel =
                    document.createElement("div");

                regel.className =
                    "subtaak-weergave";


                const checkbox =
                    document.createElement("input");

                checkbox.type =
                    "checkbox";

                checkbox.checked =
                    subtaak.afgerond;


                checkbox.addEventListener(
                    "change",
                    () => {

                        subtaak.afgerond =
                            checkbox.checked;

                        taak.gewijzigd =
                            new Date().toISOString();

                        dataOpslaan();

                    }
                );


                const tekst =
                    document.createElement("span");

                tekst.textContent =
                    subtaak.titel;


                regel.appendChild(checkbox);
                regel.appendChild(tekst);

                subtaken.appendChild(regel);

            });


            kaart.appendChild(subtaken);

        }


        vandaagLijst.appendChild(
            kaart
        );

    });

}


// ======================================
// IDEEËN WEERGEVEN
// ======================================

function ideeenWeergeven() {

    if (!ideeenLijst) {
        return;
    }


    ideeenLijst.innerHTML = "";


    if (legeIdeeen) {

        legeIdeeen.hidden =
            ideeen.length > 0;

    }


    ideeen.forEach(idee => {

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


        kaart.appendChild(tekst);


        if (idee.categorie) {

            const categorie =
                document.createElement("small");

            categorie.className =
                "idee-categorie";

            categorie.textContent =
                idee.categorie;

            kaart.appendChild(categorie);

        }


        const datum =
            document.createElement("small");

        datum.className =
            "idee-datum";

        datum.textContent =
            datumTijdMooi(
                idee.aangemaakt
            );


        kaart.appendChild(datum);


        const verwijderen =
            document.createElement("button");

        verwijderen.type =
            "button";

        verwijderen.className =
            "idee-verwijder";

        verwijderen.textContent =
            "✕";


        verwijderen.addEventListener(
            "click",
            event => {

                event.preventDefault();

                ideeVerwijderen(
                    idee.id
                );

            }
        );


        kaart.appendChild(
            verwijderen
        );


        ideeenLijst.appendChild(
            kaart
        );

    });

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


    if (categorieen.length === 0) {

        const leeg =
            document.createElement("p");

        leeg.className =
            "lege-categorieen";

        leeg.textContent =
            "Je hebt nog geen categorieën aangemaakt.";

        categorieLijst.appendChild(leeg);

        return;

    }


    categorieen.forEach(categorie => {

        const kaart =
            document.createElement("article");

        kaart.className =
            "categorie-kaart";


        const naam =
            document.createElement("div");

        naam.className =
            "categorie-naam";

        naam.textContent =
            categorie;


        const aantalTaken =
            taken.filter(
                taak =>
                    !taak.afgerond &&
                    taak.categorie === categorie
            ).length;


        const aantalIdeeen =
            ideeen.filter(
                idee =>
                    idee.categorie === categorie
            ).length;


        const aantal =
            document.createElement("small");

        aantal.className =
            "categorie-aantal";


        const onderdelen = [];


        if (aantalTaken > 0) {

            onderdelen.push(
                aantalTaken +
                (
                    aantalTaken === 1
                        ? " taak"
                        : " taken"
                )
            );

        }


        if (aantalIdeeen > 0) {

            onderdelen.push(
                aantalIdeeen +
                (
                    aantalIdeeen === 1
                        ? " idee"
                        : " ideeën"
                )
            );

        }


        aantal.textContent =
            onderdelen.length
                ? onderdelen.join(" • ")
                : "Nog niets in deze categorie";


        const verwijderen =
            document.createElement("button");

        verwijderen.type =
            "button";

        verwijderen.className =
            "categorie-verwijder";

        verwijderen.textContent =
            "✕";


        verwijderen.title =
            "Categorie verwijderen";


        verwijderen.addEventListener(
            "click",
            () => {

                categorieVerwijderen(
                    categorie
                );

            }
        );


        kaart.appendChild(naam);
        kaart.appendChild(aantal);
        kaart.appendChild(verwijderen);


        categorieLijst.appendChild(
            kaart
        );

    });

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
                URL.createObjectURL(
                    blob
                );


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


            reader.onload = () => {

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
                                .map(
                                    categorie =>
                                        String(
                                            categorie
                                        ).trim()
                                )
                                .filter(Boolean)
                            : [];


                    categorieen =
                        [
                            ...new Set(
                                categorieen
                            )
                        ];


                    dataOpslaan();

                    categorieSelectVullen();
                    ideeCategorieVullen();

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

            localStorage.removeItem(
                OPSLAG_CATEGORIEEN
            );


            inbox = [];

            taken = [];

            ideeen = [];

            categorieen = [];


            categorieSelectVullen();
            ideeCategorieVullen();

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
                .then(registratie => {

                    console.log(
                        "Lucy service worker actief:",
                        registratie.scope
                    );

                })
                .catch(fout => {

                    console.error(
                        "Service worker fout:",
                        fout
                    );

                });

        }
    );

}






