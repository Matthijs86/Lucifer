// ======================================
// LUCY
// Alles uit je hoofd.
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_TAKEN = "lucyTaken";
const OPSLAG_GEDACHTEN = "lucyGedachten";
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

let taken = [];
let gedachten = [];
let ideeen = [];

let huidigFilter = "alles";


// ======================================
// ELEMENTEN
// ======================================

const snelToevoegenForm =
    document.getElementById("snelToevoegenForm");

const snelInput =
    document.getElementById("snelInput");

const hoofdLijst =
    document.getElementById("hoofdLijst");

const legeHoofdLijst =
    document.getElementById("legeHoofdLijst");

const lijstAantal =
    document.getElementById("lijstAantal");

const zoekInput =
    document.getElementById("zoekInput");

const aantalOnverwerkt =
    document.getElementById("aantalOnverwerkt");

const aantalBelangrijk =
    document.getElementById("aantalBelangrijk");

const aantalVandaag =
    document.getElementById("aantalVandaag");

const verwerkModal =
    document.getElementById("verwerkModal");

const modalSluiten =
    document.getElementById("modalSluiten");

const verwerkForm =
    document.getElementById("verwerkForm");

const bewerkId =
    document.getElementById("bewerkId");

const bewerkTitel =
    document.getElementById("bewerkTitel");

const categorieSelect =
    document.getElementById("categorieSelect");

const labelSelect =
    document.getElementById("labelSelect");

const datumSelect =
    document.getElementById("datumSelect");

const notitieInput =
    document.getElementById("notitieInput");

const subtakenLijst =
    document.getElementById("subtakenLijst");

const subtaakToevoegenKnop =
    document.getElementById("subtaakToevoegenKnop");

const verwijderTaakKnop =
    document.getElementById("verwijderTaakKnop");

const vandaagLijst =
    document.getElementById("vandaagLijst");

const legeVandaag =
    document.getElementById("legeVandaag");

const datumVandaag =
    document.getElementById("datumVandaag");

const categorieLijst =
    document.getElementById("categorieLijst");

const gedachteForm =
    document.getElementById("gedachteForm");

const gedachteInput =
    document.getElementById("gedachteInput");

const gedachtenLijst =
    document.getElementById("gedachtenLijst");

const instellingenKnop =
    document.getElementById("instellingenKnop");

const backupKnop =
    document.getElementById("backupKnop");

const backupInput =
    document.getElementById("backupInput");

const allesWissenKnop =
    document.getElementById("allesWissenKnop");


// ======================================
// EXTRA ELEMENTEN
// ======================================

let ideeenBlok = null;
let ideeForm = null;
let ideeInput = null;
let ideeenLijst = null;


// ======================================
// INITIALISEREN
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        dataLaden();

        categorieenLaden();

        categorieSelectVullen();

        categorieSelectOpschonen();

        vandaagDatumInstellen();

        paginaInstellen();

        ideeenInterfaceMaken();

        lijstenVernieuwen();

        serviceWorkerRegistreren();

        snelInput.focus();

    }
);


// ======================================
// DATA LADEN
// ======================================

function dataLaden() {

    try {

        const opgeslagenTaken =
            localStorage.getItem(OPSLAG_TAKEN);

        const opgeslagenGedachten =
            localStorage.getItem(OPSLAG_GEDACHTEN);

        const opgeslagenIdeeen =
            localStorage.getItem(OPSLAG_IDEEEN);


        // ==================================
        // TAKEN
        // ==================================

        if (opgeslagenTaken) {

            const data =
                JSON.parse(opgeslagenTaken);

            if (Array.isArray(data)) {

                taken =
                    takenNormaliseren(data);

            }

        }


        // ==================================
        // GEDACHTEN
        // ==================================

        if (opgeslagenGedachten) {

            const data =
                JSON.parse(opgeslagenGedachten);

            if (Array.isArray(data)) {

                gedachten =
                    data;

            }

        }


        // ==================================
        // IDEEËN
        // ==================================

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

        taken = [];
        gedachten = [];
        ideeen = [];

    }

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
                    categorieNormaliseren(
                        taak.categorie
                    ),

                label:
                    taak.label ||
                    "",

                notitie:
                    taak.notitie ||
                    "",

                datum:
                    taak.datum ||
                    "",

                subtaken:
                    subtakenNormaliseren(
                        taak.subtaken
                    ),

                afgerond:
                    taak.afgerond === true,

                verwerkt:
                    taak.verwerkt === true,

                aangemaakt:
                    taak.aangemaakt ||
                    new Date().toISOString(),

                gewijzigd:
                    taak.gewijzigd ||
                    new Date().toISOString(),

                afgerondOp:
                    taak.afgerondOp ||
                    ""

            };

        }
    );

}


