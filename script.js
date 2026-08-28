const OPSLAG_INBOX = "lucyInbox";
const OPSLAG_TAKEN = "lucyTaken";
const OPSLAG_IDEEEN = "lucyIdeeen";
const OPSLAG_CATEGORIEEN = "lucyCategorieen";

let inbox = [];
let taken = [];
let ideeen = [];
let categorieen = [];
let huidigInboxId = null;
let actieveCategorie = null;

const snelToevoegenForm = document.getElementById("snelToevoegenForm");
const snelInput = document.getElementById("snelInput");

const verwerkLijst = document.getElementById("verwerkLijst");
const legeVerwerkLijst = document.getElementById("legeVerwerkLijst");

const verwerkModal = document.getElementById("verwerkModal");
const modalSluiten = document.getElementById("modalSluiten");
const verwerkKeuzeScherm = document.getElementById("verwerkKeuzeScherm");
const verwerkItemTekst = document.getElementById("verwerkItemTekst");

const taakForm = document.getElementById("taakForm");
const taakTitel = document.getElementById("bewerkTitel");
const taakCategorie = document.getElementById("categorieSelect");
const taakDatum = document.getElementById("datumSelect");
const taakNotitie = document.getElementById("notitieInput");
const taakSubtaken = document.getElementById("subtakenLijst");
const subtaakToevoegen = document.getElementById("subtaakToevoegenKnop");
const taakAnnulerenKnop = document.getElementById("taakAnnulerenKnop");

const maakTaakKnop = document.getElementById("maakTaakKnop");
const maakIdeeKnop = document.getElementById("maakIdeeKnop");
const verwijderInboxKnop = document.getElementById("verwijderInboxKnop");

const ideeScherm = document.getElementById("ideeScherm");
const ideeTitel = document.getElementById("ideeTitel");
const ideeOpslaan = document.getElementById("ideeOpslaan");
const terugNaarKeuzes = document.getElementById("terugNaarKeuzes");

const paginaHoofd = document.getElementById("paginaHoofd");
const paginaVerwerken = document.getElementById("paginaVerwerken");
const paginaVandaag = document.getElementById("paginaVandaag");
const paginaIdeeen = document.getElementById("paginaIdeeen");
const paginaCategorieen = document.getElementById("paginaCategorieen");
const paginaInstellingen = document.getElementById("paginaInstellingen");

const vandaagLijst = document.getElementById("vandaagLijst");
const legeVandaag = document.getElementById("legeVandaag");
const datumVandaag = document.getElementById("datumVandaag");

const ideeenLijst = document.getElementById("ideeenLijst");
const legeIdeeen = document.getElementById("legeIdeeen");

const categorieLijst = document.getElementById("categorieLijst");

const backupKnop = document.getElementById("backupKnop");
const backupInput = document.getElementById("backupInput");
const allesWissenKnop = document.getElementById("allesWissenKnop");

document.addEventListener("DOMContentLoaded", () => {
    dataLaden();
    categorieenLaden();
    categorieSuggestiesVullen();
    paginaOpenen("paginaHoofd");
    verwerkModalSluitenZonderNavigatie();

    verwerkLijstWeergeven();
    vandaagWeergeven();
    ideeenWeergeven();
    categorieenWeergeven();

    serviceWorkerRegistreren();

    if (snelInput) {
        snelInput.focus();
    }
});

function dataLaden() {
    inbox = inboxNormaliseren(lokaleDataLaden(OPSLAG_INBOX, []));
    taken = takenNormaliseren(lokaleDataLaden(OPSLAG_TAKEN, []));
    ideeen = ideeenNormaliseren(lokaleDataLaden(OPSLAG_IDEEEN, []));
}

function lokaleDataLaden(sleutel, standaard) {
    try {
        const opgeslagen = localStorage.getItem(sleutel);

        if (!opgeslagen) {
            return standaard;
        }

        return JSON.parse(opgeslagen);
    } catch (fout) {
        console.error("Lucy kon gegevens niet laden:", fout);
        return standaard;
    }
}

function inboxNormaliseren(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map(item => ({
            id: item.id || maakId(),
            tekst: String(item.tekst || item.titel || "").trim(),
            aangemaakt: item.aangemaakt || new Date().toISOString()
        }))
        .filter(item => item.tekst !== "");
}

