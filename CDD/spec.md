# Documentatie- & Leersysteem — Specificatie

> **Context:** Bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Bouwstenen en interactiepatronen zijn afgeleid van Nuxt UI Templates (docs + editor) en boot.dev (client-side code-execution model).

## Overview

Een dynamisch documentatieplatform op Nuxt 4 + Nuxt Content dat dient als second brain én als interactief leersysteem voor programmeren en security. De kern is een markdown-documentatiesite met een view/edit-toggle, een conditioneel rechter panel (ToC, code editor, flashcards, comments, graph) en moduleerbare mini-apps per onderwerpgebied. Markdown blijft de bron van waarheid; geen content-database. De app is installeerbaar (PWA) en werkt offline. Het is **geen** generieke note-taking app of CMS — de focus ligt expliciet op leren, oefenen en gestructureerd kennisbeheer.

---

## Goals

- 90% van het leren en documenteren vindt plaats binnen één tool, in plaats van versnipperd over meerdere systemen
- Iedere docs-pagina is interactief: lezen, bewerken, oefenen en bediscussiëren in dezelfde view
- Programmeertaal-pagina's bieden runnable code + challenges in de browser, zonder execution-backend
- NL is basistaal, EN is secundair; eenvoudig uit te breiden naar meer talen
- Modulair zodat nieuwe features als panel of mini-app kunnen worden toegevoegd zonder herstructurering
- Edits en structuur-mutaties werken in de eerste release zonder backend, account of netwerk
- Hoofdstukken en pagina's kunnen vanuit de UI worden aangemaakt — geen codebase-aanpassing nodig om content uit te breiden
- Werkt offline en is installeerbaar als PWA
- Zelf-hostbaar in latere fases (Azure, AWS, on-prem) via een gecontaineriseerde build
- **Toegankelijk** — WCAG 2.1 AA als minimum; elk muis- of scroll-gedrag heeft een toetsenbord-equivalent (incl. de smart ToC, het cards-overlay en de panel-switcher)
- **Telemetry-ready** — geen telemetry of analytics in de eerste release. In latere fases wordt telemetry standaard toegevoegd (niet opt-in — dit is een werkomgeving, geen consumer-product). De architectuur is zo opgezet dat dit zonder herbouw kan.
- **Niet bedoeld voor publiek of zoekmachines** — robots.txt blokkeert alle crawlers, en content rendert pas na succesvolle authenticatie in deployed omgevingen (zie feature 18)

---

## User Roles

> Toegang tot het systeem vereist authenticatie in alle deployed omgevingen (zie feature 18). De rol "Lezer" beschrijft wat een gebruiker kan zodra hij door die auth-gate is. In lokale development is geen auth nodig.

### Lezer (anoniem, eerste release)
- Kan alle docs lezen, navigeren via sidebar, ToC en search
- Kan code-challenges uitvoeren in de browser en pass/fail-feedback krijgen
- Kan flashcards / quiz / exam doorlopen
- Kan comments lezen
- Kan pagina's lokaal bewerken én lokaal nieuwe pagina's/hoofdstukken aanmaken; alle wijzigingen worden uitsluitend in de browser bewaard en zijn niet zichtbaar voor anderen
- Kan content downloaden voor offline gebruik per module
- Kan **geen** content publiceren, **geen** comments plaatsen, **geen** profiel beheren

> Auteurs- en Reviewer-rollen worden later geïntroduceerd zodra backend-save (git commit / PR-flow) en IAM beschikbaar zijn. In de eerste release volstaat één rol. Bij enterprise-deployments komt daar later **SSO/SCIM-provisioning** bij voor centrale account- en groepenbeheer.

---

## Core Features

### 1. Markdown rendering & content-engine
- Server-side rendering via Nuxt Content
- Headings H1–H4 met anchor-links
- Code blocks met syntax highlighting
- **Tabs** in content (Tailwind-stijl) zodat lange pagina's gecondenseerd kunnen worden zonder de file op te splitsen. Iedere tab heeft eigen H2/H3-koppen; de ToC reageert hierop (zie feature 6). **Overflow**: meer tabs dan in beeld passen scrollen horizontaal — touch-swipe, trackpad-scroll en shift+scrollwheel werken native. Een subtiele schaduw aan de zichtbare rand signaleert dat er meer is. Zie feature 3 voor hoe het `+`-icoontje bereikbaar blijft tijdens scroll.
- Callouts, afbeeldingen, embeds
- **Assets** — afbeeldingen en andere media leven in `public/` met een mappenstructuur die de content-tree spiegelt (`public/syntax/javascript/closures/figure-1.png`). Eén bron, makkelijk te vinden, en bij significante groei migreren we naar een CDN — de mappenstructuur blijft hetzelfde, alleen de URL-prefix verandert. UI-screenshots blijven taal-onafhankelijk (één afbeelding voor NL en EN); alleen écht taal-gevoelige beelden krijgen per taal een eigen versie.
- **Frontmatter schema & forward compatibility** — alle frontmatter-velden zijn gedocumenteerd in een schema-spec. Iedere pagina heeft impliciet een `schemaVersion` (default `1`). De parse-laag is **tolerant**: onbekende velden geven een dev-warning maar laten de pagina renderen. Bij breaking changes voegen we migration-scripts toe die `schemaVersion` ophogen en oude velden naar de nieuwe vorm vertalen — zo blijft refactoren mogelijk zonder honderden pagina's handmatig aan te passen.
- **Toekomstige content-ingestie**: een conversie-pipeline (waarschijnlijk via n8n) die externe bronnen — video's, Instagram reels, nieuwsartikelen — automatisch omzet naar markdown-pagina's met frontmatter. Output blijft een gewoon markdown-bestand in `content/` zodat de rest van het systeem niets hoeft te weten van de bron.