// ======================================
// IDEEËN NORMALISEREN
// ======================================

function ideeenNormaliseren(data) {

    return data
        .map(
            idee => {

                if (
                    typeof idee ===
                    "string"
                ) {

                    return {

                        id:
                            maakId(),

                        tekst:
                            idee,

                        notitie:
                            "",

                        datum:
                            new Date().toISOString()

                    };

                }


                return {

                    id:
                        idee.id ||
                        maakId(),

                    tekst:
                        idee.tekst ||
                        idee.titel ||
                        "",

                    notitie:
                        idee.notitie ||
                        "",

                    datum:
                        idee.datum ||
                        new Date().toISOString()

                };

            }
        )
        .filter(
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


    return subtaken.map(
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
    );

}


// ======================================
// DATA OPSLAAN
// ======================================

function dataOpslaan() {

    localStorage.setItem(
        OPSLAG_TAKEN,
        JSON.stringify(taken)
    );

    localStorage.setItem(
        OPSLAG_GEDACHTEN,
        JSON.stringify(gedachten)
    );

    localStorage.setItem(
        OPSLAG_IDEEEN,
        JSON.stringify(ideeen)
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
                JSON.parse(opgeslagen);

        }

    } catch (fout) {

        console.error(
            "Categorieën konden niet worden geladen:",
            fout
        );

    }


    if (!Array.isArray(categorieen)) {

        categorieen = [];

    }


    // ==================================
    // OUDE / DUBBELE NAMEN OPSCHONEN
    // ==================================

    const opgeschoond = [];


    categorieen.forEach(
        categorie => {

            const correcteNaam =
                categorieNormaliseren(
                    categorie
                );


            if (!correcteNaam) {
                return;
            }


            const bestaatAl =
                opgeschoond.some(
                    item =>
                        item.toLowerCase() ===
                        correcteNaam.toLowerCase()
                );


            if (!bestaatAl) {

                opgeschoond.push(
                    correcteNaam
                );

            }

        }
    );


    // ==================================
    // STANDAARD CATEGORIEËN TOEVOEGEN
    // ==================================

    STANDAARD_CATEGORIEEN.forEach(
        categorie => {

            const bestaatAl =
                opgeschoond.some(
                    item =>
                        item.toLowerCase() ===
                        categorie.toLowerCase()
                );


            if (!bestaatAl) {

                opgeschoond.push(
                    categorie
                );

            }

        }
    );


    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(opgeschoond)
    );

}


// ======================================
// CATEGORIE NORMALISEREN
// ======================================
// Hiermee worden oude varianten zoals:
//
// Franciska (Terwille)
// Franciska (terwille)
//
// ADHD / Autisme
// ADHD/Autisme
//
// naar één naam gebracht.
// ======================================

function categorieNormaliseren(
    categorie
) {

    if (!categorie) {
        return "";
    }


    const tekst =
        String(categorie)
            .trim();


    if (
        tekst.toLowerCase() ===
        "franciska (terwille)"
    ) {

        return "Franciska (terwille)";

    }


    if (
        tekst.toLowerCase() ===
        "adhd/autisme" ||
        tekst.toLowerCase() ===
        "adhd / autisme"
    ) {

        return "ADHD/Autisme";

    }


    const gevonden =
        STANDAARD_CATEGORIEEN.find(
            item =>
                item.toLowerCase() ===
                tekst.toLowerCase()
        );


    return gevonden || tekst;

}


// ======================================
// CATEGORIE SELECT VULLEN
// ======================================

function categorieSelectVullen() {

    if (!categorieSelect) {
        return;
    }


    const huidigeWaarde =
        categorieNormaliseren(
            categorieSelect.value
        );


    categorieSelect.innerHTML =
        "";


    const geenCategorie =
        document.createElement("option");

    geenCategorie.value = "";

    geenCategorie.textContent =
        "Geen categorie";

    categorieSelect.appendChild(
        geenCategorie
    );


    const categorieen =
        JSON.parse(
            localStorage.getItem(
                OPSLAG_CATEGORIEEN
            )
        ) || STANDAARD_CATEGORIEEN;


    categorieen.forEach(
        categorie => {

            const correcteNaam =
                categorieNormaliseren(
                    categorie
                );


            if (!correcteNaam) {
                return;
            }


            const option =
                document.createElement("option");

            option.value =
                correcteNaam;

            option.textContent =
                categorieIcoon(
                    correcteNaam
                ) +
                " " +
                correcteNaam;

            categorieSelect.appendChild(
                option
            );

        }
    );


    categorieSelect.value =
        huidigeWaarde;

}


