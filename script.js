// ======================================
// LUCY
// Alles uit je hoofd.
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_TAKEN = "lucyTaken";
const OPSLAG_GEDACHTEN = "lucyGedachten";
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
    "Overig"
];


// ======================================
// DATA
// ======================================

let taken = [];
let gedachten = [];

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
// INITIALISEREN
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        dataLaden();

        categorieenLaden();

        vandaagDatumInstellen();

        paginaInstellen();

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

        if (opgeslagenTaken) {

            const data =
                JSON.parse(opgeslagenTaken);

            if (Array.isArray(data)) {
                taken = data;
            }

        }

        if (opgeslagenGedachten) {

            const data =
                JSON.parse(opgeslagenGedachten);

            if (Array.isArray(data)) {
                gedachten = data;
            }

        }

    } catch (fout) {

        console.error(
            "Lucy kon de gegevens niet laden:",
            fout
        );

        taken = [];
        gedachten = [];

    }

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

}


// ======================================
// CATEGORIEËN
// ======================================

function categorieenLaden() {

    const opgeslagen =
        localStorage.getItem(OPSLAG_CATEGORIEEN);

    if (!opgeslagen) {

        localStorage.setItem(
            OPSLAG_CATEGORIEEN,
            JSON.stringify(STANDAARD_CATEGORIEEN)
        );

    }

}


// ======================================
// SNEL TOEVOEGEN
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

            aangemaakt: new Date().toISOString(),

            gewijzigd: new Date().toISOString(),

            afgerondOp: ""

        };


        taken.unshift(nieuweTaak);

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

                pagina.classList.remove("actief");

            }
        );


    const gewenstePagina =
        document.getElementById(paginaId);

    if (gewenstePagina) {

        gewenstePagina.classList.add("actief");

    }


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


    if (paginaId === "paginaVandaag") {
        vandaagWeergeven();
    }

    if (paginaId === "paginaCategorieen") {
        categorieenWeergeven();
    }

    if (paginaId === "paginaGedachten") {
        gedachtenWeergeven();
    }

    if (paginaId === "paginaInstellingen") {
        // niets nodig
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
                        .querySelectorAll(".filter-knop")
                        .forEach(
                            item => {
                                item.classList.remove(
                                    "actief"
                                );
                            }
                        );

                    knop.classList.add("actief");

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


    let zichtbareTaken =
        taken.filter(
            taak => {

                if (taak.afgerond) {
                    return false;
                }

                if (
                    zoekterm &&
                    !taakZoekbaar(taak, zoekterm)
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


    hoofdLijst.innerHTML = "";

    lijstAantal.textContent =
        zichtbareTaken.length;


    if (zichtbareTaken.length === 0) {

        legeHoofdLijst.classList.add(
            "zichtbaar"
        );

        return;

    }


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


// ======================================
// TAAK ZOEKBAAR
// ======================================

function taakZoekbaar(
    taak,
    zoekterm
) {

    const tekst = [

        taak.titel,

        taak.categorie,

        taak.label,

        taak.notitie,

        ...(taak.subtaken || [])
            .map(subtaak => subtaak.titel)

    ]
        .join(" ")
        .toLowerCase();


    return tekst.includes(zoekterm);

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

            taakAfronden(taak.id);

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


    inhoud.appendChild(titel);


    const meta =
        document.createElement("div");

    meta.className =
        "taak-meta";


    if (taak.label) {

        const badge =
            document.createElement("span");

        badge.className =
            "badge " + taak.label;

        badge.textContent =
            labelTekst(taak.label);

        meta.appendChild(badge);

    }


    if (taak.categorie) {

        const badge =
            document.createElement("span");

        badge.className =
            "badge";

        badge.textContent =
            "📂 " + taak.categorie;

        meta.appendChild(badge);

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

        meta.appendChild(badge);

    }


    inhoud.appendChild(meta);


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

        mini.innerHTML =
            "☑ <strong>" +
            klaar +
            "/" +
            subtaken.length +
            "</strong> subtaken";

        inhoud.appendChild(mini);

    }


    boven.appendChild(check);

    boven.appendChild(inhoud);

    kaart.appendChild(boven);


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
            item => item.id === id
        );


    if (!taak) {
        return;
    }


    bewerkId.value =
        taak.id;

    bewerkTitel.value =
        taak.titel;

    categorieSelect.value =
        taak.categorie || "";

    labelSelect.value =
        taak.label || "";

    datumSelect.value =
        taak.datum || "";

    notitieInput.value =
        taak.notitie || "";


    document
        .querySelectorAll(".keuze-knop")
        .forEach(
            knop => {

                knop.classList.toggle(
                    "geselecteerd",
                    knop.dataset.label === taak.label
                );

            }
        );


    subtakenWeergeven(
        taak.subtaken || []
    );


    verwerkModal.hidden = false;

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
            event.target === verwerkModal
        ) {

            modalSluitenFunctie();

        }

    }
);


