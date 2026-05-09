# 1000x — Features

---

## 1. Markdown rendering & content-engine

De fundering: iedere docs-pagina is een markdown-bestand met frontmatter, gerenderd via Nuxt Content met code-blocks, callouts, embeds, content-tabs en assets. Voor lezers, auteurs en alle downstream features (sidebar, ToC, search, varianten) die op deze content-laag bouwen.

**User flow**
1. Lezer opent een pagina-URL en krijgt de gerenderde markdown te zien.
2. Lezer scrollt door H1–H4 koppen, code-blocks en eventuele content-tabs.
3. Lezer klikt op een tab in de content om een gecondenseerd deel van de pagina te tonen zonder te navigeren.
4. Lezer klikt een afbeelding of embed aan om de bijbehorende media te zien.

**UI overview**
Pagina-content vult de middenkolom met prose-styling (koppen met anchor-links, syntax-highlighted code-blocks, callouts, afbeeldingen). Content-tabs verschijnen als een horizontale tab-rij binnen de pagina; bij overflow scrollt de rij horizontaal met een subtiele schaduw aan de zichtbare rand. Frontmatter is niet zichtbaar maar bepaalt titel, beschrijving en gedrag van de pagina in andere surfaces.

---

## 2. Section sidebar

Eén navigatie-tree die zichzelf bouwt uit het filesystem en frontmatter, en alle nav-surfaces voedt: sidebar, header-dropdowns, prev/next, ToC, breadcrumb. Voor lezers die door modules en hoofdstukken navigeren en voor auteurs die hun structuur in markdown bepalen.

**User flow**
1. Lezer komt op een pagina en ziet links de sidebar met de scope van die pagina (bv. JavaScript, Git, Vuln).
2. Lezer klapt een hoofdstuk uit door op de chevron rechts te klikken.
3. Lezer klikt op een pagina-rij en navigeert naar die pagina; de actieve indicator verschuift mee.
4. Lezer collapsed/expand de sidebar volledig via de UI-state-knop; de keuze blijft onthouden.

**UI overview**
Linker zijbalk met een scope-label bovenaan (icon + titel), daaronder hoofdstukken met chevron-rechts of direct pages in een ingesprongen container. Een doorlopende verticale lijn loopt langs de pagina-rijen en kleurt blauw op de hoogte van de actieve pagina. Iconen zijn verplicht op iedere chapter en scope; ontbrekende iconen breken de build.

---

## 3. Header met dropdown-menu's

Top-bar in drie zones — logo links, hoofdmenu **gecentreerd in het midden**, vijf icon-only actie-knoppen rechts. Voor lezers om snel tussen modules te springen en voor de mini-app-launchers (search, AI, taal, thema, settings).

**User flow**
1. Lezer hovert of klikt op een hoofdmenu-item (bv. _Syntax_) en ziet de sub-items uit de content-tree als dropdown.
2. Lezer klikt een sub-item en navigeert naar die module.
3. Lezer klikt op een actie-knop rechts (search, AI, i18n, thema, settings).
4. Lezer klikt een hoofdmenu-item zonder children (bv. _The Lab_); dat navigeert direct zonder dropdown.

**UI overview**
Drie-zone-layout: logo links, zes hoofdmenu-items horizontaal gecentreerd in het midden (met chevron-indicator wanneer ze een dropdown hebben), en vijf icon-only knoppen rechts (Search, AI, i18n, light/dark, Settings). De divider onder de header loopt edge-to-edge over de outer container; de active-state-underline van een geselecteerd menu-item landt op die divider — geen zwevende lijn met een gat ertussen. Dropdowns tonen sub-items met icon, titel en korte beschrijving uit de frontmatter van de child-directory.

---

## 4. Internationalisatie

NL als standaardtaal, EN als secundair, voor zowel UI-strings als markdown-content. Voor alle lezers die in hun voorkeurstaal willen werken, en auteurs die per taal aparte markdown-files onderhouden.