function takenNormaliseren(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map(taak => ({
            id: taak.id || maakId(),
            titel: String(taak.titel || "").trim(),
            categorie: String(taak.categorie || "").trim(),
            datum: taak.datum || "",
            notitie: String(taak.notitie || "").trim(),
            subtaken: subtakenNormaliseren(taak.subtaken),
            afgerond: taak.afgerond === true,
            aangemaakt: taak.aangemaakt || new Date().toISOString(),
            gewijzigd: taak.gewijzigd || new Date().toISOString()
        }))
        .filter(taak => taak.titel !== "");
}

function ideeenNormaliseren(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map(idee => ({
            id: idee.id || maakId(),
            tekst: String(idee.tekst || idee.titel || "").trim(),
            categorie: String(idee.categorie || "").trim(),
            aangemaakt: idee.aangemaakt || new Date().toISOString()
        }))
        .filter(idee => idee.tekst !== "");
}

function subtakenNormaliseren(subtaken) {
    if (!Array.isArray(subtaken)) {
        return [];
    }

    return subtaken
        .map(subtaak => {
            if (typeof subtaak === "string") {
                return {
                    id: maakId(),
                    titel: subtaak.trim(),
                    afgerond: false
                };
            }

            return {
                id: subtaak.id || maakId(),
                titel: String(subtaak.titel || "").trim(),
                afgerond: subtaak.afgerond === true
            };
        })
        .filter(subtaak => subtaak.titel !== "");
}

function dataOpslaan() {
    localStorage.setItem(OPSLAG_INBOX, JSON.stringify(inbox));
    localStorage.setItem(OPSLAG_TAKEN, JSON.stringify(taken));
    localStorage.setItem(OPSLAG_IDEEEN, JSON.stringify(ideeen));
    localStorage.setItem(OPSLAG_CATEGORIEEN, JSON.stringify(categorieen));
}

function maakId() {
    return Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

document.querySelectorAll(".nav-knop").forEach(knop => {
    knop.addEventListener("click", event => {
        event.preventDefault();

        const pagina = knop.dataset.pagina;

        if (pagina) {
            paginaOpenen(pagina);
        }
    });
});

const instellingenKnop = document.getElementById("instellingenKnop");

if (instellingenKnop) {
    instellingenKnop.addEventListener("click", event => {
        event.preventDefault();
        paginaOpenen("paginaInstellingen");
    });
}

function paginaOpenen(paginaId) {
    document.querySelectorAll(".pagina").forEach(pagina => {
        pagina.classList.remove("actief");
    });

    const pagina = document.getElementById(paginaId);

    if (!pagina) {
        return;
    }

    pagina.classList.add("actief");

    document.querySelectorAll(".nav-knop").forEach(knop => {
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
        actieveCategorie = null;
        categorieenWeergeven();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

if (snelToevoegenForm) {
    snelToevoegenForm.addEventListener("submit", event => {
        event.preventDefault();

        const tekst = snelInput.value.trim();

        if (!tekst) {
            snelInput.focus();
            return;
        }

        inbox.unshift({
            id: maakId(),
            tekst: tekst,
            aangemaakt: new Date().toISOString()
        });

        dataOpslaan();

        snelInput.value = "";

        verwerkLijstWeergeven();

        snelInput.focus();
    });
}

function verwerkLijstWeergeven() {
    if (!verwerkLijst) {
        return;
    }

    verwerkLijst.innerHTML = "";

    if (legeVerwerkLijst) {
        legeVerwerkLijst.hidden = inbox.length > 0;
    }

    inbox.forEach(item => {
        verwerkLijst.appendChild(maakInboxKaart(item));
    });
}

function maakInboxKaart(item) {
    const kaart = document.createElement("article");
    kaart.className = "inbox-kaart";

    const tekst = document.createElement("div");
    tekst.className = "inbox-tekst";
    tekst.textContent = item.tekst;

    const datum = document.createElement("small");
    datum.className = "inbox-datum";
    datum.textContent = datumTijdMooi(item.aangemaakt);

    const knop = document.createElement("button");
    knop.type = "button";
    knop.className = "inbox-verwerk-knop";
    knop.textContent = "⚡ Verwerken";

    knop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        verwerkingOpenen(item.id);
    });

    kaart.appendChild(tekst);
    kaart.appendChild(datum);
    kaart.appendChild(knop);

    return kaart;
}

function verwerkingOpenen(id) {
    const item = inbox.find(inboxItem => inboxItem.id === id);

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

    taakFormulierLeegmaken();
    keuzeSchermTonen();

    if (verwerkModal) {
        verwerkModal.hidden = false;
        verwerkModal.classList.add("open");
    }

    document.body.style.overflow = "hidden";
}

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

function verwerkModalSluiten() {
    if (verwerkModal) {
        verwerkModal.hidden = true;
        verwerkModal.classList.remove("open");
    }

    document.body.style.overflow = "";

    huidigInboxId = null;

    keuzeSchermTonen();

    if (taakForm) {
        taakForm.reset();
    }

    if (ideeTitel) {
        ideeTitel.value = "";
    }
}

function verwerkModalSluitenZonderNavigatie() {
    if (!verwerkModal) {
        return;
    }

    verwerkModal.hidden = true;
    verwerkModal.classList.remove("open");
}

if (modalSluiten) {
    modalSluiten.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        verwerkModalSluiten();

        paginaOpenen("paginaHoofd");

        if (snelInput) {
            setTimeout(() => snelInput.focus(), 100);
        }
    });
}