// ======================================
// HTML CATEGORIEËN OPSCHONEN
// ======================================

function categorieSelectOpschonen() {

    if (!categorieSelect) {
        return;
    }


    const opties =
        Array.from(
            categorieSelect.options
        );


    const gezien = new Set();


    opties.forEach(
        optie => {

            const waarde =
                categorieNormaliseren(
                    optie.value
                );


            if (!waarde) {
                return;
            }


            const sleutel =
                waarde.toLowerCase();


            if (
                gezien.has(sleutel)
            ) {

                optie.remove();

                return;

            }


            gezien.add(sleutel);

            optie.value =
                waarde;

            optie.textContent =
                categorieIcoon(
                    waarde
                ) +
                " " +
                waarde;

        }
    );

}


// ======================================
// SNEL TOEVOEGEN
// ======================================
// Dit blijft een TAAK.
// Voor ideeën is er een aparte invoer.
// ======================================

snelToevoegenForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const tekst =
            snelInput.value.trim();


        if (!tekst) {

            snelInput.focus();

            return;

        }


        const nieuweTaak = {

            id: maakId(),

            titel: tekst,

            categorie: "",

            label: "",

            notitie: "",

            datum: "",

            subtaken: [],

            afgerond: false,

            verwerkt: false,

            aangemaakt:
                new Date().toISOString(),

            gewijzigd:
                new Date().toISOString(),

            afgerondOp: ""

        };


        taken.unshift(
            nieuweTaak
        );


        dataOpslaan();

        snelInput.value = "";

        lijstenVernieuwen();

        snelInput.focus();

    }
);


// ======================================
// ID MAKEN
// ======================================

function maakId() {

    return Date.now().toString() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9);

}


// ======================================
// IDEEËN INTERFACE MAKEN
// ======================================
// De huidige HTML heeft nog geen aparte
// Ideeën-pagina.
// Daarom maakt Lucy dit blok zelf.
// ======================================

function ideeenInterfaceMaken() {

    const hoofdPagina =
        document.getElementById(
            "paginaHoofd"
        );


    if (!hoofdPagina) {
        return;
    }


    ideeenBlok =
        document.createElement("section");

    ideeenBlok.className =
        "ideeen-blok";


    // ==================================
    // TITEL
    // ==================================

    const titelRij =
        document.createElement("div");

    titelRij.className =
        "sectie-titel";


    const titel =
        document.createElement("h2");

    titel.textContent =
        "💡 IDEEËN";


    const aantal =
        document.createElement("span");

    aantal.id =
        "ideeenAantal";


    titelRij.appendChild(
        titel
    );

    titelRij.appendChild(
        aantal
    );


    // ==================================
    // UITLEG
    // ==================================

    const uitleg =
        document.createElement("p");

    uitleg.className =
        "idee-uitleg";

    uitleg.textContent =
        "Ideeën hoeven nog geen taak te worden. Bewaar ze hier totdat je besluit er iets mee te doen.";


    // ==================================
    // FORMULIER
    // ==================================

    ideeForm =
        document.createElement("form");

    ideeForm.className =
        "idee-form";


    ideeInput =
        document.createElement("textarea");

    ideeInput.rows = 2;

    ideeInput.placeholder =
        "Heb je een idee? Zet het hier neer...";

    ideeInput.autocomplete =
        "off";


    const knop =
        document.createElement("button");

    knop.type =
        "submit";

    knop.className =
        "primary-button";

    knop.textContent =
        "💡 IDEE BEWAREN";


    ideeForm.appendChild(
        ideeInput
    );

    ideeForm.appendChild(
        knop
    );


    // ==================================
    // LIJST
    // ==================================

    ideeenLijst =
        document.createElement("div");

    ideeenLijst.className =
        "ideeen-lijst";


    ideeenBlok.appendChild(
        titelRij
    );

    ideeenBlok.appendChild(
        uitleg
    );

    ideeenBlok.appendChild(
        ideeForm
    );

    ideeenBlok.appendChild(
        ideeenLijst
    );


    // Onder de hoofdtaaklijst plaatsen.
    hoofdPagina.appendChild(
        ideeenBlok
    );


    // ==================================
    // IDEE TOEVOEGEN
    // ==================================

    ideeForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const tekst =
                ideeInput.value.trim();


            if (!tekst) {

                ideeInput.focus();

                return;

            }


            ideeen.unshift({

                id: maakId(),

                tekst: tekst,

                notitie: "",

                datum:
                    new Date().toISOString()

            });


            dataOpslaan();

            ideeInput.value = "";

            ideeenWeergeven();

            statistiekenBijwerken();

            ideeInput.focus();

        }
    );

}