**User flow**
1. Lezer klikt het i18n-icoon in de header en kiest tussen NL en EN.
2. UI-strings wisselen onmiddellijk; de URL behoudt de gekozen taal.
3. Lezer landt op een pagina; de juiste taal-variant van de markdown (`page.nl.md` of `page.en.md`) wordt geserveerd.
4. Lezer maakt een lokale draft of pagina aan; die wordt onder de huidige taal gescheiden bewaard.

**UI overview**
Taalwissel via een icon-only knop in de header, opent een kleine menu met NL/EN. Geen tekst-label naast het icoon. Voor lezers is de wissel onzichtbaar verder dan een refresh van strings en content; voor auteurs zijn taalvarianten zichtbaar als aparte filenames in de content-tree.

---

## 5. Rechter panel met conditionele panel-switcher en smart ToC

Rechter kolom met standaard de ToC, en een knoppenrij bovenaan om het panel te wisselen naar code-editor, card trainer, comments of (later) graph/news. De panel-container blijft staan bij elke wissel; alleen de inhoud verwisselt. Voor lezers die context-gebonden tools naast de pagina willen, niet als losse modals.

**User flow**
1. Lezer scrollt door de pagina; de ToC rechts highlight automatisch het zichtbare hoofdstuk.
2. Lezer klikt een knop bovenaan het panel en wisselt **direct** naar een andere view (bv. Code editor) — de container blijft staan, alleen de inhoud verwisselt.
3. Lezer sleept de resize-handle tussen content en panel om de breedte aan te passen.
4. Lezer klikt de close-toggle in de actiebalk (of gebruikt de toetsenbordcombinatie) en sluit het panel volledig; de content-kolom krijgt de vrijgekomen breedte.
5. Lezer schakelt content-tabs in de pagina; de ToC herrendert om alleen koppen van de actieve tab te tonen.

**UI overview**
Smalle rechter kolom (default ~280px breed; resize-handle staat min ~220 / max ~480px toe) met bovenaan een rij icon-only panel-switcher knoppen; welke knoppen zichtbaar zijn hangt af van de pagina. Daaronder de actieve view (ToC default), met scroll-driven expand/collapse van H3/H4 onder H2's. Op desktop staat het panel standaard open en is volledig sluitbaar via een toggle in de actiebalk; bij open/dicht-wissel geeft of neemt het panel breedte van de content-kolom. View-switches zijn instant: **geen kruislingse fade of slide-animatie tussen panels** — de container blijft staan, de resize-handle blijft op zijn plek. Open/dicht-staat, breedte en actieve view worden onthouden via `ui:{key}` in localStorage.

---

## 6. Changelog en navigatie onderaan pagina

Onder de content een commit-history-timeline van die pagina, gevolgd door prev/next-kaarten. Voor lezers die willen zien wanneer en waarom een pagina wijzigde, en die door een hoofdstuk willen lezen als een boek.

**User flow**
1. Lezer scrollt naar het einde van de content en ziet eerst de changelog.
2. Lezer klikt een commit-hash of PR-link om de bron te bekijken.
3. Lezer scrollt verder en ziet prev/next-kaarten gebaseerd op de sidebar-volgorde.
4. Lezer klikt _Volgende_ en gaat naar de volgende pagina binnen de huidige variant.

**UI overview**
Verticale timeline met versie-tags en commit-rijen (hash-chip, avatar, auteur, bericht, optionele PR-link), één doorlopende lijn langs alle items. Onder de changelog twee kaarten naast elkaar (prev en next) met titel en context; aan een eindpunt blijft de niet-beschikbare kant zichtbaar maar gedimd, met een fallback één niveau hoger.

---

## 7. Pagina-actiebalk