if (verwerkModal) {
    verwerkModal.addEventListener("click", event => {
        if (event.target === verwerkModal) {
            verwerkModalSluiten();
            paginaOpenen("paginaHoofd");
        }
    });
}

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        verwerkModal &&
        !verwerkModal.hidden
    ) {
        verwerkModalSluiten();
        paginaOpenen("paginaHoofd");
    }
});

if (maakTaakKnop) {
    maakTaakKnop.addEventListener("click", event => {
        event.preventDefault();
        taakSchermTonen();
    });
}

if (maakIdeeKnop) {
    maakIdeeKnop.addEventListener("click", event => {
        event.preventDefault();
        ideeSchermTonen();
    });
}

if (verwijderInboxKnop) {
    verwijderInboxKnop.addEventListener("click", event => {
        event.preventDefault();

        if (!huidigInboxId) {
            return;
        }

        inbox = inbox.filter(item => item.id !== huidigInboxId);

        dataOpslaan();
        verwerkLijstWeergeven();

        verwerkModalSluiten();
        paginaOpenen("paginaHoofd");
    });
}

if (taakForm) {
    taakForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!huidigInboxId) {
            return;
        }

        const titel = taakTitel ? taakTitel.value.trim() : "";

        if (!titel) {
            if (taakTitel) {
                taakTitel.focus();
            }

            return;
        }

        const categorie = taakCategorie
            ? taakCategorie.value.trim()
            : "";

        if (categorie) {
            categorieToevoegen(categorie);
        }

        const nieuweTaak = {
            id: maakId(),
            titel: titel,
            categorie: categorie,
            datum: taakDatum ? taakDatum.value : "",
            notitie: taakNotitie ? taakNotitie.value.trim() : "",
            subtaken: subtakenUitFormulier(),
            afgerond: false,
            aangemaakt: new Date().toISOString(),
            gewijzigd: new Date().toISOString()
        };

        taken.unshift(nieuweTaak);

        inbox = inbox.filter(
            item => item.id !== huidigInboxId
        );

        dataOpslaan();

        verwerkLijstWeergeven();
        vandaagWeergeven();
        ideeenWeergeven();
        categorieenWeergeven();

        verwerkModalSluiten();
        paginaOpenen("paginaHoofd");
    });
}

if (taakAnnulerenKnop) {
    taakAnnulerenKnop.addEventListener("click", event => {
        event.preventDefault();

        verwerkModalSluiten();
        paginaOpenen("paginaHoofd");
    });
}

if (terugNaarKeuzes) {
    terugNaarKeuzes.addEventListener("click", event => {
        event.preventDefault();
        keuzeSchermTonen();
    });
}

