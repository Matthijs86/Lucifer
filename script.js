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
    categorieSelectVullen();

    paginaOpenen("paginaHoofd");

    verwerkModalSluiten();

    verwerkLijstWeergeven();
    vandaagWeergeven();
    ideeenWeergeven();
    categorieenWeergeven();

    serviceWorkerRegistreren();

    if (snelInput) {
        setTimeout(() => snelInput.focus(), 100);
    }
});

function lokaleDataLaden(sleutel, standaard = []) {
    try {
        const opgeslagen = localStorage.getItem(sleutel);

        if (!opgeslagen) {
            return standaard;
        }

        return JSON.parse(opgeslagen);
    } catch (fout) {
        console.error("Lucy kon data niet laden:", fout);
        return standaard;
    }
}

function dataLaden() {
    inbox = inboxNormaliseren(
        lokaleDataLaden(OPSLAG_INBOX, [])
    );

    taken = takenNormaliseren(
        lokaleDataLaden(OPSLAG_TAKEN, [])
    );

    ideeen = ideeenNormaliseren(
        lokaleDataLaden(OPSLAG_IDEEEN, [])
    );
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

function inboxNormaliseren(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map(item => ({
            id: item.id || maakId(),
            tekst: item.tekst || item.titel || "",
            aangemaakt: item.aangemaakt || new Date().toISOString()
        }))
        .filter(item => item.tekst.trim() !== "");
}

function takenNormaliseren(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map(taak => ({
            id: taak.id || maakId(),
            titel: taak.titel || "",
            categorie: taak.categorie || "",
            datum: taak.datum || "",
            notitie: taak.notitie || "",
            subtaken: subtakenNormaliseren(taak.subtaken),
            afgerond: taak.afgerond === true,
            aangemaakt: taak.aangemaakt || new Date().toISOString(),
            gewijzigd: taak.gewijzigd || new Date().toISOString()
        }))
        .filter(taak => taak.titel.trim() !== "");
}

function ideeenNormaliseren(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .map(idee => ({
            id: idee.id || maakId(),
            tekst: idee.tekst || idee.titel || "",
            categorie: idee.categorie || "",
            aangemaakt: idee.aangemaakt || new Date().toISOString()
        }))
        .filter(idee => idee.tekst.trim() !== "");
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
                titel: subtaak.titel || "",
                afgerond: subtaak.afgerond === true
            };
        })
        .filter(subtaak => subtaak.titel.trim() !== "");
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
            tekst,
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
    const item = inbox.find(item => item.id === id);

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
    if (!verwerkModal) {
        return;
    }

    verwerkModal.hidden = true;
    verwerkModal.classList.remove("open");
}

function modalSluitenFunctie() {
    verwerkModalSluiten();

    document.body.style.overflow = "";

    huidigInboxId = null;

    keuzeSchermTonen();

    if (taakForm) {
        taakForm.reset();
    }

    if (ideeTitel) {
        ideeTitel.value = "";
    }

    if (taakSubtaken) {
        taakSubtaken.innerHTML = "";
    }

    paginaOpenen("paginaHoofd");

    if (snelInput) {
        setTimeout(() => snelInput.focus(), 100);
    }
}

if (modalSluiten) {
    modalSluiten.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        modalSluitenFunctie();
    });
}

if (verwerkModal) {
    verwerkModal.addEventListener("click", event => {
        if (event.target === verwerkModal) {
            modalSluitenFunctie();
        }
    });
}

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        verwerkModal &&
        !verwerkModal.hidden
    ) {
        modalSluitenFunctie();
    }
});

if (maakTaakKnop) {
    maakTaakKnop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        taakSchermTonen();
    });
}

if (maakIdeeKnop) {
    maakIdeeKnop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        ideeSchermTonen();
    });
}

if (verwijderInboxKnop) {
    verwijderInboxKnop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        if (!huidigInboxId) {
            return;
        }

        inbox = inbox.filter(item => item.id !== huidigInboxId);

        dataOpslaan();

        verwerkLijstWeergeven();

        modalSluitenFunctie();
    });
}

if (taakForm) {
    taakForm.addEventListener("submit", event => {
        event.preventDefault();
        event.stopPropagation();

        if (!huidigInboxId) {
            return;
        }

        const titel = taakTitel
            ? taakTitel.value.trim()
            : "";

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
            titel,
            categorie,
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

        modalSluitenFunctie();
    });
}

if (taakAnnulerenKnop) {
    taakAnnulerenKnop.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        modalSluitenFunctie();
    });
}

if (terugNaarKeuzes) {
    terugNaarKeuzes.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        keuzeSchermTonen();
    });
}