Vier knoppen inline naast de pagina-titel, gegroepeerd in twee segmented buttons: View/Edit en Copy page + dropdown-chevron. Voor lezers die snel willen schakelen tussen lezen en bewerken, en die de pagina willen exporteren of openen in een externe LLM.

**User flow**
1. Lezer klikt _Edit_ in het eerste segmented button en wisselt naar de markdown-editor.
2. Lezer klikt _View_ om terug te schakelen naar de gerenderde versie.
3. Lezer klikt _Copy page_ en kopieert de pagina-content naar het klembord.
4. Lezer klikt de chevron en kiest een optie zoals _Open in Claude_ of _View as markdown_.

**UI overview**
Twee aaneengesloten button-groepen direct rechts van de H1, met een kleine gap tussen de groepen. Het actieve segment heeft een gevulde achtergrond, het andere blanco; een verticale divider scheidt segmenten binnen één groep. De chevron-knop opent een dropdown met copy- en export-opties.

---

## 8. Sub-header met variant-tabs

Secundaire navigatie-balk onder de header voor pagina's met meerdere varianten (bv. Junior/Mid/Senior, Aanvaller/Verdediger, Windows/Linux/macOS). Voor lezers die dezelfde inhoud op hun eigen niveau of perspectief willen lezen, en auteurs die varianten in aparte files onderhouden.

**User flow**
1. Lezer landt op een pagina met varianten en ziet een tab-rij onder de header.
2. Lezer klikt een variant-tab en de pagina-content vervangt naar die variant.
3. Lezer kopieert de URL inclusief `?variant=…` om die variant te delen.
4. Lezer komt terug op een pagina met varianten en ziet zijn laatste keuze geselecteerd.

**UI overview**
Smalle horizontale balk onder de header met variant-tabs (icon + label). Bij overflow collapsen non-actieve varianten naar icon-only; de actieve blijft icon + label, met label-tooltip op hover voor de gecollapsde tabs. De divider onder de sub-header loopt edge-to-edge over de outer container — geen inset of whitespace aan de zijkanten — en de active-state-underline overlapt die divider voor een gefuseerde look in plaats van drie horizontale lijnen vlak boven elkaar (consistent met de header-divider, feature 3).

---

## 9. Search

Command palette via Cmd/Ctrl+K of het search-icoon in de header, full-text over titels, koppen, body en code-blocks. Voor lezers die snel willen springen in plaats van klikken door de sidebar.

**User flow**
1. Lezer drukt Cmd/Ctrl+K of klikt het search-icoon.
2. Lezer typt een query; resultaten verschijnen real-time.
3. Lezer navigeert met pijltjestoetsen door de resultaten.
4. Lezer drukt Enter en springt direct naar het gekozen resultaat.

**UI overview**
Command palette in het midden van het scherm met een input bovenaan en een gegroepeerde resultaten-lijst eronder (per module of categorie). Elke regel toont titel, breadcrumb-pad en een korte snippet. Sluit met Esc; toetsenbord-affordances staan in de palette zelf, niet in de header-knop.

---

## 10. View / Edit-toggle met lokale drafts

Bewerk-modus per pagina met live markdown-editor; alle wijzigingen worden in browser-localstorage bewaard onder een sleutel per taal en pagina. Voor lezers die direct correcties of aanvullingen willen maken zonder een backend, account of netwerk.

**User flow**
1. Lezer klikt _Edit_ in de actiebalk en de pagina opent in een live markdown-editor.
2. Lezer typt; wijzigingen worden continu in localStorage bewaard.
3. Lezer ververst de pagina; de draft komt automatisch terug, met een banner _"je hebt onopgeslagen wijzigingen"_.
4. Lezer opent Settings en exporteert alle drafts als ZIP (of importeert een eerder geëxporteerde set).

**UI overview**
Edit-mode vervangt de gerenderde content door een full-width markdown-editor met monospace font; de actiebalk toont _View_ als terug-knop. Een banner bovenaan de pagina signaleert onopgeslagen wijzigingen en blijft zichtbaar tot reset. Bij vol localStorage verschijnt een melding met directe acties (export / wis oude drafts).