if (ideeOpslaan) {
    ideeOpslaan.addEventListener("click", event => {
        event.preventDefault();

        if (!huidigInboxId) {
            return;
        }

        const tekst = ideeTitel
            ? ideeTitel.value.trim()
            : "";

        if (!tekst) {
            if (ideeTitel) {
                ideeTitel.focus();
            }

            return;
        }

        const nieuweCategorie = vraagOmIdeeCategorie();

        if (nieuweCategorie) {
            categorieToevoegen(nieuweCategorie);
        }

        ideeen.unshift({
            id: maakId(),
            tekst: tekst,
            categorie: nieuweCategorie,
            aangemaakt: new Date().toISOString()
        });

        inbox = inbox.filter(
            item => item.id !== huidigInboxId
        );

        dataOpslaan();

        verwerkLijstWeergeven();
        ideeenWeergeven();
        categorieenWeergeven();

        verwerkModalSluiten();
        paginaOpenen("paginaHoofd");
    });
}

function vraagOmIdeeCategorie() {
    const bestaandeCategorieen = categorieen.join(", ");

    const tekst =
        bestaandeCategorieen.length > 0
            ? "Categorie voor dit idee:\n\nBestaande categorieën: " +
              bestaandeCategorieen +
              "\n\nLaat leeg voor geen categorie."
            : "Categorie voor dit idee:\n\nLaat leeg voor geen categorie.";

    const antwoord = prompt(tekst, "");

    if (antwoord === null) {
        return "";
    }

    return antwoord.trim();
}

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

if (subtaakToevoegen) {
    subtaakToevoegen.addEventListener("click", event => {
        event.preventDefault();

        if (!taakSubtaken) {
            return;
        }

        const regel = document.createElement("div");
        regel.className = "subtaak-regel";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "subtaak-input";
        input.placeholder = "Kleine opdracht...";
        input.autocomplete = "off";

        const verwijderen = document.createElement("button");
        verwijderen.type = "button";
        verwijderen.className = "subtaak-verwijder";
        verwijderen.textContent = "✕";
        verwijderen.title = "Subtaak verwijderen";

        verwijderen.addEventListener("click", event => {
            event.preventDefault();
            regel.remove();
        });

        regel.appendChild(input);
        regel.appendChild(verwijderen);
        taakSubtaken.appendChild(regel);

        input.focus();
    });
}

function subtakenUitFormulier() {
    if (!taakSubtaken) {
        return [];
    }

    const regels = taakSubtaken.querySelectorAll(".subtaak-regel");

    return Array.from(regels)
        .map(regel => {
            const input = regel.querySelector(".subtaak-input");

            return {
                id: maakId(),
                titel: input ? input.value.trim() : "",
                afgerond: false
            };
        })
        .filter(subtaak => subtaak.titel !== "");
}

function categorieenLaden() {
    const opgeslagen = lokaleDataLaden(
        OPSLAG_CATEGORIEEN,
        []
    );

    if (Array.isArray(opgeslagen)) {
        categorieen = opgeslagen
            .map(categorie => String(categorie).trim())
            .filter(Boolean);
    } else {
        categorieen = [];
    }

    categorieen = [...new Set(categorieen)];

    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
    );
}

function categorieToevoegen(naam) {
    const nieuweCategorie = String(naam || "").trim();

    if (!nieuweCategorie) {
        return;
    }

    const bestaatAl = categorieen.some(
        categorie =>
            categorie.toLowerCase() ===
            nieuweCategorie.toLowerCase()
    );

    if (!bestaatAl) {
        categorieen.push(nieuweCategorie);

        categorieen.sort((a, b) =>
            a.localeCompare(b, "nl")
        );

        localStorage.setItem(
            OPSLAG_CATEGORIEEN,
            JSON.stringify(categorieen)
        );
    }

    categorieSuggestiesVullen();
}