if (ideeOpslaan) {
    ideeOpslaan.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

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

        const categorie = prompt(
            "Categorie voor dit idee? Laat leeg voor geen categorie."
        );

        const netteCategorie = categorie
            ? categorie.trim()
            : "";

        if (netteCategorie) {
            categorieToevoegen(netteCategorie);
        }

        ideeen.unshift({
            id: maakId(),
            tekst,
            categorie: netteCategorie,
            aangemaakt: new Date().toISOString()
        });

        inbox = inbox.filter(
            item => item.id !== huidigInboxId
        );

        dataOpslaan();

        verwerkLijstWeergeven();
        ideeenWeergeven();
        categorieenWeergeven();

        modalSluitenFunctie();
    });
}

function taakFormulierLeegmaken() {
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
}

if (subtaakToevoegen) {
    subtaakToevoegen.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

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

        verwijderen.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
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

    return Array.from(
        taakSubtaken.querySelectorAll(".subtaak-regel")
    )
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

    if (!Array.isArray(opgeslagen)) {
        categorieen = [];
        return;
    }

    categorieen = [
        ...new Set(
            opgeslagen
                .map(categorie => String(categorie).trim())
                .filter(Boolean)
        )
    ];

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

    categorieSelectVullen();
    categorieenWeergeven();
}

function categorieVerwijderen(naam) {
    const akkoord = confirm(
        `Categorie "${naam}" verwijderen?`
    );

    if (!akkoord) {
        return;
    }

    categorieen = categorieen.filter(
        categorie =>
            categorie.toLowerCase() !==
            naam.toLowerCase()
    );

    localStorage.setItem(
        OPSLAG_CATEGORIEEN,
        JSON.stringify(categorieen)
    );

    categorieSelectVullen();
    categorieenWeergeven();
}

function categorieSelectVullen() {
    if (!taakCategorie) {
        return;
    }

    taakCategorie.innerHTML = "";

    const leeg = document.createElement("option");
    leeg.value = "";
    leeg.textContent = "Geen categorie";

    taakCategorie.appendChild(leeg);

    categorieen.forEach(categorie => {
        const optie = document.createElement("option");

        optie.value = categorie;
        optie.textContent = categorie;

        taakCategorie.appendChild(optie);
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

    if (taak.subtaken.length > 0) {
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

    return kaart;
}

function ideeenWeergeven() {
    if (!ideeenLijst) {
        return;
    }

    ideeenLijst.innerHTML = "";

    let lijst = ideeen;

    if (actieveCategorie) {
        lijst = ideeen.filter(
            idee =>
                idee.categorie.toLowerCase() ===
                actieveCategorie.toLowerCase()
        );
    }

    if (legeIdeeen) {
        legeIdeeen.hidden = lijst.length > 0;
    }

    lijst.forEach(idee => {
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
    const akkoord = confirm(
        "Dit idee verwijderen?"
    );

    if (!akkoord) {
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

    if (categorieen.length === 0) {
        const leeg = document.createElement("p");

        leeg.className = "lege-categorieen";
        leeg.textContent =
            "Je hebt nog geen categorieën aangemaakt.";

        categorieLijst.appendChild(leeg);
        return;
    }

    categorieen.forEach(categorie => {
        const kaart = document.createElement("button");

        kaart.type = "button";
        kaart.className = "categorie-kaart";

        if (
            actieveCategorie &&
            actieveCategorie.toLowerCase() ===
            categorie.toLowerCase()
        ) {
            kaart.classList.add("actief");
        }

        const icoon = document.createElement("span");
        icoon.className = "categorie-icoon";
        icoon.textContent = "📁";

        const inhoud = document.createElement("span");
        inhoud.className = "categorie-inhoud";

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

        inhoud.appendChild(naam);
        inhoud.appendChild(aantal);

        const verwijderen = document.createElement("span");
        verwijderen.className = "categorie-verwijder";
        verwijderen.textContent = "✕";
        verwijderen.title = "Categorie verwijderen";

        verwijderen.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            categorieVerwijderen(categorie);
        });

        kaart.appendChild(icoon);
        kaart.appendChild(inhoud);
        kaart.appendChild(verwijderen);

        kaart.addEventListener("click", () => {
            categorieOpenen(categorie);
        });

        categorieLijst.appendChild(kaart);
    });
}

function categorieOpenen(categorie) {
    actieveCategorie = categorie;

    paginaOpenen("paginaIdeeen");

    ideeenWeergeven();
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
            inbox,
            taken,
            ideeen,
            categorieen
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

                const akkoord = confirm(
                    "De huidige gegevens worden vervangen door deze backup. Doorgaan?"
                );

                if (!akkoord) {
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
                    ? [
                        ...new Set(
                            backup.categorieen
                                .map(categorie =>
                                    String(categorie).trim()
                                )
                                .filter(Boolean)
                        )
                    ]
                    : [];

                dataOpslaan();

                categorieSelectVullen();
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

        categorieSelectVullen();
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