---

## 11. In-app content management

Nieuwe hoofdstukken, pagina's, varianten en content-tabs aanmaken vanuit de UI zonder de codebase te openen; alle structuur-mutaties leven als overlay in localStorage. Voor lezers/auteurs die docs willen uitbreiden zonder build-cyclus, en als basis voor latere git-PR-flow.

**User flow**
1. Lezer klikt _"+ nieuw hoofdstuk"_ onderaan de chapter-lijst van een module.
2. Een inline input verschijnt; lezer typt de naam en drukt Enter.
3. Het nieuwe item verschijnt direct in de sidebar; bij een pagina/variant/tab opent het meteen in edit-mode.
4. Lezer rechtsklikt een bestaand item en kiest _rename_ of _delete_ uit het context-menu.

**UI overview**
Onder vertikale lijsten (chapters, pages) verschijnt een subtiele _"+ nieuw …"_ rij met gestippelde rand om het `+`-icoon. Bij horizontale tab-rijen (variants, content-tabs) staat een klein `+`-icoontje sticky aan het einde, altijd zichtbaar tijdens scroll. Klik triggert een inline input; rechtermuisknop op bestaande items toont een context-menu met rename/delete.

---

## 12. Settings

Eigen pagina/dialog in kaart-stijl voor voorkeuren: taal, thema, editor-instellingen, drafts beheren, profiel, UI-state reset. Voor lezers om hun werkomgeving te tunen, en als centraal punt voor data-loss safety net (export/import drafts).

**User flow**
1. Lezer klikt het settings-icoon rechts in de header.
2. Lezer kiest een kaart (bv. _Thema_) en wijzigt voorkeuren; wijzigingen worden direct toegepast.
3. Lezer klikt _Export drafts_ in de Drafts-kaart en downloadt een ZIP.
4. Lezer klikt _UI-state reset_ en bevestigt; alle onthouden UI-keuzes worden gewist.

**UI overview**
Grid van kaarten, elk één onderwerp (Voorkeurstaal, Thema, Editor-voorkeuren, Drafts, Profiel, UI-state reset). Vormgeving volgt de huisstijl van het 1000x-systeem. Iedere kaart bevat de relevante controls (toggles, dropdowns, knoppen); destructieve acties zoals _Wis alle drafts_ en _UI-state reset_ vragen een bevestigingsdialog.

---

## 13. Code-editor met browser-based execution

Code-editor als panel-optie in de panel-switcher op pagina's met een programmeertaal of code-use-case; alle execution draait client-side in Web Workers (JS direct, andere talen via WebAssembly). Voor lezers die challenges willen doen en code willen uitvoeren zonder backend.

**User flow**
1. Lezer klikt de _Code editor_ knop in de panel-switcher; ToC wordt vervangen door de editor.
2. Lezer typt of bewerkt code in de editor.
3. Lezer drukt _Run_; de code draait in een Web Worker met optionele WASM-runtime.
4. Lezer ziet pass/fail-feedback van de challenge-asserts onder de editor.

**UI overview**
Code-editor (CodeMirror 6) vervangt de inhoud van het rechter panel; resize-handle blijft werken zodat de editor breder kan. Bovenaan een Run-knop en taal-indicator; output en pass/fail-feedback verschijnen onder de editor. Bij een runtime-failure (CDN-blok, corrupt bundle) toont de editor een melding maar blijft de code bewerkbaar.

---

## 14. Card trainer (flashcards / quiz / exam)

Drie leer-modes — Flashcards, Quiz, Exam — beschikbaar via de Cards-knop in de panel-switcher; cards worden in markdown frontmatter of een aparte file naast de pagina gedefinieerd. Voor lezers die actief willen oefenen en kennis willen toetsen op iedere docs-pagina.