### 2. View / Edit toggle met lokale drafts
- Bewerk-knoppen zitten op de actiebalk **naast de paginatitel** (zie feature 5).
- `Edit` opent een live markdown-editor.
- **Persistentie nu** — uitsluitend in **browser-localstorage**:
  - Sleutel-patroon: `draft:{lang}:{path}` (drafts per pagina én per taal apart bewaard)
  - Refresh werkt: draft komt automatisch terug
  - Banner met _"je hebt onopgeslagen wijzigingen"_ blijft zichtbaar tot de gebruiker reset
  - Geen backend, geen netwerk, geen account
- **Quota & data-loss safety net**:
  - Schrijf-operaties vangen `QuotaExceededError` af. Bij een vol localStorage verschijnt een banner _"lokale opslag vol — exporteer je werk of wis oude drafts"_ met directe acties.
  - **Settings-knop _Export drafts_** — downloadt alle drafts én lokale tree-mutaties (feature 3) als één ZIP, in een gedocumenteerd JSON-formaat (versie + payload).
  - **Settings-knop _Import drafts_** — leest een eerder geëxporteerde ZIP terug. Conflict-strategie: bestaande lokale items winnen; geïmporteerde items met dezelfde sleutel worden behouden onder een `.imported`-suffix, zodat niets stilletjes overschreven wordt.
  - Diezelfde knoppen lossen ook het scenario op waarin een gebruiker browser-data wist, een ander apparaat gebruikt, of werk wil delen met een collega.
- **Latere fase — IndexedDB**: zodra drafts groter worden, in-app content management groeit (feature 3) en/of we offline-first willen zijn over meer dan alleen reads, migreren we van localStorage naar **IndexedDB**. Sleutels en datamodel blijven hetzelfde; alleen de storage-laag wordt vervangen.
- **Verdere fases** (architectuur laat hier ruimte voor):
  - **Backend save** — "Publiceer" maakt een commit op een nieuwe branch + opent een PR op GitHub. Reviewer keurt goed → merge → deploy. Markdown blijft bron van waarheid; geen content-DB.
  - **+ IAM** — drafts per ingelogde gebruiker; SSO/SCIM voor enterprise
  - **+ Real-time collab** — Y.js-sync over de lokale opslag heen; eindstaat blijft git