// ======================================
// IDEEËN WEERGEVEN
// ======================================

function ideeenWeergeven() {

    if (
        !ideeenLijst ||
        !ideeenBlok
    ) {

        return;

    }


    ideeenLijst.innerHTML =
        "";


    const aantalElement =
        document.getElementById(
            "ideeenAantal"
        );


    if (aantalElement) {

        aantalElement.textContent =
            ideeen.length;

    }


    if (
        ideeen.length === 0
    ) {

        const leeg =
            document.createElement("div");

        leeg.className =
            "lege-melding";


        const icoon =
            document.createElement("div");

        icoon.className =
            "lege-icoon";

        icoon.textContent =
            "💡";


        const titel =
            document.createElement("h3");

        titel.textContent =
            "Nog geen ideeën";


        const tekst =
            document.createElement("p");

        tekst.textContent =
            "Een idee hoeft nergens heen. Parkeer het hier voor later.";


        leeg.appendChild(
            icoon
        );

        leeg.appendChild(
            titel
        );

        leeg.appendChild(
            tekst
        );


        ideeenLijst.appendChild(
            leeg
        );


        return;

    }


    ideeen.forEach(
        idee => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "idee-kaart";


            // ==================================
            // TEKST
            // ==================================

            const tekst =
                document.createElement("p");

            tekst.className =
                "idee-tekst";

            tekst.textContent =
                idee.tekst;


            kaart.appendChild(
                tekst
            );


            // ==================================
            // DATUM
            // ==================================

            const datum =
                document.createElement("small");

            datum.className =
                "idee-datum";

            datum.textContent =
                datumTijdMooi(
                    idee.datum
                );


            kaart.appendChild(
                datum
            );


            // ==================================
            // ACTIES
            // ==================================

            const acties =
                document.createElement("div");

            acties.className =
                "idee-acties";


            const maakTaak =
                document.createElement("button");

            maakTaak.type =
                "button";

            maakTaak.className =
                "secondary-button";

            maakTaak.textContent =
                "✅ Maak taak";


            maakTaak.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    ideeNaarTaak(
                        idee.id
                    );

                }
            );


            const verwijderen =
                document.createElement("button");

            verwijderen.type =
                "button";

            verwijderen.className =
                "danger-button";

            verwijderen.textContent =
                "🗑️";


            verwijderen.setAttribute(
                "aria-label",
                "Idee verwijderen"
            );


            verwijderen.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    ideeVerwijderen(
                        idee.id
                    );

                }
            );


            acties.appendChild(
                maakTaak
            );

            acties.appendChild(
                verwijderen
            );


            kaart.appendChild(
                acties
            );


            ideeenLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// IDEE NAAR TAAK
// ======================================

function ideeNaarTaak(id) {

    const idee =
        ideeen.find(
            item =>
                item.id === id
        );


    if (!idee) {
        return;
    }


    const nieuweTaak = {

        id: maakId(),

        titel: idee.tekst,

        categorie:
            "Ideeën",

        label: "",

        notitie:
            idee.notitie || "",

        datum: "",

        subtaken: [],

        afgerond: false,

        verwerkt: true,

        aangemaakt:
            new Date().toISOString(),

        gewijzigd:
            new Date().toISOString(),

        afgerondOp: ""

    };


    taken.unshift(
        nieuweTaak
    );


    ideeen =
        ideeen.filter(
            item =>
                item.id !== id
        );


    dataOpslaan();

    lijstenVernieuwen();


    // Meteen het nieuwe taakformulier openen.
    taakVerwerkenOpenen(
        nieuweTaak.id
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

    statistiekenBijwerken();

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
        document.getElementById(
            paginaId
        );


    if (gewenstePagina) {

        gewenstePagina.classList.add(
            "actief"
        );

    }


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
        "paginaVandaag"
    ) {

        vandaagWeergeven();

    }


    if (
        paginaId ===
        "paginaCategorieen"
    ) {

        categorieenWeergeven();

    }


    if (
        paginaId ===
        "paginaGedachten"
    ) {

        gedachtenWeergeven();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================
// INSTELLINGEN OPENEN
// ======================================

instellingenKnop.addEventListener(
    "click",
    () => {

        paginaOpenen(
            "paginaInstellingen"
        );

    }
);


// ======================================
// FILTERS
// ======================================

document
    .querySelectorAll(".filter-knop")
    .forEach(
        knop => {

            knop.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filter-knop"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "actief"
                                );

                            }
                        );


                    knop.classList.add(
                        "actief"
                    );


                    huidigFilter =
                        knop.dataset.filter;


                    hoofdLijstWeergeven();

                }
            );

        }
    );