**User flow**
1. Lezer klikt de Cards-knop in de panel-switcher en kiest een mode (Flashcards / Quiz / Exam).
2. Een panel schuift van links naar rechts in beeld (~70% van het scherm).
3. Lezer doorloopt de cards/vragen; pass/fail-feedback verschijnt direct.
4. Lezer sluit het panel; het schuift weer naar links weg.

**UI overview**
Slide-in panel dat ~70% van het scherm bedekt (volledig scherm op mobiel). Kaartjes of vragen vullen het panel met een centrale focus; navigatie-knoppen en progress-indicator onderaan. Sluit-knop rechtsboven; de docs-content blijft erachter zichtbaar als context.

---

## 15. Comment-systeem

YouTube-stijl comments met threaded replies, likes en sortering op _Top_ / _Newest_, beschikbaar als panel-optie. Voor lezers om vragen te stellen en feedback te geven, en (via likes) om te stemmen op verbetersuggesties.

**User flow**
1. Lezer klikt de Comments-knop in de panel-switcher.
2. Lezer leest bestaande threads, sorteert op _Top_ of _Newest_.
3. Lezer schrijft een comment of reply (in latere fase met IAM; eerste release read-only of mock).
4. Lezer klikt een like-knop op een interessante comment.

**UI overview**
Comments-view in het rechter panel met sorteer-tabs bovenaan (_Top_ / _Newest_), daaronder een lijst van comment-items met avatar, naam, tijd, body, like-knop en _reply_-affordance. Replies zijn ingesprongen onder hun parent. Eerste release toont read-only stub of mock-data; backend-keuze volgt later.

---

## 16. Mobiele layout

De drie-kolom-layout (sidebar | content | rechter panel) collapsed naar één kolom met overlays op smal scherm. Voor lezers die op telefoon of tablet werken en een touch-vriendelijke interface verwachten.

**User flow**
1. Lezer opent de site op een mobiel scherm en ziet één kolom met content.
2. Lezer tikt de hamburger-knop links in de header; de sidebar slidet als overlay van links in.
3. Lezer tikt een knop in de actiebalk; het rechter panel verschijnt als bottom-sheet of slide-in van rechts.
4. Lezer tikt _On this page_ bovenaan de content; een dropdown toont de scroll-driven ToC.

**UI overview**
Header blijft zichtbaar met hamburger-knop links en de vijf actie-knoppen (mogelijk in een overflow-menu). Content vult de volledige breedte; sidebar en rechter panel zijn overlays. Pagina-actiebalk collapsed naar een dropdown-menu op extra-smalle schermen (< 480px); card trainer en code-editor draaien full-screen. Touch-doelen voldoen aan WCAG 2.1 AA (≥ 44×44px).

---

## 17. PWA en offline-werking

Installeerbaar als app op desktop en mobiel via Web App Manifest, met service-worker cache-as-you-go en expliciete _"Download voor offline"_ per module. Voor lezers die offline willen werken (in trein, vliegtuig, op locatie) en die de app als native ervaring willen.

**User flow**
1. Lezer ziet een _Install_-prompt of installeert handmatig via de browser.
2. Lezer opent de geïnstalleerde app; deze gedraagt zich als een native app.
3. Lezer bezoekt pagina's met netwerk; deze worden opgeslagen in de cache voor later.
4. Lezer klikt _Download voor offline_ op een module en ziet een voortgangsindicator; daarna is de hele module offline beschikbaar.

**UI overview**
Een install-prompt verschijnt browser-native of via een eigen knop. In Settings (of per module) staat een _Download voor offline_ knop met een vooraf-getoonde module-grootte en tijdens download een voortgangsbalk. Niet-bezochte pagina's tonen offline een fallback-melding. Drafts en lokale tree-mutaties werken sowieso offline.

---

## 18. Toegang en private deployment

