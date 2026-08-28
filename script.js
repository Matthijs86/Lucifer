// ======================================
// LUCY
// Alles uit je hoofd.
// ======================================


// ======================================
// OPSLAG
// ======================================

const OPSLAG_TAKEN = "lucyTaken";
const OPSLAG_INBOX = "lucyInbox";
const OPSLAG_IDEEEN = "lucyIdeeen";
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
    "Franciska (terwille)",
    "ADHD/Autisme",
    "Overig"

];


// ======================================
// DATA
// ======================================

let taken = [];
let inbox = [];
let ideeen = [];

let huidigeTaakId = null;


// ======================================
// ELEMENTEN
// ======================================

const snelToevoegenForm =
    document.getElementById("snelToevoegenForm");

const snelInput =
    document.getElementById("snelInput");

const instellingenKnop =
    document.getElementById("instellingenKnop");

const verwerkLijst =
    document.getElementById("verwerkLijst");

const legeVerwerkLijst =
    document.getElementById("legeVerwerkLijst");

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

const verwerkModal =
    document.getElementById("verwerkModal");

const modalSluiten =
    document.getElementById("modalSluiten");

const verwerkItemTekst =
    document.getElementById("verwerkItemTekst");

const maakTaakKnop =
    document.getElementById("maakTaakKnop");

const maakIdeeKnop =
    document.getElementById("maakIdeeKnop");

const verwijderInboxKnop =
    document.getElementById("verwijderInboxKnop");

const taakForm =
    document.getElementById("taakForm");

const taakAnnulerenKnop =
    document.getElementById("taakAnnulerenKnop");

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

        datumVandaagInstellen();

        navigatieInstellen();

        knoppenInstellen();

        alleLijstenVernieuwen();

        serviceWorkerRegistreren();

        snelInput.focus();

    }
);


// ======================================
// DATA LADEN
// ======================================

function dataLaden() {

    taken =
        lokaleArrayLaden(
            OPSLAG_TAKEN
        );

    inbox =
        lokaleArrayLaden(
            OPSLAG_INBOX
        );

    ideeen =
        lokaleArrayLaden(
            OPSLAG_IDEEEN
        );


    /*
     * Oude versie van Lucy gebruikte "gedachten".
     *
     * Die worden éénmalig naar de inbox gebracht.
     * Daardoor raken bestaande gegevens niet kwijt.
     */

    const oudeGedachten =
        lokaleArrayLaden(
            OPSLAG_GEDACHTEN
        );


    if (
        oudeGedachten.length > 0 &&
        inbox.length === 0
    ) {

        oudeGedachten.forEach(
            gedachte => {

                if (
                    gedachte &&
                    gedachte.tekst
                ) {

                    inbox.push({

                        id:
                            gedachte.id ||
                            maakId(),

                        tekst:
                            gedachte.tekst,

                        aangemaakt:
                            gedachte.datum ||
                            new Date().toISOString()

                    });

                }

            }
        );


        dataOpslaan();

    }


    taken =
        takenNormaliseren(
            taken
        );

}


// ======================================
// LOKALE ARRAY LADEN
// ======================================

function lokaleArrayLaden(
    sleutel
) {

    try {

        const opgeslagen =
            localStorage.getItem(
                sleutel
            );


        if (!opgeslagen) {
            return [];
        }


        const data =
            JSON.parse(
                opgeslagen
            );


        return Array.isArray(data)
            ? data
            : [];

    } catch (fout) {

        console.error(
            "Lucy kon gegevens niet laden:",
            fout
        );

        return [];

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
        OPSLAG_INBOX,
        JSON.stringify(inbox)
    );

    localStorage.setItem(
        OPSLAG_IDEEEN,
        JSON.stringify(ideeen)
    );

}


// ======================================
// TAKEN NORMALISEREN
// ======================================

function takenNormaliseren(
    data
) {

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
                    true,

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
// SUBTAKEN NORMALISEREN
// ======================================

function subtakenNormaliseren(
    subtaken
) {

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

                    id:
                        maakId(),

                    titel:
                        subtaak,

                    afgerond:
                        false

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
// ID MAKEN
// ======================================

function maakId() {

    return (
        Date.now().toString() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
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

                        paginaOpenen(
                            knop.dataset.pagina
                        );

                    }
                );

            }
        );

}


// ======================================
// PAGINA OPENEN
// ======================================