function categorieVerwijderen(naam) {
    const categorieHeeftTaken = taken.some(
        taak => taak.categorie === naam
    );

    const categorieHeeftIdeeen = ideeen.some(
        idee => idee.categorie === naam
    );

    let waarschuwing =
        `Categorie "${naam}" verwijderen?`;

    if (categorieHeeftTaken || categorieHeeftIdeeen) {
        waarschuwing +=
            "\n\nDe taken en ideeën blijven bestaan, maar krijgen geen categorie meer.";
    }

    if (!confirm(waarschuwing)) {
        return;
    }

    taken.forEach(taak => {
        if (taak.categorie === naam) {
            taak.categorie = "";
        }
    });

    ideeen.forEach(idee => {
        if (idee.categorie === naam) {
            idee.categorie = "";
        }
    });

    categorieen = categorieen.filter(
        categorie => categorie !== naam
    );

    actieveCategorie = null;

    dataOpslaan();
    categorieSuggestiesVullen();

    vandaagWeergeven();
    ideeenWeergeven();
    categorieenWeergeven();
}

function categorieSuggestiesVullen() {
    const datalist = document.getElementById(
        "categorieSuggesties"
    );

    if (!datalist) {
        return;
    }

    datalist.innerHTML = "";

    categorieen.forEach(categorie => {
        const optie = document.createElement("option");
        optie.value = categorie;
        datalist.appendChild(optie);
    });
}

function vandaagWeergeven() {
    if (!vandaagLijst) {
        return;
    }

    vandaagLijst.innerHTML = "";

    const vandaag = datumNaarString(new Date());

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

    const vandaagTaken = taken.filter(
        taak =>
            !taak.afgerond &&
            taak.datum === vandaag
    );

    if (legeVandaag) {
        legeVandaag.hidden =
            vandaagTaken.length > 0;
    }

    vandaagTaken.forEach(taak => {
        vandaagLijst.appendChild(
            maakTaakKaart(taak)
        );
    });
}

function maakTaakKaart(taak) {
    const kaart = document.createElement("article");
    kaart.className = "taak-kaart";

    const titel = document.createElement("h3");
    titel.textContent = taak.titel;

    kaart.appendChild(titel);

    if (taak.categorie) {
        const categorie = document.createElement("small");
        categorie.className = "taak-categorie";
        categorie.textContent = "📁 " + taak.categorie;
        kaart.appendChild(categorie);
    }

    if (taak.notitie) {
        const notitie = document.createElement("p");
        notitie.className = "taak-notitie";
        notitie.textContent = taak.notitie;
        kaart.appendChild(notitie);
    }

    if (
        Array.isArray(taak.subtaken) &&
        taak.subtaken.length > 0
    ) {
        const subtaken = document.createElement("div");
        subtaken.className = "taak-subtaken";

        taak.subtaken.forEach(subtaak => {
            const regel = document.createElement("label");
            regel.className = "subtaak-weergave";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = subtaak.afgerond;

            checkbox.addEventListener("change", () => {
                subtaak.afgerond = checkbox.checked;
                taak.gewijzigd = new Date().toISOString();
                dataOpslaan();
            });

            const tekst = document.createElement("span");
            tekst.textContent = subtaak.titel;

            regel.appendChild(checkbox);
            regel.appendChild(tekst);

            subtaken.appendChild(regel);
        });

        kaart.appendChild(subtaken);
    }

    const afronden = document.createElement("button");
    afronden.type = "button";
    afronden.className = "taak-afronden-knop";
    afronden.textContent = "✓ Taak afgerond";

    afronden.addEventListener("click", () => {
        taak.afgerond = true;
        taak.gewijzigd = new Date().toISOString();

        dataOpslaan();

        vandaagWeergeven();
        categorieenWeergeven();
    });

    kaart.appendChild(afronden);

    return kaart;
}

function ideeenWeergeven() {
    if (!ideeenLijst) {
        return;
    }

    ideeenLijst.innerHTML = "";

    if (legeIdeeen) {
        legeIdeeen.hidden = ideeen.length > 0;
    }

    ideeen.forEach(idee => {
        ideeenLijst.appendChild(
            maakIdeeKaart(idee)
        );
    });
}