Het systeem is niet bedoeld voor publiek of zoekmachines: `robots.txt Disallow: /`, `noindex/nofollow` meta-tags, en content-rendering achter een auth-gate in alle deployed omgevingen. Voor de organisatie die docs strikt intern wil houden en voor lezers die een login-flow doorlopen voor toegang.

**User flow**
1. Niet-geauthenticeerde lezer opent een deployed URL en ziet alleen een login-pagina.
2. Lezer voert credentials of platform-niveau auth in (bv. Cloudflare Access, basic auth in Phase 1).
3. Na succesvolle auth wordt de daadwerkelijke pagina-content geladen.
4. Crawler die robots.txt negeert krijgt geen content terug — alleen de login-pagina.

**UI overview**
Login-pagina als enige zichtbare oppervlak voor niet-geauthenticeerde requests; minimaal en branded. Na inlog komt de gewone app tevoorschijn (header, sidebar, content). In lokale development is geen auth nodig en is dit scherm afwezig. Phase 3+ vervangt de auth-gate door SSO/SCIM/Entra zonder UI-breuk.

---

## 19. AI assistent in slide-panel

Knop in de header opent een chat-panel à la nuxt.com met context van de huidige pagina, gestreamd via een server-route. Voor lezers die de docs als kennis-assistent willen gebruiken en pagina-specifieke vragen willen stellen.

**User flow**
1. Lezer klikt het AI-icoon rechts in de header.
2. Een slide-panel klapt over de content heen; lezer typt een vraag.
3. Het antwoord streamt regel-voor-regel terug, met pagina-context als basis.
4. Lezer sluit het panel via de X of door buiten het panel te klikken.

**UI overview**
Slide-panel rechts dat over de content heen klapt; bovenaan een titel en sluit-knop, daaronder de chat-history en onderin een input-veld met send-knop. Antwoorden streamen real-time. Bij AI-uitval verschijnt een nette melding _"AI is even niet beschikbaar"_ met één retry-knop; andere features blijven volledig werken.

---

## 20. Wiskundige formules en diagrammen

KaTeX voor inline (`$…$`) en block-niveau (`$$…$$`) wiskunde, Mermaid voor diagrammen via code-blocks; beide opt-in per pagina zodat de runtime alleen laadt waar nodig. Voor auteurs van security/CS-content (cryptografie, complexity, attack-flows, sequence diagrams).

**User flow**
1. Auteur schrijft `$$E = mc^2$$` in een markdown-pagina.
2. Lezer opent de pagina; KaTeX laadt automatisch en rendert de formule.
3. Auteur schrijft een ` ```mermaid `-block met een flowchart-definitie.
4. Lezer ziet het gerenderde diagram inline tussen de prose.

**UI overview**
Wiskunde verschijnt inline of als gecentreerde block-formule met KaTeX-styling, identiek aan de gangbare conventies. Mermaid-diagrammen renderen op de plek van het code-block, schalen met container-breedte en passen het thema (light/dark) aan. Pagina's zonder formules of diagrammen laden de runtimes niet.

---

## 21. Image lightbox

Klik op een afbeelding opent een fullscreen overlay met de volledige resolutie en de markdown alt-text als caption. Voor lezers die screenshots, diagrammen en network-visualisaties willen inzoomen op detail-niveau.

**User flow**
1. Lezer klikt op een afbeelding in de pagina.
2. Een fullscreen overlay verschijnt met de afbeelding op volledige resolutie.
3. Lezer leest de caption (alt-text) onder of boven de afbeelding.
4. Lezer sluit met Esc, klik buiten de afbeelding, of de sluit-knop.

**UI overview**
Donkere fullscreen overlay met de afbeelding gecentreerd; caption uit de markdown alt-text in subtiele typografie naast of onder de afbeelding. Sluit-knop rechtsboven en achtergrond-klik beide actief. v1 levert geen multi-image gallery, geen pinch-to-zoom, geen image-annotaties — bewust afgebakend.

---