// ======================================
// ZOEKEN
// ======================================

zoekInput.addEventListener(
    "input",
    () => {

        hoofdLijstWeergeven();

    }
);


// ======================================
// LIJSTEN VERNIEUWEN
// ======================================

function lijstenVernieuwen() {

    hoofdLijstWeergeven();

    vandaagWeergeven();

    categorieenWeergeven();

    gedachtenWeergeven();

    ideeenWeergeven();

    statistiekenBijwerken();

}


// ======================================
// HOOFDLIJST
// ======================================

function hoofdLijstWeergeven() {

    const zoekterm =
        zoekInput.value
            .trim()
            .toLowerCase();


    const zichtbareTaken =
        taken.filter(
            taak => {

                if (taak.afgerond) {
                    return false;
                }


                if (
                    zoekterm &&
                    !taakZoekbaar(
                        taak,
                        zoekterm
                    )
                ) {

                    return false;

                }


                if (
                    huidigFilter === "nu" &&
                    taak.label !== "nu"
                ) {

                    return false;

                }


                if (
                    huidigFilter === "later" &&
                    taak.label !== "later"
                ) {

                    return false;

                }


                if (
                    huidigFilter === "bewaren" &&
                    taak.label !== "bewaren"
                ) {

                    return false;

                }


                return true;

            }
        );


    hoofdLijst.innerHTML =
        "";


    lijstAantal.textContent =
        zichtbareTaken.length;


    if (
        zichtbareTaken.length === 0
    ) {

        legeHoofdLijst.classList.add(
            "zichtbaar"
        );

    } else {

        legeHoofdLijst.classList.remove(
            "zichtbaar"
        );


        zichtbareTaken.forEach(
            taak => {

                hoofdLijst.appendChild(
                    taakKaartMaken(taak)
                );

            }
        );

    }

}


// ======================================
// TAAK ZOEKBAAR
// ======================================

function taakZoekbaar(
    taak,
    zoekterm
) {

    const subtakenTekst =
        (taak.subtaken || [])
            .map(
                subtaak =>
                    subtaak.titel
            )
            .join(" ");


    const tekst = [

        taak.titel,

        taak.categorie,

        taak.label,

        taak.notitie,

        subtakenTekst

    ]
        .join(" ")
        .toLowerCase();


    return tekst.includes(
        zoekterm
    );

}


// ======================================
// TAAKKAART MAKEN
// ======================================