function maakIdeeKaart(idee) {
    const kaart = document.createElement("article");
    kaart.className = "idee-kaart";

    const tekst = document.createElement("div");
    tekst.className = "idee-tekst";
    tekst.textContent = idee.tekst;

    kaart.appendChild(tekst);

    if (idee.categorie) {
        const categorie = document.createElement("small");
        categorie.className = "idee-categorie";
        categorie.textContent = "📁 " + idee.categorie;
        kaart.appendChild(categorie);
    }

    const datum = document.createElement("small");
    datum.className = "idee-datum";
    datum.textContent = datumTijdMooi(idee.aangemaakt);

    kaart.appendChild(datum);

    const verwijderen = document.createElement("button");
    verwijderen.type = "button";
    verwijderen.className = "idee-verwijder";
    verwijderen.textContent = "✕";
    verwijderen.title = "Idee verwijderen";

    verwijderen.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        ideeVerwijderen(idee.id);
    });

    kaart.appendChild(verwijderen);

    return kaart;
}

function ideeVerwijderen(id) {
    if (!confirm("Dit idee verwijderen?")) {
        return;
    }

    ideeen = ideeen.filter(
        idee => idee.id !== id
    );

    dataOpslaan();

    ideeenWeergeven();
    categorieenWeergeven();
}

function categorieenWeergeven() {
    if (!categorieLijst) {
        return;
    }

    categorieLijst.innerHTML = "";

    if (actieveCategorie) {
        categorieDetailWeergeven(actieveCategorie);
        return;
    }

    if (categorieen.length === 0) {
        const leeg = document.createElement("p");
        leeg.className = "lege-categorieen";
        leeg.textContent =
            "Je hebt nog geen categorieën aangemaakt.";
        categorieLijst.appendChild(leeg);
        return;
    }

    categorieen.forEach(categorie => {
        categorieLijst.appendChild(
            maakCategorieKaart(categorie)
        );
    });
}

function maakCategorieKaart(categorie) {
    const kaart = document.createElement("button");
    kaart.type = "button";
    kaart.className = "categorie-kaart";

    const icoon = document.createElement("span");
    icoon.className = "categorie-icoon";
    icoon.textContent = "📁";

    const informatie = document.createElement("span");
    informatie.className = "categorie-informatie";

    const naam = document.createElement("strong");
    naam.className = "categorie-naam";
    naam.textContent = categorie;

    const aantalTaken = taken.filter(
        taak =>
            !taak.afgerond &&
            taak.categorie.toLowerCase() ===
                categorie.toLowerCase()
    ).length;

    const aantalIdeeen = ideeen.filter(
        idee =>
            idee.categorie.toLowerCase() ===
            categorie.toLowerCase()
    ).length;

    const aantal = document.createElement("small");
    aantal.className = "categorie-aantal";

    const onderdelen = [];

    if (aantalTaken > 0) {
        onderdelen.push(
            aantalTaken +
            (aantalTaken === 1 ? " taak" : " taken")
        );
    }

    if (aantalIdeeen > 0) {
        onderdelen.push(
            aantalIdeeen +
            (aantalIdeeen === 1 ? " idee" : " ideeën")
        );
    }

    aantal.textContent =
        onderdelen.length > 0
            ? onderdelen.join(" • ")
            : "Nog niets in deze categorie";

    informatie.appendChild(naam);
    informatie.appendChild(aantal);

    const pijl = document.createElement("span");
    pijl.className = "categorie-pijl";
    pijl.textContent = "›";

    kaart.appendChild(icoon);
    kaart.appendChild(informatie);
    kaart.appendChild(pijl);

    kaart.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        actieveCategorie = categorie;
        categorieenWeergeven();
    });

    return kaart;
}