function paginaOpenen(
    paginaId
) {

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


    if (pagina) {

        pagina.classList.add(
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
        "paginaVerwerken"
    ) {

        verwerkLijstWeergeven();

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
// KNOPPEN
// ======================================

function knoppenInstellen() {

    instellingenKnop.addEventListener(
        "click",
        () => {

            paginaOpenen(
                "paginaInstellingen"
            );

        }
    );


    snelToevoegenForm.addEventListener(
        "submit",
        snelToevoegen
    );


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


    maakTaakKnop.addEventListener(
        "click",
        () => {

            taakForm.hidden = false;

            maakTaakFormKlaar();

        }
    );


    maakIdeeKnop.addEventListener(
        "click",
        () => {

            huidigeItemNaarIdee();

        }
    );


    verwijderInboxKnop.addEventListener(
        "click",
        () => {

            huidigeItemVerwijderen();

        }
    );


    taakAnnulerenKnop.addEventListener(
        "click",
        () => {

            taakForm.hidden = true;

        }
    );


    taakForm.addEventListener(
        "submit",
        taakOpslaan
    );


    subtaakToevoegenKnop.addEventListener(
        "click",
        subtaakToevoegen
    );


    document
        .querySelectorAll(".keuze-knop")
        .forEach(
            knop => {

                knop.addEventListener(
                    "click",
                    () => {

                        labelSelect.value =
                            knop.dataset.label;


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


    backupKnop.addEventListener(
        "click",
        backupMaken
    );


    backupInput.addEventListener(
        "change",
        backupHerstellen
    );


    allesWissenKnop.addEventListener(
        "click",
        allesWissen
    );

}


// ======================================
// SNEL TOEVOEGEN
// ======================================

function snelToevoegen(
    event
) {

    event.preventDefault();


    const tekst =
        snelInput.value.trim();


    if (!tekst) {

        snelInput.focus();

        return;

    }


    inbox.unshift({

        id:
            maakId(),

        tekst:
            tekst,

        aangemaakt:
            new Date().toISOString()

    });


    dataOpslaan();


    snelInput.value = "";

    snelInput.focus();

}


// ======================================
// VERWERKLIJST
// ======================================

function verwerkLijstWeergeven() {

    verwerkLijst.innerHTML = "";


    if (inbox.length === 0) {

        legeVerwerkLijst.classList.add(
            "zichtbaar"
        );

        return;

    }


    legeVerwerkLijst.classList.remove(
        "zichtbaar"
    );


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
                "VERWERKEN";


            knop.addEventListener(
                "click",
                () => {

                    verwerkItemOpenen(
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
// VERWERK ITEM OPENEN
// ======================================

function verwerkItemOpenen(
    id
) {

    const item =
        inbox.find(
            regel =>
                regel.id === id
        );


    if (!item) {
        return;
    }


    huidigeTaakId =
        id;


    verwerkItemTekst.textContent =
        item.tekst;


    taakForm.hidden = true;


    verwerkModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


// ======================================
// MODAL SLUITEN
// ======================================

function modalSluitenFunctie() {

    verwerkModal.hidden =
        true;


    taakForm.hidden =
        true;


    huidigeTaakId =
        null;


    document.body.style.overflow =
        "";

}


// ======================================
// TAAK FORM KLAARMAKEN
// ======================================

function maakTaakFormKlaar() {

    const item =
        inbox.find(
            regel =>
                regel.id ===
                huidigeTaakId
        );


    if (!item) {
        return;
    }


    bewerkId.value =
        item.id;


    bewerkTitel.value =
        item.tekst;


    categorieSelect.value =
        "";


    labelSelect.value =
        "";


    datumSelect.value =
        "";


    notitieInput.value =
        "";


    subtakenLijst.innerHTML =
        "";


    document
        .querySelectorAll(
            ".keuze-knop"
        )
        .forEach(
            knop => {

                knop.classList.remove(
                    "geselecteerd"
                );

            }
        );

}


// ======================================
// TAAK OPSLAAN
// ======================================

function taakOpslaan(
    event
) {

    event.preventDefault();


    const item =
        inbox.find(
            regel =>
                regel.id ===
                huidigeTaakId
        );


    if (!item) {
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


    const taak = {

        id:
            maakId(),

        titel:
            titel,

        categorie:
            categorieSelect.value,

        label:
            labelSelect.value,

        notitie:
            notitieInput.value.trim(),

        datum:
            datumSelect.value,

        subtaken:
            subtakenUitFormulierHalen(),

        afgerond:
            false,

        verwerkt:
            true,

        aangemaakt:
            item.aangemaakt ||
            new Date().toISOString(),

        gewijzigd:
            new Date().toISOString(),

        afgerondOp:
            ""

    };


    taken.unshift(
        taak
    );


    inbox =
        inbox.filter(
            regel =>
                regel.id !==
                huidigeTaakId
        );


    dataOpslaan();


    modalSluitenFunctie();


    verwerkLijstWeergeven();

    vandaagWeergeven();

    categorieenWeergeven();

}


// ======================================
// ITEM NAAR IDEE
// ======================================

function huidigeItemNaarIdee() {

    const item =
        inbox.find(
            regel =>
                regel.id ===
                huidigeTaakId
        );


    if (!item) {
        return;
    }


    ideeen.unshift({

        id:
            maakId(),

        tekst:
            item.tekst,

        aangemaakt:
            item.aangemaakt ||
            new Date().toISOString()

    });


    inbox =
        inbox.filter(
            regel =>
                regel.id !==
                huidigeTaakId
        );


    dataOpslaan();


    modalSluitenFunctie();


    verwerkLijstWeergeven();

    ideeenWeergeven();

}


// ======================================
// ITEM VERWIJDEREN
// ======================================

function huidigeItemVerwijderen() {

    const akkoord =
        confirm(
            "Dit item verwijderen?"
        );


    if (!akkoord) {
        return;
    }


    inbox =
        inbox.filter(
            regel =>
                regel.id !==
                huidigeTaakId
        );


    dataOpslaan();


    modalSluitenFunctie();


    verwerkLijstWeergeven();

}


// ======================================
// SUBTAKEN TOEVOEGEN
// ======================================

function subtaakToevoegen() {

    const subtaak = {

        id:
            maakId(),

        titel:
            "",

        afgerond:
            false

    };


    subtakenLijst.appendChild(
        subtaakRegelMaken(
            subtaak
        )
    );


    const regels =
        subtakenLijst.querySelectorAll(
            ".subtaak-regel"
        );


    const laatste =
        regels[regels.length - 1];


    if (laatste) {

        const input =
            laatste.querySelector(
                ".subtaak-input"
            );


        if (input) {
            input.focus();
        }

    }

}


// ======================================
// SUBTAAK REGEL
// ======================================

function subtaakRegelMaken(
    subtaak
) {

    const regel =
        document.createElement(
            "div"
        );


    regel.className =
        "subtaak-regel";


    regel.dataset.id =
        subtaak.id;


    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.className =
        "subtaak-checkbox";


    checkbox.checked =
        subtaak.afgerond === true;


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.className =
        "subtaak-input";


    input.placeholder =
        "Beschrijf de kleine opdracht...";


    input.value =
        subtaak.titel || "";


    checkbox.addEventListener(
        "change",
        () => {

            input.classList.toggle(
                "afgerond",
                checkbox.checked
            );

        }
    );


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
// VANDAAG
// ======================================

function datumVandaagInstellen() {

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
// TAAKKAART
// ======================================

function taakKaartMaken(
    taak
) {

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


    inhoud.appendChild(
        titel
    );


    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "taak-meta";


    if (taak.label) {

        const label =
            document.createElement(
                "span"
            );


        label.className =
            "badge " +
            taak.label;


        label.textContent =
            labelTekst(
                taak.label
            );


        meta.appendChild(
            label
        );

    }


    if (taak.categorie) {

        const categorie =
            document.createElement(
                "span"
            );


        categorie.className =
            "badge";


        categorie.textContent =
            categorieIcoon(
                taak.categorie
            ) +
            " " +
            taak.categorie;


        meta.appendChild(
            categorie
        );

    }


    if (taak.datum) {

        const datum =
            document.createElement(
                "span"
            );


        datum.className =
            "badge datum";


        datum.textContent =
            "📅 " +
            datumMooiWeergeven(
                taak.datum
            );


        meta.appendChild(
            datum
        );

    }


    inhoud.appendChild(
        meta
    );


    if (
        taak.subtaken &&
        taak.subtaken.length > 0
    ) {

        const klaar =
            taak.subtaken.filter(
                subtaak =>
                    subtaak.afgerond
            ).length;


        const subtaken =
            document.createElement(
                "small"
            );


        subtaken.className =
            "subtaken-mini";


        subtaken.textContent =
            "☑ " +
            klaar +
            "/" +
            taak.subtaken.length +
            " subtaken";


        inhoud.appendChild(
            subtaken
        );

    }


    kaart.appendChild(
        check
    );


    kaart.appendChild(
        inhoud
    );


    kaart.addEventListener(
        "click",
        () => {

            taakBewerken(
                taak.id
            );

        }
    );


    return kaart;

}


// ======================================
// TAAK BEWERKEN
// ======================================

function taakBewerken(
    id
) {

    const taak =
        taken.find(
            item =>
                item.id === id
        );


    if (!taak) {
        return;
    }


    huidigeTaakId =
        taak.id;


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


    subtakenWeergeven(
        taak.subtaken || []
    );


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


    verwerkItemTekst.textContent =
        taak.titel;


    taakForm.hidden =
        false;


    verwerkModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


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
// TAAK AFRONDEN
// ======================================

function taakAfronden(
    id
) {

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


    taak.afgerondOp =
        new Date().toISOString();


    taak.gewijzigd =
        new Date().toISOString();


    dataOpslaan();


    vandaagWeergeven();

}


// ======================================
// IDEEËN
// ======================================

function ideeenWeergeven() {

    ideeenLijst.innerHTML =
        "";


    if (ideeen.length === 0) {

        legeIdeeen.classList.add(
            "zichtbaar"
        );

        return;

    }


    legeIdeeen.classList.remove(
        "zichtbaar"
    );


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


            verwijderen.addEventListener(
                "click",
                () => {

                    const akkoord =
                        confirm(
                            "Dit idee verwijderen?"
                        );


                    if (!akkoord) {
                        return;
                    }


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
// CATEGORIEËN
// ======================================

function categorieenLaden() {

    let categorieen =
        lokaleArrayLaden(
            OPSLAG_CATEGORIEEN
        );


    if (categorieen.length === 0) {

        categorieen =
            [...STANDAARD_CATEGORIEEN];

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


function categorieSelectVullen() {

    categorieSelect.innerHTML =
        "";


    const geenCategorie =
        document.createElement(
            "option"
        );


    geenCategorie.value =
        "";


    geenCategorie.textContent =
        "Geen categorie";


    categorieSelect.appendChild(
        geenCategorie
    );


    const categorieen =
        lokaleArrayLaden(
            OPSLAG_CATEGORIEEN
        );


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


function categorieenWeergeven() {

    categorieLijst.innerHTML =
        "";


    const categorieen =
        lokaleArrayLaden(
            OPSLAG_CATEGORIEEN
        );


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

function categorieIcoon(
    categorie
) {

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
// LABEL
// ======================================

function labelTekst(
    label
) {

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
// ALLE LIJSTEN VERNIEUWEN
// ======================================

function alleLijstenVernieuwen() {

    verwerkLijstWeergeven();

    vandaagWeergeven();

    ideeenWeergeven();

    categorieenWeergeven();

}


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

function backupMaken() {

    const backup = {

        app:
            "Lucy",

        versie:
            "2.0",

        datum:
            new Date().toISOString(),

        taken:
            taken,

        inbox:
            inbox,

        ideeen:
            ideeen,

        gedachten:
            [],

        categorieen:
            lokaleArrayLaden(
                OPSLAG_CATEGORIEEN
            )

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


// ======================================
// BACKUP HERSTELLEN
// ======================================

function backupHerstellen(
    event
) {

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


                inbox =
                    Array.isArray(
                        backup.inbox
                    )
                        ? backup.inbox
                        : [];


                ideeen =
                    Array.isArray(
                        backup.ideeen
                    )
                        ? backup.ideeen
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

                alleLijstenVernieuwen();


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


// ======================================
// ALLES WISSEN
// ======================================

function allesWissen() {

    const eersteVraag =
        confirm(
            "Weet je zeker dat je alle gegevens van Lucy wilt verwijderen?"
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
        OPSLAG_INBOX
    );

    localStorage.removeItem(
        OPSLAG_IDEEEN
    );

    localStorage.removeItem(
        OPSLAG_GEDACHTEN
    );


    taken = [];

    inbox = [];

    ideeen = [];


    alleLijstenVernieuwen();


    alert(
        "Lucy is weer helemaal leeg."
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