function taakKaartMaken(taak) {

    const kaart =
        document.createElement("article");

    kaart.className =
        "taak-kaart";


    const boven =
        document.createElement("div");

    boven.className =
        "taak-boven";


    const check =
        document.createElement("button");

    check.className =
        "taak-check";

    check.type = "button";

    check.innerHTML = "✓";

    check.setAttribute(
        "aria-label",
        "Taak afronden"
    );


    check.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            taakAfronden(
                taak.id
            );

        }
    );


    const inhoud =
        document.createElement("div");

    inhoud.className =
        "taak-inhoud";


    const titel =
        document.createElement("h3");

    titel.className =
        "taak-titel";

    titel.textContent =
        taak.titel;


    inhoud.appendChild(
        titel
    );


    const meta =
        document.createElement("div");

    meta.className =
        "taak-meta";


    if (taak.label) {

        const badge =
            document.createElement("span");

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


    if (taak.categorie) {

        const badge =
            document.createElement("span");

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
            document.createElement("span");

        badge.className =
            "badge datum";

        badge.textContent =
            "📅 " +
            datumMooiWeergeven(
                taak.datum
            );

        meta.appendChild(
            badge
        );

    }


    inhoud.appendChild(
        meta
    );


    // ==================================
    // SUBTAKEN OVERZICHT
    // ==================================

    const subtaken =
        taak.subtaken || [];


    if (subtaken.length > 0) {

        const klaar =
            subtaken.filter(
                subtaak =>
                    subtaak.afgerond
            ).length;


        const mini =
            document.createElement("div");

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


    boven.appendChild(
        check
    );

    boven.appendChild(
        inhoud
    );

    kaart.appendChild(
        boven
    );


    kaart.addEventListener(
        "click",
        () => {

            taakVerwerkenOpenen(
                taak.id
            );

        }
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
// TAAK VERWERKEN OPENEN
// ======================================

function taakVerwerkenOpenen(id) {

    const taak =
        taken.find(
            item =>
                item.id === id
        );


    if (!taak) {
        return;
    }


    bewerkId.value =
        taak.id;


    bewerkTitel.value =
        taak.titel;


    categorieSelect.value =
        categorieNormaliseren(
            taak.categorie
        );


    labelSelect.value =
        taak.label || "";


    datumSelect.value =
        taak.datum || "";


    notitieInput.value =
        taak.notitie || "";


    document
        .querySelectorAll(
            ".keuze-knop"
        )
        .forEach(
            knop => {

                knop.classList.toggle(
                    "geselecteerd",
                    knop.dataset.label ===
                    taak.label
                );

            }
        );


    subtakenWeergeven(
        taak.subtaken || []
    );


    verwerkModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


// ======================================
// MODAL SLUITEN
// ======================================

modalSluiten.addEventListener(
    "click",
    modalSluitenFunctie
);


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


function modalSluitenFunctie() {

    verwerkModal.hidden =
        true;


    document.body.style.overflow =
        "";

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
                () => {

                    const label =
                        knop.dataset.label;


                    labelSelect.value =
                        label;


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
// TAAK OPSLAAN
// ======================================

verwerkForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const id =
            bewerkId.value;


        const taak =
            taken.find(
                item =>
                    item.id === id
            );


        if (!taak) {
            return;
        }


        const titel =
            bewerkTitel.value.trim();


        if (!titel) {

            alert(
                "Een taak moet een naam hebben."
            );

            return;

        }


        taak.titel =
            titel;


        taak.categorie =
            categorieNormaliseren(
                categorieSelect.value
            );


        taak.label =
            labelSelect.value;


        taak.datum =
            datumSelect.value;


        taak.notitie =
            notitieInput.value.trim();


        taak.subtaken =
            subtakenUitFormulierHalen();


        taak.verwerkt =
            true;


        taak.gewijzigd =
            new Date().toISOString();


        dataOpslaan();


        modalSluitenFunctie();


        lijstenVernieuwen();

    }
);


// ======================================
// SUBTAKEN TOEVOEGEN
// ======================================

subtaakToevoegenKnop.addEventListener(
    "click",
    () => {

        const subtaak = {

            id: maakId(),

            titel: "",

            afgerond: false

        };


        const regel =
            subtaakRegelMaken(
                subtaak
            );


        subtakenLijst.appendChild(
            regel
        );


        const input =
            regel.querySelector(
                ".subtaak-input"
            );


        if (input) {

            input.focus();

        }

    }
);


// ======================================
// SUBTAKEN WEERGEVEN
// ======================================

function subtakenWeergeven(
    subtaken
) {

    subtakenLijst.innerHTML =
        "";


    subtaken.forEach(
        subtaak => {

            subtakenLijst.appendChild(
                subtaakRegelMaken(
                    subtaak
                )
            );

        }
    );

}


// ======================================
// SUBTAAK REGEL
// ======================================

function subtaakRegelMaken(
    subtaak
) {

    const regel =
        document.createElement("div");

    regel.className =
        "subtaak-regel";


    regel.dataset.id =
        subtaak.id ||
        maakId();


    const checkbox =
        document.createElement("input");

    checkbox.type =
        "checkbox";

    checkbox.className =
        "subtaak-checkbox";

    checkbox.checked =
        subtaak.afgerond === true;


    const input =
        document.createElement("input");

    input.type =
        "text";

    input.className =
        "subtaak-input";

    input.placeholder =
        "Beschrijf de kleine opdracht...";

    input.value =
        subtaak.titel || "";

    input.autocomplete =
        "off";


    checkbox.addEventListener(
        "change",
        () => {

            input.classList.toggle(
                "afgerond",
                checkbox.checked
            );

        }
    );


    if (checkbox.checked) {

        input.classList.add(
            "afgerond"
        );

    }


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


    verwijderen.setAttribute(
        "aria-label",
        "Subtaak verwijderen"
    );


    verwijderen.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            regel.remove();

        }
    );


    regel.appendChild(
        checkbox
    );


    regel.appendChild(
        input
    );


    regel.appendChild(
        verwijderen
    );


    return regel;

}


// ======================================
// SUBTAKEN UIT FORMULIER HALEN
// ======================================

function subtakenUitFormulierHalen() {

    const regels =
        subtakenLijst
            .querySelectorAll(
                ".subtaak-regel"
            );


    return Array.from(regels)
        .map(
            regel => {

                const input =
                    regel.querySelector(
                        ".subtaak-input"
                    );


                const checkbox =
                    regel.querySelector(
                        ".subtaak-checkbox"
                    );


                return {

                    id:
                        regel.dataset.id ||
                        maakId(),

                    titel:
                        input
                            ? input.value.trim()
                            : "",

                    afgerond:
                        checkbox
                            ? checkbox.checked
                            : false

                };

            }
        )
        .filter(
            subtaak =>
                subtaak.titel !== ""
        );

}


// ======================================
// TAAK AFRONDEN
// ======================================

function taakAfronden(id) {

    const taak =
        taken.find(
            item =>
                item.id === id
        );


    if (!taak) {
        return;
    }


    taak.afgerond =
        true;


    taak.verwerkt =
        true;


    taak.afgerondOp =
        new Date().toISOString();


    taak.gewijzigd =
        new Date().toISOString();


    dataOpslaan();


    lijstenVernieuwen();

}


// ======================================
// TAAK VERWIJDEREN
// ======================================

verwijderTaakKnop.addEventListener(
    "click",
    () => {

        const id =
            bewerkId.value;


        const taak =
            taken.find(
                item =>
                    item.id === id
            );


        if (!taak) {
            return;
        }


        const akkoord =
            confirm(
                "Deze taak verwijderen?"
            );


        if (!akkoord) {
            return;
        }


        taken =
            taken.filter(
                item =>
                    item.id !== id
            );


        dataOpslaan();


        modalSluitenFunctie();


        lijstenVernieuwen();

    }
);


// ======================================
// VANDAAG
// ======================================

function vandaagDatumInstellen() {

    const vandaag =
        new Date();


    datumVandaag.textContent =
        vandaag.toLocaleDateString(
            "nl-NL",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );

}


function vandaagWeergeven() {

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


    if (
        vandaagTaken.length === 0
    ) {

        legeVandaag.classList.add(
            "zichtbaar"
        );

        return;

    }


    legeVandaag.classList.remove(
        "zichtbaar"
    );


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
// STATISTIEKEN
// ======================================

function statistiekenBijwerken() {

    const openTaken =
        taken.filter(
            taak =>
                !taak.afgerond
        );


    const nu =
        openTaken.filter(
            taak =>
                taak.label === "nu"
        );


    const vandaag =
        datumNaarString(
            new Date()
        );


    const vandaagAantal =
        openTaken.filter(
            taak =>
                taak.datum === vandaag
        );


    aantalOnverwerkt.textContent =
        openTaken.filter(
            taak =>
                !taak.verwerkt
        ).length;


    aantalBelangrijk.textContent =
        nu.length;


    aantalVandaag.textContent =
        vandaagAantal.length;

}


// ======================================
// CATEGORIEËN WEERGEVEN
// ======================================

function categorieenWeergeven() {

    categorieLijst.innerHTML =
        "";


    const categorieen =
        JSON.parse(
            localStorage.getItem(
                OPSLAG_CATEGORIEEN
            )
        ) || STANDAARD_CATEGORIEEN;


    categorieen.forEach(
        categorie => {

            const correcteNaam =
                categorieNormaliseren(
                    categorie
                );


            const aantal =
                taken.filter(
                    taak =>
                        !taak.afgerond &&
                        categorieNormaliseren(
                            taak.categorie
                        ) ===
                        correcteNaam
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
                    correcteNaam
                );


            const naam =
                document.createElement("div");


            naam.className =
                "categorie-naam";


            naam.textContent =
                correcteNaam;


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


            kaart.appendChild(
                icoon
            );


            kaart.appendChild(
                naam
            );


            kaart.appendChild(
                aantalElement
            );


            kaart.addEventListener(
                "click",
                () => {

                    categorieFilteren(
                        correcteNaam
                    );

                }
            );


            categorieLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// CATEGORIE ICOON
// ======================================

function categorieIcoon(
    categorie
) {

    const correcteNaam =
        categorieNormaliseren(
            categorie
        );


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

        // Geen hartje meer.
        "Franciska (terwille)":
            "🧭",

        "ADHD/Autisme":
            "🧠",

        "Overig":
            "📦"

    };


    return (
        iconen[correcteNaam] ||
        "📁"
    );

}


// ======================================
// CATEGORIE FILTEREN
// ======================================

function categorieFilteren(
    categorie
) {

    paginaOpenen(
        "paginaHoofd"
    );


    zoekInput.value =
        categorie;


    huidigFilter =
        "alles";


    document
        .querySelectorAll(
            ".filter-knop"
        )
        .forEach(
            knop => {

                knop.classList.toggle(
                    "actief",
                    knop.dataset.filter ===
                    "alles"
                );

            }
        );


    hoofdLijstWeergeven();

}


// ======================================
// GEDACHTE TOEVOEGEN
// ======================================

gedachteForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const tekst =
            gedachteInput.value.trim();


        if (!tekst) {

            gedachteInput.focus();

            return;

        }


        gedachten.unshift({

            id: maakId(),

            tekst: tekst,

            datum:
                new Date().toISOString()

        });


        dataOpslaan();


        gedachteInput.value =
            "";


        gedachtenWeergeven();

    }
);


// ======================================
// GEDACHTEN WEERGEVEN
// ======================================

function gedachtenWeergeven() {

    gedachtenLijst.innerHTML =
        "";


    gedachten.forEach(
        gedachte => {

            const kaart =
                document.createElement(
                    "article"
                );


            kaart.className =
                "gedachte-kaart";


            const tekst =
                document.createElement(
                    "p"
                );


            tekst.className =
                "gedachte-tekst";


            tekst.textContent =
                gedachte.tekst;


            const datum =
                document.createElement(
                    "div"
                );


            datum.className =
                "gedachte-datum";


            datum.textContent =
                datumTijdMooi(
                    gedachte.datum
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


                    gedachteVerwijderen(
                        gedachte.id
                    );

                }
            );


            gedachtenLijst.appendChild(
                kaart
            );

        }
    );

}


// ======================================
// GEDACHTE VERWIJDEREN
// ======================================

function gedachteVerwijderen(
    id
) {

    const akkoord =
        confirm(
            "Deze gedachte verwijderen?"
        );


    if (!akkoord) {
        return;
    }


    gedachten =
        gedachten.filter(
            gedachte =>
                gedachte.id !== id
        );


    dataOpslaan();


    gedachtenWeergeven();

}


// ======================================
// BACKUP MAKEN
// ======================================

backupKnop.addEventListener(
    "click",
    () => {

        const backup = {

            app:
                "Lucy",

            versie:
                "1.1",

            datum:
                new Date().toISOString(),

            taken:
                taken,

            gedachten:
                gedachten,

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


// ======================================
// BACKUP HERSTELLEN
// ======================================

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
            function() {

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


                    taken =
                        takenNormaliseren(
                            backup.taken
                        );


                    gedachten =
                        Array.isArray(
                            backup.gedachten
                        )
                            ? backup.gedachten
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

                    categorieSelectOpschonen();

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


// ======================================
// ALLES WISSEN
// ======================================

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
            OPSLAG_TAKEN
        );


        localStorage.removeItem(
            OPSLAG_GEDACHTEN
        );


        localStorage.removeItem(
            OPSLAG_IDEEEN
        );


        taken = [];

        gedachten = [];

        ideeen = [];


        lijstenVernieuwen();


        alert(
            "Lucy is weer helemaal leeg."
        );

    }
);


// ======================================
// DATUM
// ======================================

function datumNaarString(
    datum
) {

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


function datumMooiWeergeven(
    datum
) {

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


function datumTijdMooi(
    datum
) {

    const d =
        new Date(datum);


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
        "serviceWorker" in navigator
    ) {

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

}


// ======================================
// PAGINA INSTELLEN
// ======================================

function paginaInstellen() {

    document
        .querySelectorAll(".pagina")
        .forEach(
            pagina => {

                pagina.classList.remove(
                    "actief"
                );

            }
        );


    const hoofdPagina =
        document.getElementById(
            "paginaHoofd"
        );


    if (hoofdPagina) {

        hoofdPagina.classList.add(
            "actief"
        );

    }

}