function categorieDetailWeergeven(categorie) {
    const terug = document.createElement("button");
    terug.type = "button";
    terug.className = "categorie-terug";
    terug.textContent = "← Alle categorieën";

    terug.addEventListener("click", event => {
        event.preventDefault();

        actieveCategorie = null;
        categorieenWeergeven();
    });

    categorieLijst.appendChild(terug);

    const kop = document.createElement("div");
    kop.className = "categorie-detail-kop";

    const icoon = document.createElement("span");
    icoon.className = "categorie-detail-icoon";
    icoon.textContent = "📁";

    const titel = document.createElement("h2");
    titel.textContent = categorie;

    kop.appendChild(icoon);
    kop.appendChild(titel);

    categorieLijst.appendChild(kop);

    const categorieTaken = taken.filter(
        taak =>
            !taak.afgerond &&
            taak.categorie.toLowerCase() ===
                categorie.toLowerCase()
    );

    const categorieIdeeen = ideeen.filter(
        idee =>
            idee.categorie.toLowerCase() ===
                categorie.toLowerCase()
    );

    if (
        categorieTaken.length === 0 &&
        categorieIdeeen.length === 0
    ) {
        const leeg = document.createElement("p");
        leeg.className = "lege-categorie-detail";
        leeg.textContent =
            "Er staat nog niets in deze categorie.";
        categorieLijst.appendChild(leeg);
    }

    if (categorieTaken.length > 0) {
        const takenKop = document.createElement("h3");
        takenKop.className = "categorie-sectie-titel";
        takenKop.textContent = "☑️ Taken";
        categorieLijst.appendChild(takenKop);

        categorieTaken.forEach(taak => {
            const kaart = maakCategorieTaakKaart(taak);
            categorieLijst.appendChild(kaart);
        });
    }

    if (categorieIdeeen.length > 0) {
        const ideeenKop = document.createElement("h3");
        ideeenKop.className = "categorie-sectie-titel";
        ideeenKop.textContent = "💡 Ideeën";
        categorieLijst.appendChild(ideeenKop);

        categorieIdeeen.forEach(idee => {
            const kaart = maakCategorieIdeeKaart(idee);
            categorieLijst.appendChild(kaart);
        });
    }

    const verwijderen = document.createElement("button");
    verwijderen.type = "button";
    verwijderen.className = "categorie-verwijder-detail";
    verwijderen.textContent =
        "🗑️ Categorie verwijderen";

    verwijderen.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        categorieVerwijderen(categorie);
    });

    categorieLijst.appendChild(verwijderen);
}

function maakCategorieTaakKaart(taak) {
    const kaart = document.createElement("article");
    kaart.className = "categorie-taak-kaart";

    const kop = document.createElement("div");
    kop.className = "categorie-item-kop";

    const icoon = document.createElement("span");
    icoon.className = "categorie-item-icoon";
    icoon.textContent = "☑️";

    const titel = document.createElement("h3");
    titel.textContent = taak.titel;

    kop.appendChild(icoon);
    kop.appendChild(titel);

    kaart.appendChild(kop);

    if (taak.datum) {
        const datum = document.createElement("small");
        datum.className = "categorie-taak-datum";

        const d = new Date(
            taak.datum + "T00:00:00"
        );

        datum.textContent =
            "📅 " +
            d.toLocaleDateString(
                "nl-NL",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );

        kaart.appendChild(datum);
    }

    if (taak.notitie) {
        const notitie = document.createElement("p");
        notitie.className = "categorie-taak-notitie";
        notitie.textContent = taak.notitie;

        kaart.appendChild(notitie);
    }

    if (
        Array.isArray(taak.subtaken) &&
        taak.subtaken.length > 0
    ) {
        const subtaken = document.createElement("div");
        subtaken.className = "categorie-taak-subtaken";

        taak.subtaken.forEach(subtaak => {
            const regel = document.createElement("div");
            regel.className = "categorie-subtaak";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = subtaak.afgerond;

            checkbox.addEventListener("change", () => {
                subtaak.afgerond = checkbox.checked;
                taak.gewijzigd = new Date().toISOString();

                dataOpslaan();
            });

            const tekst = document.createElement("span");
            tekst.textContent = subtaak.titel;

            regel.appendChild(checkbox);
            regel.appendChild(tekst);

            subtaken.appendChild(regel);
        });

        kaart.appendChild(subtaken);
    }

    const afronden = document.createElement("button");
    afronden.type = "button";
    afronden.className = "categorie-taak-afronden";
    afronden.textContent = "✓ Taak afronden";

    afronden.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        taak.afgerond = true;
        taak.gewijzigd = new Date().toISOString();

        dataOpslaan();

        categorieenWeergeven();
        vandaagWeergeven();
    });

    kaart.appendChild(afronden);

    return kaart;
}

