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

document.addEventListener("DOMContentLoaded", () => {

    dataLaden();

    categorieenLaden();

    categorieSelectVullen();

    elementenControleren();

    paginaOpenen("paginaHoofd");

    modalVolledigSluiten();

    inboxWeergeven();

    verwerkLijstWeergeven();

    vandaagWeergeven();

    ideeenWeergeven();

    categorieenWeergeven();

    serviceWorkerRegistreren();

    if (snelInput) {
        setTimeout(() => {
            snelInput.focus();
        }, 100);
    }

});


// ======================================
// ELEMENTEN CONTROLEREN
// ======================================

function elementenControleren() {

    const belangrijkeElementen = [

        ["snelToevoegenForm", snelToevoegenForm],
        ["snelInput", snelInput],
        ["verwerkModal", verwerkModal],
        ["modalSluiten", modalSluiten],
        ["verwerkKeuzeScherm", verwerkKeuzeScherm],
        ["taakForm", taakForm],
        ["ideeScherm", ideeScherm],
        ["maakTaakKnop", maakTaakKnop],
        ["maakIdeeKnop", maakIdeeKnop],
        ["verwijderInboxKnop", verwijderInboxKnop]

    ];

    belangrijkeElementen.forEach(([naam, element]) => {

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

                inbox =
                    inboxNormaliseren(data);

            }

        }


        if (opgeslagenTaken) {

            const data =
                JSON.parse(opgeslagenTaken);

            if (Array.isArray(data)) {

                taken =
                    takenNormaliseren(data);

            }

        }


        if (opgeslagenIdeeen) {

            const data =
                JSON.parse(opgeslagenIdeeen);

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

    return data.map(item => {

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

    }).filter(item => item.tekst.trim() !== "");

}


// ======================================
// TAKEN NORMALISEREN
// ======================================

function takenNormaliseren(data) {

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

    }).filter(taak => taak.titel.trim() !== "");

}


// ======================================
// IDEEËN NORMALISEREN
// ======================================

function ideeenNormaliseren(data) {

    return data.map(idee => {

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

    }).filter(idee => idee.tekst.trim() !== "");

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
                    subtaak.tekst ||
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

    try {

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

    } catch (fout) {

        console.error(
            "Lucy kon de gegevens niet opslaan:",
            fout
        );

    }

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
    .forEach(knop => {

        knop.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const pagina =
                    knop.dataset.pagina;

                if (pagina) {

                    paginaOpenen(pagina);

                }

            }
        );

    });