- Detail-spec: `feature-lokale-bewerkingen-onthouden.md` (nog te schrijven, #8 in `features.md`).

### 3. In-app content management (sidebar + pagina-acties)
Doel: nieuwe **hoofdstukken, pagina's, varianten en content-tabs** kunnen aanmaken zonder de codebase te openen. Alles wat structureel is moet via de UI kunnen — de markdown-editor blijft alleen voor de inhoud zelf.

Het "iets toevoegen"-affordance volgt **één van twee patronen**, afhankelijk van of het doel een vertikale lijst of een horizontale tab-rij is:

**Vertikale lijsten — inline `+ nieuw …`-rij onderaan**:
- Onder de chapter-lijst van een module → _"+ nieuw hoofdstuk"_
- Onder de pages-lijst van een uitgevouwen hoofdstuk → _"+ nieuwe pagina"_
- Subtiel gestyled (gestippelde rand om het `+`-icoon, lichtere tekst) zodat ze niet domineren. De rij verschijnt onderaan de lijst, _niet_ als losse iconen naast headings — dat verstoorde de hiërarchie en maakte de sidebar druk.

**Horizontale tab-rijen — klein `+`-icoontje aan het einde**:
- Naast de **variant-tabs in de sub-header** (feature 8) → voor een nieuwe variant. Maakt een nieuwe `.{variant}.{lang}.md` file aan met de huidige pagina-content als startpunt zodat je niet vanaf nul begint.
- Naast de **content-tabs in de pagina** (feature 1) → voor een nieuwe tab. De tab-markup wordt automatisch in het markdownbestand ingevoegd; de nieuwe tab opent direct in edit-mode klaar voor inhoud.
- **Overflow & bereikbaarheid van `+`**: bij veel tabs scrollt de tab-rij horizontaal (touch-swipe, trackpad-scroll, shift+scrollwheel — allemaal native). Het `+`-icoontje staat **`position: sticky; right: 0`** zodat het altijd zichtbaar en klikbaar blijft tijdens scroll — geen verstopt action achter een vergrendelde rand. Dezelfde regel geldt voor toetsenbordnavigatie: het `+` zit altijd in tab-order, ook als de zichtbare tabs eerst gescrolld moeten worden.

In beide gevallen: klik → kleine inline input voor de naam → enter → het nieuwe item verschijnt direct in de UI; bij een pagina/variant/tab opent die meteen in edit-mode (feature 2). Rechts-klik op een bestaand item → context-menu met **rename** en **delete**.
- **Persistentie eerste release** — localStorage:
  - Sleutel `tree:{lang}` houdt een virtuele overlay-boom bij van lokaal toegevoegde/gewijzigde items
  - De gerenderde sidebar mergt de echte content-tree (uit Nuxt Content) met deze overlay
  - Lokaal aangemaakte pagina's en hoofdstukken zijn alleen voor die browser/sessie zichtbaar, net als drafts
- **Fase 2 — drag-and-drop herordenen**: items in de sidebar kunnen versleept worden om volgorde of nesting aan te passen. Dit zit niet in de eerste release.
- **Fase 3 — IndexedDB**: zodra structuur-mutaties en drafts samen significant groeien, migreert de overlay-storage naar IndexedDB (gelijktijdig met feature 2).
- **Fase 4 — backend save**: "+ new page" wordt onderdeel van de PR-flow; één commit voegt zowel het markdown-bestand als de navigatie-config toe.

### 4. Pagina-actiebalk (naast de titel)
Vier knoppen, **inline rechts naast de paginatitel** (H1), niet als losse rij erboven. **Visueel gegroepeerd in twee segmented buttons** (geen losse knoppen met whitespace ertussen):

1. **View / Edit** — één segmented button met twee segmenten, gedeelde border, geen gap. Het actieve segment (View of Edit) heeft een gevulde achtergrond, het andere een blanco achtergrond. Eén verticale divider tussen de twee.
2. **Copy page + dropdown-chevron** — óók één segmented button. _Copy page_ (met copy-icoon) en de chevron-knop delen één rounded border en zijn even hoog. Eén verticale divider tussen de copy-tekst en de chevron. Klik op de chevron opent het dropdown-menu met opties: _Copy as markdown_, _Open in Claude_, _Open in ChatGPT_, _View as markdown_.

Tussen de twee groepen (View/Edit en Copy/dropdown) zit wél een kleine gap — dat zijn semantisch verschillende acties. Maar binnen elke groep: alles aaneengesloten, geen whitespace, identieke hoogte.

> Toekomstige dropdown-opties: **_Genereer PowerPoint_** en **_Genereer documentatie_** — beide leveren een download op basis van de pagina-inhoud. Beide leunen op de AI-laag (zie feature 12) en zijn dus pas zinvol nadat de LLM-integratie staat.

### 5. Changelog en navigatie onderaan pagina
- **Changelog** direct onder de content: commit/edit-history van die pagina (datum, auteur, korte omschrijving).
- **Prev / Next** daaronder, gebaseerd op `content-surround`. Volgt de structuur van de zijbalk.
- **Edge cases voor Prev / Next**: op de eerste pagina van een scope (geen vorige) of de laatste (geen volgende) blijven **beide kaarten zichtbaar**. De niet-beschikbare kant wordt **gedimd** en toont een fallback-bestemming één niveau hoger — bv. _"Kitt overzicht"_ als je op de eerste pagina van Git zit. Voorkomt dat de gebruiker zich opgesloten voelt op een eindpunt; er is altijd een volgende klik mogelijk.
- Volgorde is altijd: content → changelog → prev/next.

### 6. Rechter panel met conditionele panel-switcher en smart ToC
- Standaard toont het rechter panel de **Table of Contents** van de huidige pagina.
- Bovenaan het panel staat een knoppenrij die het panel naar een andere view switcht. **Welke knoppen zichtbaar zijn, hangt af van de pagina/module** — een knop verschijnt alleen als hij een zinvolle use case heeft op die pagina. **Knoppen zijn icon-only**: elke panel-switch is een Iconify-icoon, eventueel met een tooltip op hover. Geen tekst-labels naast de iconen — het rechter panel is smal, en consistente iconografie is genoeg signaal.

  | Panel | Beschikbaar op |
  |---|---|
  | ToC | overal |
  | Code editor | alleen op pagina's met programmeertaal of code-use-case (Syntax-module, delen van Xpl01ts en Lab) |
  | Card trainer | overal |
  | Comments | overal |
  | Graph view | later, vooral in Knowledge Base |
  | News feed | later — externe feeds (bv. Hacker News) gefilterd op pagina-onderwerp, voor up-to-date blijven |

- Tussen content en panel zit een `dashboard-resize-handle` zodat de gebruiker de breedte zelf bepaalt.
- **Smart ToC-gedrag**:
  - **Past de ToC volledig in het scherm** → tonen alle koppen tegelijk, gewone Nuxt UI-stijl. **Geen expand/collapse-indicators, geen pijltjes, geen klik-om-uit-te-vouwen.**
  - **Past hij niet** → toon standaard alleen H2's. Zodra de gebruiker voorbij een H2 scrollt, vouwen de bijbehorende H3's en H4's automatisch open. Het gedrag is **volledig scroll-driven** — geen UI-affordance om handmatig open/dicht te klappen.
  - Bij alleen H2's op de pagina: gewone scrollbare lijst.
- **Tab-bewuste ToC**: als de pagina content-tabs heeft (feature 1), reflecteert de ToC de koppen van de **actief geselecteerde tab**. Switch je van tab, dan herrendert de ToC. Anchors springen alleen naar koppen binnen de actieve tab — zo verwijzen ToC-links nooit naar verborgen content.

### 7. Header met dropdown-menu's
**Linkerkant**: logo (klikbaar → home).

**Midden — hoofdmenu met 6 items**, elk een **dropdown** die opent op hover of klik. Elk hoofdmenu-item is een categorie; de echte mini-apps zijn de sub-items:

1. **The Lab** — experimenten, projecten, sandboxes
2. **Syntax** — programmeertalen en lower-level (sub-items zoals Morse, Binary, Shellcode, C, Terminal, PowerShell, Python, JavaScript, …)
3. **Kitt** — toolkits & commando's (git, nmap, wireshark, etc.). Pagina's leggen tools uit met hun belangrijkste flags en use-cases; waar mogelijk komt er een interactieve **terminal-emulator** in de panel-switcher zodat commando's direct te oefenen zijn — vergelijkbaar met de code editor in feature 10, maar dan met een sandboxed shell.
4. **Vuln** — vulnerabilities / security topics
5. **Xpl01ts** — exploits / write-ups
6. **Knowledge Base** — algemene wiki

De sub-items in elke dropdown zijn data-driven uit de content-tree, zodat in-app aangemaakte hoofdstukken (feature 3) automatisch in het menu verschijnen.

**Rechterkant — 5 actie-knoppen**, allemaal **icon-only**. Geen tekst-labels naast de iconen, geen toetsenbord-affordances zoals `⌘K` zichtbaar in de UI (de search blijft Cmd/Ctrl+K-bindable, maar die hint hoort in de tooltip of binnenin de geopende command palette, niet in de header):
1. **Search** (command palette)
2. **AI** — opent slide-panel chatbot (zie feature 12)
3. **i18n** — taalwissel
4. **Light / Dark toggle**
5. **Settings**

**Speciaal geval — header-items zonder children**: een hoofdmenu-item dat alleen een `index.md` heeft en verder geen sub-items (zoals _The Lab_ in de eerste release) rendert **geen dropdown** maar een directe link met dezelfde styling als de andere items, alleen zonder chevron. Klik → navigatie naar de scope-overview. De render-rule is data-driven: heeft een module zero of one direct child? → directe link. Heeft hij meerdere → dropdown.

### 8. Sub-header met variant-tabs (opt-in per pagina)
Een generieke secundaire navigatie-balk onder de hoofd-header voor pagina's die meerdere **varianten** van dezelfde inhoud aanbieden. Wat een variant betekent verschilt per pagina:

- Voor JavaScript: skill-niveaus (Junior / Mid-level / Senior)
- Voor een security-onderwerp: een perspectief-keuze (bv. _Aanvaller_ / _Verdediger_)
- Voor een platformsysteem: een OS-keuze (Windows / Linux / macOS)

Pagina's zonder `variants`-declaratie hebben geen sub-header.

```yaml
variants:
  - { id: junior, label: Junior,    icon: 'lucide:user-round' }
  - { id: mid,    label: Mid-level, icon: 'lucide:user-check' }
  - { id: senior, label: Senior,    icon: 'lucide:crown' }
```

Iedere variant heeft drie velden: `id` (slug, gebruikt in querystring en filename), `label` (zichtbare tekst), en `icon` (Iconify-referentie). Het `icon`-veld is **verplicht** — zonder kan het overflow-gedrag hieronder niet werken.

- De sub-header toont **alleen de variant-tabs**, zonder statisch label ervoor — geen _"Niveau:"_, geen _"Variant:"_, niets. De betekenis van varianten verschilt per pagina, dus elk vast label zou misleidend zijn op de volgende pagina.
- Iedere variant krijgt **eigen content** in een aparte file: `closures.junior.nl.md`, `closures.mid.nl.md`, `closures.senior.nl.md` — schaalt beter dan alles in één file proppen, en drafts blijven per variant gescheiden.
- Varianten en content-tabs (feature 1) kunnen **gecombineerd** worden: een pagina kan zowel een variant-sub-header hebben als interne tabs binnen elke variant. De ToC blijft dan tab-bewust binnen de actieve variant.
- De gekozen variant wordt onthouden in een querystring (`?variant=junior`) zodat links deelbaar zijn.
- **Overflow-gedrag — collapse, geen scroll**: als alle varianten met icon + label binnen de container passen, wordt alles zo getoond. Als ze niet passen, **collapsen non-actieve varianten naar icon-only**; de actieve variant blijft altijd in icon + label zichtbaar zodat de gebruiker weet waar hij is. Bij hover/focus op een collapsed variant verschijnt het label als tooltip. Dit gedrag is bewust **anders dan bij content-tabs** (feature 1, horizontaal scrollen): variant-tabs zijn een prominente navigatie-keuze waar alle opties in één oogopslag zichtbaar moeten zijn — content-tabs zijn serieel doorlees-secties waar scrollen acceptabel is. De `+`-knop voor _nieuwe variant_ (feature 3) blijft daardoor altijd zichtbaar zonder sticky te hoeven zijn.
- **Visuele consistentie**:
  - Horizontale dividers tussen secties lopen **edge-to-edge** met de container — geen inset of whitespace aan de zijkanten. Geldt voor élke divider tussen hoofdsecties (header → sub-header → content). Als de inhoud een max-width heeft, zit de divider op de _outer_ container, niet op de inner-padded.
  - De **active-state-underline** van een geselecteerde tab (zowel hier in de variant-tabs als in het hoofdmenu, feature 7) **landt op de divider** van zijn container — niet zwevend erboven met een gat ertussen. Praktisch betekent dit: padding op de outer container is horizontaal-only, elke tab heeft zelf de vertical padding, en de active border-bottom overlapt de container's divider met een negatieve margin van 0.5px. Resultaat: de tab-rij voelt visueel gefuseerd met de divider in plaats van drie horizontale lijnen vlak boven elkaar.

### 9. Internationalisatie
- Module: `@nuxtjs/i18n`
- Standaardtaal **Nederlands**, secundair **Engels**
- Alle UI-strings via translation files
- Markdown content per taal: `page.nl.md`, `page.en.md` (gecombineerd met varianten: `page.junior.nl.md`)
- Localstorage-drafts en lokale tree-mutaties (features 2 en 3) per taal apart: sleutel bevat `{lang}`

### 10. Code editor + browser-based execution (Syntax-module)
- De code editor leeft als panel-optie in de panel-switcher (feature 6), **niet** als losse knoppenrij boven de changelog. De editor-knop verschijnt alleen op pagina's met een programmeertaal of code-use-case.
- Switchen vervangt de ToC tijdelijk; de resize-handle blijft werken zodat de editor breder kan.
- Elk hoofdstuk bevat een **challenge** in de editor met directe pass/fail-feedback — geïnspireerd op boot.dev.
- **Editor-stack**: CodeMirror 6 (zelfde keuze als boot.dev; lichtgewicht, modulair, mobiel-vriendelijk).
- **Execution-model — alles client-side, geen sandbox-backend in de eerste release**:

  | Taal | Hoe het draait |
  |---|---|
  | JavaScript | Direct in een **Web Worker** (geïsoleerd van de main thread) |
  | Andere talen (Go, Python, Rust, …) | Eerst **gecompileerd naar WebAssembly**, daarna in een Web Worker |

- Tests/assertions zijn JS-asserts die in de worker draaien en pass/fail terugsturen.
- **De runtime per taal wordt gekozen op het moment dat de taal wordt toegevoegd** (bv. Pyodide voor Python, tinygo voor Go) — geen vooraf vastgelegde matrix.
- **Failure-UX**: als een runtime niet kan laden (CDN-blok, corrupt bundle, browser-incompatibel), toont de editor een melding en blijft de code bewerkbaar — de gebruiker kan blijven leren, alleen niet runnen. Een runtime-failure voor één taal raakt geen andere talen of paginafuncties; het is altijd één taal-runtime tegelijk.
- **Security model**:
  - **Geen netwerk-toegang vanuit user-code** in de eerste release. `fetch`, `XMLHttpRequest` en sockets zijn geblokkeerd in de Web Worker via een gestripte global scope. Voorkomt data-exfiltratie via challenge-code.
  - **Whitelisted packages** voor talen met een package-ecosysteem (bv. Python via Pyodide). Alleen vooraf goedgekeurde packages zijn beschikbaar; de runtime weigert imports van andere modules. De whitelist groeit per onderwerp/hoofdstuk naarmate er behoefte ontstaat.
  - **CSP-headers**: de site heeft een aangepaste Content Security Policy die `'wasm-unsafe-eval'` en `'unsafe-eval'` toestaat (vereist door Pyodide en de JS-runner), maar `connect-src` strikt beperkt tot eigen origin + de AI-route. Geen wildcard-toestemming.

### 11. PWA & offline
- **Installeerbaar** als app op desktop en mobiel via Web App Manifest (icon, naam, theme-color).
- **Service worker** levert offline-werking:
  - **Cache-as-you-go**: pagina's die je hebt bezocht zijn daarna offline beschikbaar, samen met hun assets (CSS, JS, fonts, images)
  - **Geen blanket precache** in de eerste release — eerste site-bezoek blijft licht
  - Pagina's die je nooit hebt bezocht en geen netwerk hebben → offline-fallback met duidelijke melding
- **Expliciete download per module**: knop _"Download voor offline"_ per module (Syntax, Vuln, etc.) die de hele module-content forceert in de cache. Voortgangsindicator tijdens download. Module-grootte wordt vooraf getoond.
- Drafts (feature 2) en lokale tree-mutaties (feature 3) zitten al in localStorage en werken sowieso offline.
- Code-execution (feature 10) draait client-side en blijft offline werken zodra de WASM-runtime is gecached.

### 12. AI slide-panel
- Knop in de header opent een slide-panel à la nuxt.com.
- Chatbot met context van de huidige pagina.
- Panel klapt over de content heen en is dichtklapbaar.
- **Eerste release**: alleen chat-UI met basis-context (frontmatter + eerste deel van pagina-content), gestreamed via een server-route.
- **Failure-UX**: bij elke vorm van AI-uitval (offline, 5xx, rate-limit, timeout, provider down) toont het panel een nette melding _"AI is even niet beschikbaar"_ met één retry-knop — geen automatische retry-storms. **Andere features blijven volledig werken**; AI is bewust geïsoleerd in één panel zodat een AI-uitval nooit de docs zelf raakt.
- **Latere uitbreidingen**:
  - **LLM-text export** — elke pagina als gestructureerde, LLM-vriendelijke tekst aanleveren (markdown + metadata bundeltje)
  - **Full LLM-mode** — embeddings van de hele site + vector store, zodat de chatbot RAG kan doen over alle docs i.p.v. alleen de huidige pagina
  - **Wiki LLM** — gefinetuned/grounded model dat als kennis-assistent over de hele knowledge base optreedt
  - **Generatie-acties** vanuit de pagina-actiebalk dropdown (feature 4): _Genereer PowerPoint_, _Genereer documentatie_

### 13. Card trainer (flashcards / quiz / exam)
- Beschikbaar via de "Cards"-knop in de panel-switcher.
- Drie modes: **Flashcards**, **Quiz**, **Exam**.
- Bij keuze schuift een panel van links naar rechts in beeld (~70% van het scherm). Sluiten = panel weer naar links wegschuiven.
- Cards worden in de eerste release handmatig gedefinieerd in markdown frontmatter of in een aparte file naast de pagina.
- Auto-generatie uit pagina-inhoud (revisely-stijl) volgt later, gebruikt de AI-laag uit feature 12.

### 14. Comment-systeem
- Beschikbaar via panel-optie rechts.
- Replica van YouTube-comments: threaded replies, **likes**, sorteer op _Top_ / _Newest_.
- Ook bedoeld voor stemmen op feedback en verbetersuggesties.
- **Backend-keuze** (eigen backend vs. Giscus / Discourse / andere) wordt later gemaakt; eerste release levert de frontend-component met read-only stub of mock-data.
- **Moderation**: in de huidige scope (intern, alleen werknemers) niet nodig. Wordt pas relevant zodra een breder publiek toegang krijgt.

### 15. Search
- Cmd/Ctrl+K opent een command palette à la Nuxt UI's `CommandPalette`. Ook bereikbaar via het search-icoon in de header (feature 7).
- **Eerste release**: leunt op de **ingebouwde search uit Nuxt Content** — die levert direct full-text indexering, fuzzy matching en navigatie naar resultaten zonder een eigen index-pipeline te bouwen.
- **Latere iteraties** beantwoorden expliciet: wat geïndexeerd wordt (titels, headings, body, code-blocks), gedrag voor i18n (multi-locale of per-taal), offline-zoeken in PWA-context, en hoe in-app aangemaakte pagina's (feature 3) in de zoekindex landen. Een robuustere search (bv. Pagefind of MiniSearch met eigen index) is een upgrade-pad zodra de inhoud groeit.

### 16. Settings
Eigen pagina/dialog, ontworpen in **kaart-stijl** geïnspireerd op certificates.dev — meerdere kaarten in een grid, elke kaart één onderwerp. Vormgeving volgt de huisstijl van het kennishub-systeem zelf, niet die van certificates.dev.

Inhoud (eerste release):

- **Voorkeurstaal** — NL / EN, koppelt aan i18n (feature 9)
- **Thema** — light / dark, plus keuze uit een paar font-families en accent-kleuren binnen het ontwerp-systeem
- **Editor-voorkeuren** — fontgrootte, regel-hoogte, tab-size, optionele vim-mode (CodeMirror ondersteunt dit native)
- **Drafts beheren** — `Export drafts` (ZIP), `Import drafts` (ZIP), en _Wis alle lokale drafts_ met bevestigingsdialog. Dekt feature 2 en 3.
- **Profiel-informatie** (zichtbaar maar grotendeels niet-functioneel in Phase 1; volledig actief vanaf Phase 3 met IAM): naam, avatar, e-mail, _wachtwoord wijzigen_-link
- **UI-state reset** — wist alle onthouden UI-keuzes (zie hieronder)

**Onthouden UI-state**: panel-keuze, sidebar collapse-state, gekozen variant (bv. Junior/Mid/Senior op een JS-pagina), gekozen content-tab — opgeslagen in localStorage onder `ui:{key}` in de eerste release. Vanaf Phase 3 (IAM/SSO/SCIM/Entra) verhuist deze state naar het gebruikersprofiel zodat hij over apparaten heen synct.

### 17. Mobiele layout
Inspiratie: Nuxt Content's eigen documentatie en boot.dev op smal scherm. De drie-kolom-layout (sidebar | content | rechter panel) collapsed naar één kolom met overlays:

- **Header** blijft, met een hamburger-knop links die de sidebar als slide-in opent (van links).
- **Rechter panel** wordt een bottom-sheet of via een knop in de actiebalk oproepbare slide-in (van rechts), afhankelijk van de panel-keuze. Resize-handle vervalt op mobiel.
- **Pagina-actiebalk** blijft naast de H1, maar collapsed naar een dropdown-menu op extra-smalle schermen (bv. < 480px).
- **Card trainer overlay** (feature 13): op mobiel volledig scherm i.p.v. 70%.
- **Code editor** in de panel-switcher werkt als full-screen modal op mobiel zodat de gebruiker genoeg ruimte heeft om te typen.
- **Smart ToC**: niet als rechter panel maar als _"On this page"_-dropdown bovenaan de content (zelfde scroll-driven gedrag in de uitgevouwen state).
- Touch-doelen volgen WCAG 2.1 AA — minimaal 44×44px tap-area.

### 18. Toegang & private deployment
Het systeem is **niet bedoeld voor publiek of zoekmachines**. Dit is een ontwerp-keuze, geen toevoeging-achteraf:

- **`robots.txt`** met `Disallow: /` voor alle user-agents, plus expliciete `noindex, nofollow` meta-tags op iedere pagina.
- **Content-rendering achter auth-gate** in alle deployed omgevingen. Voor unauthenticated requests serveert de server alleen een login-pagina; daadwerkelijke pagina-content (markdown, frontmatter, search-index, assets) wordt niet meegestuurd. Rogue crawlers die robots.txt negeren krijgen dus letterlijk geen content om te indexeren.
- **Phase 1 / lokaal-development**: geen auth nodig; je draait de app op localhost.
- **Phase 1 / deployed POC**: minimale auth-laag — bv. een eenvoudige password-prompt of een platform-niveau auth (Cloudflare Access, basic auth) die voor de site staat. Geen eigen account-systeem nodig.
- **Phase 3+**: volledige IAM met SSO/SCIM/Entra (zie User Roles). De auth-gate wordt vervangen door de echte identity provider.
- Network-niveau extra (optioneel, op klant-keuze): WAN-exclusion / VPN-only access voor extra defense-in-depth.

### 19. Navigatie-systeem (cross-cutting)
Eén bron voor alle navigatie-surfaces — sidebar, header-dropdowns (feature 7), prev/next (feature 5), tab-bewuste smart ToC (feature 6), levels-collapse (feature 8). Geen `.navigation.yml`-bestanden, geen hardcoded arrays in components.

**Tree-bron** — opgebouwd uit drie lagen:
1. Filesystem walk via Nuxt Content's `queryCollectionNavigation`
2. Frontmatter per pagina en per directory's `index.md` (titel, icon, description, scope, nav-array, order, levels)
3. Merge van localStorage tree-mutations uit feature 3 — alleen client-side

De boom is reactief: iedere wijziging in een van de drie lagen triggert rerender van alle nav-surfaces.

**Sidebar-scope** — bepaald door één frontmatter-veld in een directory's `index.md`:

```yaml
scope: self      # deze directory is sidebar-root, toon hem zelf
scope: children  # toon alleen mijn kinderen, niet mij (vroegere "stripped"-gedrag)
# zonder veld: erft van parent — directory is geen scope-grens
```

Walk-up algoritme: vanaf de huidige route omhoog totdat een node met `scope: self` of `scope: children` gevonden wordt. Eén pad, één gedrag — geen runtime type-discrimination zoals in eerdere iteraties met aparte `standalone`/`stripped`-vlaggen. Geen match → fallback naar top-level categorie.

**Volgorde** in deze prioriteit:
1. **`nav: [...]` in `index.md`** — expliciete didactische volgorde voor hoofdstukken die als boek gelezen worden (Syntax, Kitt). Gebruikt **slugs** (filenames zonder `.md`), niet titles — anders breekt i18n en zou de array per taal moeten worden bijgehouden.
2. **`order: N` per pagina** — escape-hatch voor uitzonderingen (bv. een appendix die altijd onderaan moet, ongeacht wat de hoofdstuk-author in de `nav`-array zet)
3. **Alfabet op title** — fallback voor referentie-content (Knowledge Base) waar volgorde niet didactisch is

```yaml
# content/syntax/javascript/index.md — didactische volgorde verplicht
---
title: JavaScript
scope: children
nav: [variables, functions, closures, async, modules]
---
```

**Filenames blijven inhoudelijk**: `closures.md`, niet `1.intro.md` of `3.closures.md`. Tussenvoegen van een hoofdstuk = één regel toevoegen aan de `nav`-array. Geen renames, geen broken links, geen onleesbare git-blame.

**Header-dropdowns** lezen uit dezelfde boom — frontmatter levert icon en description per child. Een nieuwe taal toevoegen via feature 3 verschijnt automatisch in het Syntax-dropdown; geen handmatige sync met een hardcoded array.

**Prev/Next** wordt afgeleid uit de afgevlakte sidebar-boom in volgorde van de `nav`-array. **Variant-bewust**: blijft binnen de huidige variant zolang de doelpagina die variant ook heeft, anders fallback naar default-content.

**Varianten collapsen tot één nav-entry**. Drie files (`closures.junior.nl.md`, `closures.mid.nl.md`, `closures.senior.nl.md`) vormen tijdens het tree-bouwen één logische node `closures` met `meta.variants: ['junior','mid','senior']`. De page-component leest dat veld en rendert de variant-sub-header (feature 8). Switching via querystring (`?variant=junior`) — geen aparte routes.

**Sidebar-rendering — consistente indentatie** ongeacht of een scope chapters heeft of niet:

- **Scope met chapters** (bv. JavaScript met _Variables / Functions / Closures / Async / Modules_): scope-label bovenaan met icon. Daaronder de chapters als rijen met chevron. Een uitgevouwen chapter rendert zijn pages in een ingesprongen container.
- **Scope zonder chapters** (bv. Git met direct pages eronder): scope-label bovenaan met icon, **identiek**. Daaronder de pages **in dezelfde ingesprongen container** — alsof er een onzichtbaar standaard-chapter is. Geen chevron op de scope-label (de scope kun je niet collapsen terwijl je er in zit).

**Iconen verplicht**: élke chapter (en élke scope-label) heeft een icon, gedefinieerd in de frontmatter van die directory's `index.md`. Geen icon → render error tijdens de build. Reden: iconen zijn niet alleen decoratie maar dragen mede de overflow-collapse (feature 8) en de header-dropdown rendering — een ontbrekende icon breekt UX-flows downstream.

**Active-page indicator — één doorlopende verticale lijn**: pages binnen een ingesprongen container delen één continue verticale lijn aan hun linkerkant. Die lijn is grijs voor inactieve pages en kleurt blauw exact op de hoogte van de actieve page — niet twee parallelle lijnen met een gat ertussen. Implementatie-hint: elke page heeft zelf een `border-left` (1.5px), default in de tertiary-border-kleur; de active swap't naar de info-kleur. Geen `border-left` op de container-wrapper. Resultaat is één visuele lijn die geleidelijk de pages markeert en bij de actieve duidelijk inkleurt.

**Resultaat**: pages staan altijd ingesprongen onder een gelabeld parent (scope of chapter), met een verticale lijn die de groep visueel afbakent en de active page markeert zonder dubbele lijnen. Een Git-pagina en een JavaScript-pagina hebben hetzelfde visuele rhythm in de sidebar — alleen het aantal hierarchie-niveaus verschilt.

**`index.md` is geen losse nav-entry**: een directory's `index.md` rendert _als de directory zelf_ (scope- of chapter-overview) en verschijnt niet als kind van zichzelf in de nav-tree. Klik op een chapter in de sidebar → `chapter/` → render `chapter/index.md`. De index is altijd onzichtbaar in zijn parent's children-lijst.

**UI-state** (sidebar-collapse, gekozen panel, gekozen tab) is gebruiker-voorkeur, geen content-config. Woont in localStorage onder `ui:{key}` (feature 16). Vanaf Phase 3 verhuist deze state naar het gebruikersprofiel.

**Performance** — naast de boom een platte `Map<path, node>` voor O(1) lookups. Sidebar scope-walk wordt daarmee ~5 lookups per page change in plaats van een full tree-walk.

**Build- vs runtime-merge** — bij SSG kent de server alleen filesystem + frontmatter. De client merget localStorage-mutaties na hydratie; lokaal aangemaakte items verschijnen dus pas na hydratie. Acceptabel omdat ze per definitie privé zijn en niet in de eerste paint horen.

---

## Technical Stack

- **Framework** — Nuxt 4 (Nuxt 3 is end-of-life op 31 juli 2026; nieuwe projecten starten op v4)
- **UI-componenten** — Nuxt UI (`content-surround`, `content-toc`, `dashboard-resize-handle`, `navigation-menu`, `input` met copy-button)
- **Iconen** — `@nuxt/icon` (Iconify) als enige iconen-bron, **lokaal gebundeld** (geen runtime-CDN-dependency). Gebruikte icon-sets worden geïnstalleerd als devDependencies (`@iconify-json/lucide`, `@iconify-json/tabler`, `@iconify-json/simple-icons`, etc.) en `@nuxt/icon` is geconfigureerd met `serverBundle: 'local'` zodat de Iconify-API nooit op runtime wordt aangeroepen — een Iconify-CDN-uitval kan de site dus niet raken. Iedere icon-referentie gaat via een Iconify-set (bv. `lucide:search`, `tabler:code`, `simple-icons:javascript`). **Custom SVG's alleen als er geen geschikte Iconify-icon bestaat**, en dan opgeslagen als losse component onder `app/components/icons/` zodat ze net zo aanroepbaar zijn als Iconify-icons. Geen losse inline SVG's verspreid door de codebase.
- **Content** — Nuxt Content (markdown rendering, tabs, frontmatter)
- **Internationalisatie** — `@nuxtjs/i18n`
- **Code-editor** — CodeMirror 6
- **Code-execution** — Web Workers voor alle talen; WebAssembly voor non-JS talen (runtime per taal te kiezen op moment van toevoegen, bv. Pyodide voor Python, tinygo voor Go)
- **PWA** — `@vite-pwa/nuxt` met Workbox; service worker met cache-as-you-go runtime-strategie
- **Persistentie eerste release** — browser-localstorage voor zowel pagina-drafts (feature 2) als sidebar tree-mutaties (feature 3)
- **Persistentie volgende fase** — migratie naar **IndexedDB** zodra drafts en lokale content-mutaties significant groeien
- **Persistentie latere fases** — git commit / PR-flow op GitHub als bron-van-waarheid voor content; database komt pas in beeld voor non-content data (gebruikers, comments, audit logs)
- **Deployment eerste release** — statisch gegenereerd (Nuxt SSG) op een hosted edge-platform (Cloudflare Pages of Vercel), met de AI-route als edge-function
- **Deployment latere fases** — **Dockerized build** (multi-stage Dockerfile met de SSG-output en een lichte Node-server voor de AI- en backend-routes), zodat de app draaibaar is op Azure, AWS, andere clouds én lokaal/on-prem. Hierop bouwen IAM, SSO/SCIM en privé-deployments voort.
- **Code quality** — `@nuxt/eslint` (project-aware module die een Nuxt-bewuste basis-flat-config genereert in `.nuxt/eslint.config.mjs` plus de ESLint Config Inspector levert in Nuxt DevTools) gecombineerd met `@antfu/eslint-config` (stylistic preset: tabs, single quotes, no semicolons) als bron-van-waarheid via `withNuxt(antfu({...}))`. `.editorconfig`, `.vscode/settings.json` en pre-commit hooks (`simple-git-hooks` + `lint-staged`) ondersteunen ESLint zonder eigen mening — geen Prettier voor JS/TS/Vue. AI-context staat in `AGENTS.md` (canonical), met `CLAUDE.md` / `GEMINI.md` als pointers naar dezelfde bron. CI runt lint + typecheck + tests op iedere PR.