function maakCategorieIdeeKaart(idee) {
    const kaart = document.createElement("article");
    kaart.className = "categorie-idee-kaart";

    const tekst = document.createElement("div");
    tekst.className = "categorie-idee-tekst";
    tekst.textContent = idee.tekst;

    kaart.appendChild(tekst);

    const datum = document.createElement("small");
    datum.className = "categorie-idee-datum";
    datum.textContent = datumTijdMooi(idee.aangemaakt);

    kaart.appendChild(datum);

    const verwijderen = document.createElement("button");
    verwijderen.type = "button";
    verwijderen.className = "categorie-idee-verwijder";
    verwijderen.textContent = "✕";
    verwijderen.title = "Idee verwijderen";

    verwijderen.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        ideeVerwijderen(idee.id);
        categorieenWeergeven();
    });

    kaart.appendChild(verwijderen);

    return kaart;
}

function datumNaarString(datum) {
    const jaar = datum.getFullYear();

    const maand = String(
        datum.getMonth() + 1
    ).padStart(2, "0");

    const dag = String(
        datum.getDate()
    ).padStart(2, "0");

    return `${jaar}-${maand}-${dag}`;
}

function datumTijdMooi(datum) {
    if (!datum) {
        return "";
    }

    const d = new Date(datum);

    if (Number.isNaN(d.getTime())) {
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

if (backupKnop) {
    backupKnop.addEventListener("click", () => {
        const backup = {
            app: "Lucy",
            versie: "4.0",
            datum: new Date().toISOString(),
            inbox: inbox,
            taken: taken,
            ideeen: ideeen,
            categorieen: categorieen
        };

        const inhoud = JSON.stringify(
            backup,
            null,
            2
        );

        const blob = new Blob(
            [inhoud],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download =
            "lucy-backup-" +
            datumNaarString(new Date()) +
            ".json";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
    });
}

if (backupInput) {
    backupInput.addEventListener("change", event => {
        const bestand = event.target.files[0];

        if (!bestand) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const backup = JSON.parse(
                    reader.result
                );

                if (
                    !backup ||
                    !Array.isArray(backup.inbox)
                ) {
                    throw new Error(
                        "Ongeldige backup."
                    );
                }

                if (
                    !confirm(
                        "De huidige gegevens worden vervangen door deze backup. Doorgaan?"
                    )
                ) {
                    return;
                }

                inbox = inboxNormaliseren(
                    backup.inbox
                );

                taken = Array.isArray(backup.taken)
                    ? takenNormaliseren(backup.taken)
                    : [];

                ideeen = Array.isArray(backup.ideeen)
                    ? ideeenNormaliseren(backup.ideeen)
                    : [];

                categorieen = Array.isArray(
                    backup.categorieen
                )
                    ? backup.categorieen
                        .map(categorie =>
                            String(categorie).trim()
                        )
                        .filter(Boolean)
                    : [];

                categorieen = [
                    ...new Set(categorieen)
                ];

                dataOpslaan();
                categorieSuggestiesVullen();

                verwerkLijstWeergeven();
                vandaagWeergeven();
                ideeenWeergeven();
                categorieenWeergeven();

                paginaOpenen("paginaHoofd");

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
    });
}

if (allesWissenKnop) {
    allesWissenKnop.addEventListener("click", () => {
        const eersteVraag = confirm(
            "Weet je zeker dat je ALLE gegevens van Lucy wilt verwijderen?"
        );

        if (!eersteVraag) {
            return;
        }

        const tweedeVraag = confirm(
            "Dit kan niet automatisch worden teruggedraaid. Echt alles wissen?"
        );

        if (!tweedeVraag) {
            return;
        }

        localStorage.removeItem(OPSLAG_INBOX);
        localStorage.removeItem(OPSLAG_TAKEN);
        localStorage.removeItem(OPSLAG_IDEEEN);
        localStorage.removeItem(OPSLAG_CATEGORIEEN);

        inbox = [];
        taken = [];
        ideeen = [];
        categorieen = [];
        actieveCategorie = null;

        categorieSuggestiesVullen();

        verwerkLijstWeergeven();
        vandaagWeergeven();
        ideeenWeergeven();
        categorieenWeergeven();

        paginaOpenen("paginaHoofd");

        alert(
            "Lucy is weer helemaal leeg."
        );
    });
}

function serviceWorkerRegistreren() {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    window.addEventListener("load", () => {
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
    });
}