function modalSluitenFunctie() {

    verwerkModal.hidden = true;

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
                        .querySelectorAll(".keuze-knop")
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
                item => item.id === id
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
            categorieSelect.value;

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

        const regel =
            subtaakRegelMaken({
                id: maakId(),
                titel: "",
                afgerond: false
            });


        subtakenLijst.appendChild(regel);

        const input =
            regel.querySelector(
                "input[type='text']"
            );

        if (input) {
            input.focus();
        }

    }
);


// ======================================
// SUBTAKEN WEERGEVEN
// ======================================

function subtakenWeergeven(subtaken) {

    subtakenLijst.innerHTML = "";


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

function subtaakRegelMaken(subtaak) {

    const regel =
        document.createElement("div");

    regel.className =
        "subtaak-regel";

    regel.dataset.id =
        subtaak.id;


    const checkbox =
        document.createElement("input");

    checkbox.type =
        "checkbox";

    checkbox.checked =
        subtaak.afgerond;


    const input =
        document.createElement("input");

    input.type =
        "text";

    input.placeholder =
        "Nieuwe subtaak...";

    input.value =
        subtaak.titel;


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
        () => {

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
// SUBTAKEN UIT FORMULIER
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
                        "input[type='text']"
                    );

                const checkbox =
                    regel.querySelector(
                        "input[type='checkbox']"
                    );


                return {

                    id:
                        regel.dataset.id ||
                        maakId(),

                    titel:
                        input.value.trim(),

                    afgerond:
                        checkbox.checked

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
            item => item.id === id
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

    vandaagLijst.innerHTML = "";


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


    if (vandaagTaken.length === 0) {

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
                taakKaartMaken(taak)
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

    categorieLijst.innerHTML = "";


    const categorieen =
        JSON.parse(
            localStorage.getItem(
                OPSLAG_CATEGORIEEN
            )
        ) || STANDAARD_CATEGORIEEN;


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
                categorieIcoon(categorie);


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

            kaart.appendChild(
                aantalElement
            );


            kaart.addEventListener(
                "click",
                () => {

                    categorieFilteren(
                        categorie
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

function categorieIcoon(categorie) {

    const iconen = {

        "Sociaal": "👥",

        "Administratie": "📋",

        "Klussen": "🔨",

        "Financiën": "💰",

        "Huis": "🏠",

        "Auto": "🚗",

        "Boodschappen": "🛒",

        "Afspraken": "📅",

        "Ideeën": "💡",

        "Overig": "📦"

    };


    return iconen[categorie] || "📁";

}


// ======================================
// CATEGORIE FILTEREN
// ======================================

function categorieFilteren(categorie) {

    paginaOpenen(
        "paginaHoofd"
    );


    zoekInput.value =
        categorie;


    huidigFilter =
        "alles";


    document
        .querySelectorAll(".filter-knop")
        .forEach(
            knop => {

                knop.classList.toggle(
                    "actief",
                    knop.dataset.filter === "alles"
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

    gedachtenLijst.innerHTML = "";


    gedachten.forEach(
        gedachte => {

            const kaart =
                document.createElement("article");

            kaart.className =
                "gedachte-kaart";


            const tekst =
                document.createElement("p");

            tekst.className =
                "gedachte-tekst";

            tekst.textContent =
                gedachte.tekst;


            const datum =
                document.createElement("div");

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

function gedachteVerwijderen(id) {

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
                "1.0",

            datum:
                new Date().toISOString(),

            taken:
                taken,

            gedachten:
                gedachten,

            categorieen:
                JSON.parse(
                    localStorage.getItem(
                        OPSLAG_CATEGORIEEN
                    )
                ) || STANDAARD_CATEGORIEEN

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
                        backup.taken;

                    gedachten =
                        Array.isArray(
                            backup.gedachten
                        )
                            ? backup.gedachten
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


                    dataOpslaan();

                    lijstenVernieuwen();


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


        taken = [];

        gedachten = [];


        lijstenVernieuwen();


        alert(
            "Lucy is weer helemaal leeg."
        );

    }
);


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


function datumMooiWeergeven(datum) {

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


    document
        .getElementById(
            "paginaHoofd"
        )
        .classList.add(
            "actief"
        );

}