function paginaOpenen(paginaId) {

    document
        .querySelectorAll(".pagina")
        .forEach(pagina => {

            pagina.classList.remove("actief");

        });


    const gewenstePagina =
        document.getElementById(paginaId);


    if (!gewenstePagina) {
        return;
    }


    gewenstePagina.classList.add("actief");


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
// INSTELLINGEN
// ======================================

if (instellingenKnop) {

    instellingenKnop.addEventListener(
        "click",
        event => {

            event.preventDefault();

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
                snelInput
                    ? snelInput.value.trim()
                    : "";


            if (!tekst) {

                if (snelInput) {
                    snelInput.focus();
                }

                return;

            }


            inbox.unshift({

                id: maakId(),

                tekst: tekst,

                aangemaakt:
                    new Date().toISOString()

            });


            dataOpslaan();

            if (snelInput) {
                snelInput.value = "";
            }

            inboxWeergeven();

            verwerkLijstWeergeven();

            if (snelInput) {
                snelInput.focus();
            }

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


    inbox.forEach(item => {

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


        inboxLijst.appendChild(kaart);

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
            inbox.length !== 0;

    }


    inbox.forEach(item => {

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


        verwerkLijst.appendChild(kaart);

    });

}


// ======================================
// VERWERKING OPENEN
// ======================================

function verwerkingOpenen(id) {

    const item =
        inbox.find(
            inboxItem =>
                String(inboxItem.id) ===
                String(id)
        );


    if (!item) {
        return;
    }


    huidigInboxId =
        item.id;


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


    if (taakCategorie) {
        taakCategorie.value = "";
    }


    if (taakDatum) {
        taakDatum.value = "";
    }


    if (taakNotitie) {
        taakNotitie.value = "";
    }


    subtakenFormulierLeegmaken();


    keuzeSchermTonen();


    if (verwerkModal) {

        verwerkModal.hidden = false;

        verwerkModal.classList.add("open");

        document.body.classList.add(
            "modal-open"
        );

        document.body.style.overflow =
            "hidden";

    }

}


// ======================================
// KEUZESCHERM
// ======================================

function keuzeSchermTonen() {

    if (verwerkKeuzeScherm) {

        verwerkKeuzeScherm.hidden =
            false;

    }


    if (taakForm) {

        taakForm.hidden =
            true;

    }


    if (ideeScherm) {

        ideeScherm.hidden =
            true;

    }

}


// ======================================
// TAAKSCHERM
// ======================================

function taakSchermTonen() {

    if (verwerkKeuzeScherm) {

        verwerkKeuzeScherm.hidden =
            true;

    }


    if (taakForm) {

        taakForm.hidden =
            false;

    }


    if (ideeScherm) {

        ideeScherm.hidden =
            true;

    }


    if (taakTitel) {

        setTimeout(() => {

            taakTitel.focus();

            taakTitel.select();

        }, 50);

    }

}


// ======================================
// IDEESCHERM
// ======================================

function ideeSchermTonen() {

    if (verwerkKeuzeScherm) {

        verwerkKeuzeScherm.hidden =
            true;

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

        setTimeout(() => {

            ideeTitel.focus();

            ideeTitel.select();

        }, 50);

    }

}


// ======================================
// MODAL VOLLEDIG SLUITEN
// ======================================

function modalVolledigSluiten() {

    if (verwerkModal) {

        verwerkModal.hidden =
            true;

        verwerkModal.classList.remove(
            "open"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );


    document.body.style.overflow =
        "";


    huidigInboxId =
        null;


    keuzeSchermTonen();

}


// ======================================
// MODAL SLUITEN
// ======================================

function modalSluitenFunctie() {

    modalVolledigSluiten();


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

            event.preventDefault();

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
                        String(item.id) !==
                        String(huidigInboxId)
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
                        String(item.id) !==
                        String(huidigInboxId)
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


            ideeen.unshift({

                id: maakId(),

                tekst: tekst,

                aangemaakt:
                    new Date().toISOString()

            });


            inbox =
                inbox.filter(
                    item =>
                        String(item.id) !==
                        String(huidigInboxId)
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


            subtaakRegelToevoegen();

        }
    );

}


// ======================================
// SUBTAAK REGEL TOEVOEGEN
// ======================================

function subtaakRegelToevoegen(
    tekst = ""
) {

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

    input.value =
        tekst;


    const verwijderen =
        document.createElement("button");

    verwijderen.type =
        "button";

    verwijderen.className =
        "subtaak-verwijder";

    verwijderen.textContent =
        "✕";

    verwijderen.setAttribute(
        "aria-label",
        "Subtaak verwijderen"
    );


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


// ======================================
// SUBTAKEN FORMULIER LEEGMAKEN
// ======================================

function subtakenFormulierLeegmaken() {

    if (!taakSubtaken) {
        return;
    }

    taakSubtaken.innerHTML = "";

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
        JSON.stringify(
            categorieen
        )
    );

}


// ======================================
// CATEGORIE SELECT VULLEN
// ======================================

function categorieSelectVullen() {

    if (!taakCategorie) {
        return;
    }


    taakCategorie.innerHTML =
        "";


    const leeg =
        document.createElement("option");

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

        console.warn(fout);

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
// VANDAAG
// ======================================

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


            kaart.appendChild(
                titel
            );


            if (taak.categorie) {

                const categorie =
                    document.createElement("small");

                categorie.textContent =
                    categorieIcoon(
                        taak.categorie
                    ) +
                    " " +
                    taak.categorie;

                kaart.appendChild(
                    categorie
                );

            }


            if (
                Array.isArray(taak.subtaken) &&
                taak.subtaken.length > 0
            ) {

                const subtaken =
                    document.createElement("ul");

                subtaken.className =
                    "taak-subtaken";


                taak.subtaken.forEach(
                    subtaak => {

                        const regel =
                            document.createElement("li");

                        regel.textContent =
                            subtaak.titel;

                        subtaken.appendChild(
                            regel
                        );

                    }
                );


                kaart.appendChild(
                    subtaken
                );

            }


            vandaagLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// IDEEËN
// ======================================

function ideeenWeergeven() {

    if (!ideeenLijst) {
        return;
    }


    ideeenLijst.innerHTML =
        "";


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


            kaart.appendChild(
                tekst
            );

            kaart.appendChild(
                datum
            );


            kaart.addEventListener(
                "contextmenu",
                event => {

                    event.preventDefault();

                    ideeVerwijderen(
                        idee.id
                    );

                }
            );


            ideeenLijst.appendChild(
                kaart
            );

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

        console.warn(fout);

    }


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


            const icoon =
                document.createElement("div");

            icoon.className =
                "categorie-icoon";

            icoon.textContent =
                categorieIcoon(
                    categorie
                );


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

                console.warn(fout);

            }


            const backup = {

                app:
                    "Lucy",

                versie:
                    "3.0",

                datum:
                    new Date().toISOString(),

                inbox:
                    inbox,

                taken:
                    taken,

                ideeen:
                    ideeen,

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


            link.href =
                url;


            link.download =
                "lucy-backup-" +
                datumNaarString(
                    new Date()
                ) +
                ".json";


            document.body.appendChild(
                link
            );

            link.click();

            link.remove();


            setTimeout(
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                },
                100
            );

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


                        inboxWeergeven();

                        verwerkLijstWeergeven();

                        vandaagWeergeven();

                        ideeenWeergeven();

                        categorieenWeergeven();


                        modalVolledigSluiten();

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


            inbox = [];

            taken = [];

            ideeen = [];


            modalVolledigSluiten();


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



