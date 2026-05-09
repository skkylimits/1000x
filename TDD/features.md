# Documentatie- & Leersysteem — Features

---

## 1. Markdown rendering & content-engine

Een markdown-engine die pagina's met headings, code blocks, in-page tabs, callouts en media als gestylede documentatie rendert voor lezers van het 1000x-systeem.

**Gebruikersflow**
1. Gebruiker navigeert naar een pagina via sidebar, search of een link
2. Pagina rendert met opgemaakte markdown — koppen, code blocks, callouts, afbeeldingen
3. Heeft de pagina tabs, dan klikt de gebruiker tussen tabs om verschillende doorsnedes van het onderwerp te zien
4. Bij meer tabs dan in beeld passen scrollt de tab-rij horizontaal met touch-swipe of trackpad
5. Gebruiker klikt op een heading-anchor om een deelbare URL te kopiëren

**UI-overzicht**
Pagina-content rendert met standaard documentatie-typografie en ruime regelhoogte. Code blocks krijgen syntax-kleuren en een copy-knop in de hoek. Een in-page tab-rij verschijnt direct onder secties met meerdere tabs, met de actieve tab visueel gemarkeerd en een schaduw aan de rand wanneer er meer tabs buiten beeld staan. Callout-blokken en inline afbeeldingen breken de tekst waar relevant.

---

## 2. Section sidebar

Een linker navigatie-balk die de hoofdstukken en pagina's binnen de huidige sectie toont, en de foundation vormt voor alle navigatie in het systeem.

**Gebruikersflow**
1. Gebruiker navigeert naar een sectie zoals JavaScript, Git of AI
2. Sidebar toont alleen die sectie — niet aanverwante onderwerpen
3. Gebruiker klikt op een hoofdstuk-chevron om de pagina's eronder uit te klappen
4. Gebruiker klikt op een pagina om er naartoe te navigeren
5. Gebruiker rechts-klikt op een item om hernoemen of verwijderen op te roepen

**UI-overzicht**
Bovenaan staat een scope-label met icoon dat de huidige sectie aangeeft. Hoofdstukken hebben chevrons die uitvouwen naar pagina-rijen ingesprongen onder hun parent. Een doorlopende verticale lijn links van de pagina-rijen markeert de groep — grijs voor inactieve pagina's en accent-gekleurd op de actieve rij, niet twee parallelle lijnen. Onderaan relevante lijsten staan inline rijen voor het toevoegen van nieuwe hoofdstukken of pagina's.

---

## 3. Header met dropdown-menu's

Een persistente bovenbalk met logo, zes categorie-dropdowns en vijf icon-only actie-knoppen waarmee elke gebruiker tussen modules en globale acties kan navigeren.

**Gebruikersflow**
1. Gebruiker klikt op een categorie in het midden om de dropdown met sub-items te openen
2. Heeft een categorie maar één direct kind, dan navigeert klikken direct naar de overview zonder dropdown
3. Gebruiker klikt op één van de rechter icoon-knoppen voor Search, AI, taalwissel, light/dark of Settings
4. Search opent een command palette die ook bereikbaar is via een toetsenbord-shortcut

**UI-overzicht**
Logo links, klikbaar naar home. Zes categorie-labels in het midden, met een chevron als ze een dropdown hebben en zonder als directe link. De actieve categorie krijgt een onderstreping die exact op de bottom-divider van de header landt. Vijf icon-only knoppen rechts zonder tekst-labels of toetsenbord-affordances in de UI.

---

## 4. Internationalisatie

Multi-language ondersteuning waarmee gebruikers tussen Nederlands (default) en Engels kunnen wisselen, met UI-tekst en content beide vertaalbaar.

**Gebruikersflow**
1. Gebruiker klikt op het taal-icoon in de header
2. Een taal-picker toont de beschikbare talen
3. Gebruiker kiest een taal; de UI en content switchen meteen
4. De keuze wordt onthouden over sessies heen

**UI-overzicht**
Het taal-icoon in de rechter knoppenrij van de header opent een picker als popover of dropdown met de beschikbare talen en een selectie-indicator. Alle zichtbare tekst — knoppen, labels, navigatie, content — switcht naar de gekozen taal. Pagina's tonen indien beschikbaar de variant in de gekozen taal, anders een fallback met indicator dat alleen de andere taal beschikbaar is.

---

## 5. Rechter panel met panel-switcher en smart Table of Contents

Een instelbaar rechter paneel dat standaard de inhoudsopgave van de huidige pagina toont en kan switchen naar andere views afhankelijk van de pagina.

**Gebruikersflow**
1. Gebruiker opent een pagina; het rechter paneel toont standaard de ToC
2. Gebruiker sleept de divider tussen content en paneel om de breedte aan te passen
3. Gebruiker klikt op een icoon bovenaan het paneel om naar een andere view te switchen
4. Gebruiker scrollt door de pagina; sub-koppen klappen automatisch open zodra hun parent-H2 voorbij is gescrolld
5. Wisselt de gebruiker een content-tab op de pagina, dan herrendert de ToC naar die tabs koppen

**UI-overzicht**
Een resizable kolom rechts van de content met bovenaan een rij icon-only knoppen voor elke beschikbare view en tooltips bij hover. De ToC-view toont een lijst met koppen waarbij de huidig zichtbare kop gehighlight is. Geen expand/collapse-pijltjes — uitvouwen is volledig scroll-gestuurd. Andere views vervangen de ToC binnen hetzelfde paneel.

---

## 6. Changelog en navigatie onderaan pagina

Een blok onderaan elke pagina met de wijzigingsgeschiedenis en kaarten naar de vorige en volgende pagina in leesvolgorde.

**Gebruikersflow**
1. Gebruiker scrollt naar het einde van de pagina-content
2. Een changelog-blok toont recente wijzigingen — datum, auteur, korte beschrijving
3. Daaronder staan twee kaarten met Vorige en Volgende pagina-titels in leesvolgorde
4. Gebruiker klikt op een kaart om naar de aangrenzende pagina te navigeren
5. Op de eerste of laatste pagina van een sectie is de niet-beschikbare kaart gedimd en wijst naar een fallback één niveau hoger

**UI-overzicht**
Het changelog-blok heeft een heading Wijzigingen met een lijst gedateerde entries. Eronder staan twee kaarten naast elkaar van gelijke breedte met chevron-iconen die richting aanduiden. Een gedimde kaart op het eindpunt van een sectie toont een fallback-bestemming zoals "Sectie-overzicht" in plaats van leeg te zijn. Volgorde op de pagina is altijd content, daarna changelog, daarna prev/next.

---

## 7. Pagina-actiebalk

Een rij actie-knoppen inline naast de paginatitel voor het wisselen tussen lezen en bewerken, en het kopiëren of openen van de pagina-inhoud in andere tools.

**Gebruikersflow**
1. Gebruiker bekijkt een pagina; de actiebalk staat rechts naast de titel
2. Gebruiker klikt View of Edit om tussen lezen en bewerken te wisselen
3. Gebruiker klikt Copy page om de hele pagina-inhoud naar het klembord te kopiëren
4. Gebruiker klikt op de chevron voor extra opties: Copy as markdown, Open in Claude, Open in ChatGPT, View as markdown

**UI-overzicht**
Twee segmented buttons naast de H1 met een kleine gap tussen de groepen. De eerste segmented button toont View en Edit met het actieve segment gevuld en een verticale divider tussen. De tweede combineert Copy page met een chevron via een gedeelde rounded border, ook met een verticale divider. Klik op de chevron opent een dropdown met aanvullende kopieer- en open-opties.

---

## 8. Sub-header met variant-tabs

Een optionele tweede nav-rij voor pagina's met meerdere varianten van dezelfde inhoud — skill-niveaus, perspectieven, OS-keuzes — zodat gebruikers tussen vergelijkbare versies kunnen schakelen.

**Gebruikersflow**
1. Gebruiker opent een pagina met varianten; de sub-header toont de variant-tabs met icon en label
2. Gebruiker klikt op een variant om te switchen — de pagina rendert opnieuw met die variant-content
3. De gekozen variant blijft zichtbaar in de URL zodat links deelbaar zijn
4. Past de rij niet op het scherm, dan collapsen niet-actieve tabs naar icon-only en houdt de actieve tab icon plus label
5. Gebruiker hovert over een collapsed icoon om het label als tooltip te zien

**UI-overzicht**
Een horizontale tab-rij onder de hoofd-header met iedere tab als icoon plus label, of icon-only bij overflow. De actieve tab krijgt een gekleurde onderstreping die exact op de bottom-divider van de sub-header landt. Geen statisch label voor de tabs — de betekenis verschilt per pagina dus elk vast label zou misleidend zijn. Een klein plus-icoon aan het einde laat een gebruiker een nieuwe variant toevoegen.

---

## 9. Search

Een command palette die gebruikers via Cmd/Ctrl+K of het search-icoon door alle content laat zoeken.

**Gebruikersflow**
1. Gebruiker drukt Cmd/Ctrl+K of klikt op het search-icoon in de header
2. Een command palette verschijnt centraal op het scherm met een zoek-input
3. Gebruiker typt een zoekterm; matching resultaten verschijnen tijdens het typen
4. Gebruiker kiest een resultaat met pijltjes en Enter, of klikt
5. App navigeert naar de gekozen pagina

**UI-overzicht**
Een modale overlay met één zoek-input bovenaan en een resultaten-lijst eronder die tijdens typen filtert. Resultaten tonen paginatitel, breadcrumb en optioneel een snippet met de match. Toetsenbord-navigatie met omhoog, omlaag en Enter werkt overal in de palette. Sluiten via Escape of klikken buiten de modal.

---

## 10. View / Edit-toggle met lokale drafts

Een edit-modus waarmee de gebruiker iedere pagina lokaal in zijn browser kan bewerken zonder backend of account.

**Gebruikersflow**
1. Gebruiker klikt Edit in de actiebalk naast de paginatitel
2. Markdown-editor opent in plaats van de lees-view
3. Gebruiker bewerkt de inhoud; wijzigingen worden continu lokaal opgeslagen
4. Gebruiker sluit de tab of refresht; bij terugkomst is de draft automatisch terug
5. Bij volle browser-opslag verschijnt een banner met opties om te exporteren of oude drafts te wissen

**UI-overzicht**
De Edit-knop in de pagina-actiebalk schakelt naar een editor-view die de content-area vervangt; markdown-tekst is direct bewerkbaar. Een persistente banner bovenaan toont dat er onopgeslagen wijzigingen zijn. Een storage-vol-banner toont duidelijke actie-knoppen voor export en wissen wanneer de browser-opslag tegen zijn limiet aanloopt. Drafts blijven gescheiden per pagina en per taal.

---

## 11. In-app content management

Functionaliteit waarmee gebruikers vanuit de UI nieuwe hoofdstukken, pagina's, varianten en content-tabs kunnen aanmaken zonder de codebase te openen.

**Gebruikersflow**
1. Voor een nieuw hoofdstuk of nieuwe pagina klikt de gebruiker op de inline "+ nieuw hoofdstuk"- of "+ nieuwe pagina"-rij onderaan een sidebar-lijst
2. Voor een nieuwe variant of content-tab klikt de gebruiker op het kleine plus-icoontje aan het einde van een tab-rij
3. Een inline naam-input verschijnt; gebruiker typt en drukt enter
4. Het nieuwe item verschijnt direct in de UI; bij een pagina, variant of tab opent het meteen in edit-mode
5. Rechts-klik op een bestaand item geeft een context-menu met hernoemen en verwijderen

**UI-overzicht**
Subtiele "+ nieuw hoofdstuk"- en "+ nieuwe pagina"-rijen onderaan vertikale sidebar-lijsten met gestippelde border om het plus-icoontje en lichtere tekst. Aan het einde van horizontale tab-rijen staat een klein plus-icoontje dat sticky aan de rechterkant blijft tijdens horizontaal scrollen. Een inline naam-input verschijnt op de plek van het toegevoegde item zodra plus wordt geklikt. Rechts-klik opent een klein context-menu met de mutatie-opties.

---

## 12. Settings

Een instellingen-pagina waar gebruikers voorkeuren beheren — taal, thema, editor-opties en draft-export/import.

**Gebruikersflow**
1. Gebruiker klikt op het Settings-icoon in de header
2. Settings-pagina opent met kaarten in een grid, één kaart per onderwerp
3. Gebruiker past een voorkeur aan zoals taal, thema of een editor-optie; wijziging is direct actief
4. Vanuit Drafts beheren kan de gebruiker drafts exporteren als archief, een archief importeren of alle drafts wissen
5. Gebruiker zet alle onthouden UI-keuzes terug naar default via de UI-state reset

**UI-overzicht**
De Settings-pagina toont een grid van kaarten waarbij elke kaart één gefocusseerde sub-sectie behandelt. Kaarten dekken taal, thema, editor-voorkeuren, draft-beheer, profiel-informatie en UI-state reset. Inline controls zoals toggles, dropdowns en sliders zitten direct in de kaart. Destructieve acties op de drafts-kaart hebben een bevestigingsdialog voordat ze uitgevoerd worden.

---

## 13. Code-editor met browser-based execution

Een runnable code-editor op programmeertaal-pagina's die code direct in de browser uitvoert met pass/fail-feedback per challenge.

**Gebruikersflow**
1. Gebruiker opent een programmeertaal-pagina, bijvoorbeeld een JavaScript-hoofdstuk
2. Gebruiker switcht het rechter paneel naar de Code editor-view
3. Editor opent met start-code en een challenge-beschrijving
4. Gebruiker bewerkt en runt de code; output verschijnt onder de editor
5. Tests draaien automatisch en tonen pass/fail-indicators

**UI-overzicht**
De code-editor verschijnt als panel-optie via een icoon in de rechter panel-switcher en vult bij activatie het paneel; breder maken kan via de drag-handle. De editor heeft syntax highlighting, regelnummers en een optionele vim-mode instelbaar in Settings. Onder de editor zit een run-knop en een output-area waarin tests pass/fail-indicators tonen. Op mobiel opent de editor als full-screen modal voor genoeg typeruimte.

---

## 14. Card trainer

Een leer-modus die de pagina-content omzet in flashcards, een quiz of een examen voor zelfstudie.

**Gebruikersflow**
1. Gebruiker klikt op het Cards-icoon in de panel-switcher
2. Gebruiker kiest tussen Flashcards, Quiz of Exam
3. Een paneel schuift in vanaf links en bedekt het grootste deel van het scherm
4. Gebruiker doorloopt de cards — antwoorden, omdraaien of submitten afhankelijk van de modus
5. Gebruiker sluit het paneel; het schuift terug

**UI-overzicht**
Het Cards-icoon in de rechter panel-switcher activeert een modus-keuze bij eerste klik. Daarna schuift een paneel binnen vanaf de linkerkant met ongeveer 70% schermbreedte op desktop en full-screen op mobiel. Per modus krijgt de gebruiker een aangepaste UI: simpele voor en achter-kant voor flashcards, multiple-choice voor quiz, en getimed met submit-flow voor exam. Een sluit-affordance dismist het paneel terug naar de oorspronkelijke pagina.

---

## 15. Comment-systeem

Een threaded comment-sectie per pagina met replies, likes en sortering, voor discussie en stemmen op verbetersuggesties.

**Gebruikersflow**
1. Gebruiker switcht het rechter paneel naar Comments
2. Gebruiker leest de comment-thread en sorteert op Top of Newest
3. Gebruiker liked een comment door op de like-knop te klikken
4. Gebruiker reageert op een comment om een nieuwe thread te starten
5. Gebruiker scrollt door de hele thread

**UI-overzicht**
De Comments-optie in de panel-switcher toont een lijst met threaded comments waarbij elk item de auteur, body, timestamp en het like-aantal bevat. Een like-knop en een reply-knop zitten per comment direct beschikbaar. Een sorteer-toggle bovenaan switcht tussen Top en Newest. Replies zijn ingesprongen onder hun parent zodat de thread-hiërarchie visueel duidelijk is.

---

## 16. Mobiele layout

Een responsive layout die op smal scherm de drie-koloms desktop-view collapsed naar één kolom met overlay-panels.

**Gebruikersflow**
1. Gebruiker opent de app op een telefoon of smal scherm
2. Gebruiker tikt op de hamburger-knop in de header om de sidebar als slide-in van links op te roepen
3. Gebruiker tikt op een knop in de actiebalk om het rechter paneel als bottom-sheet of slide-in van rechts op te halen
4. Card trainer en code-editor openen full-screen voor genoeg ruimte
5. Smart ToC verhuist naar een "Op deze pagina"-dropdown bovenaan de content

**UI-overzicht**
Een hamburger-knop linksboven in de header vervangt de altijd-zichtbare sidebar; tikken opent hem als slide-in van links. Het rechter paneel komt als bottom-sheet of slide-in van rechts, oproepbaar via een knop. De pagina-actiebalk collapsed naar een dropdown-menu op extra-smalle schermen om titel-ruimte te besparen. Alle tap-targets zijn minimaal 44 bij 44 pixels conform WCAG 2.1 AA.

---

## 17. PWA en offline-werking

De app installeerbaar maken als native app met automatische caching van bezochte pagina's en expliciete offline-download per module.

**Gebruikersflow**
1. Gebruiker bezoekt de app; browser biedt aan hem te installeren
2. Gebruiker installeert; een app-icoon verschijnt op het apparaat
3. Gebruiker browset normaal; bezochte pagina's en hun assets worden automatisch gecached
4. Gebruiker klikt "Download voor offline" op een module om de hele module geforceerd te cachen
5. Offline een nooit eerder bezochte pagina opzoeken: gebruiker krijgt een fallback-melding dat de pagina niet beschikbaar is

**UI-overzicht**
De browser zelf toont een native install-prompt — niet de app. Op iedere module-overview pagina staat een "Download voor offline"-knop met de module-grootte vooraf zichtbaar en een voortgangs-indicator tijdens download. Een offline-fallback-pagina verschijnt voor onbezochte content zonder netwerk. Drafts en lokaal aangemaakte pagina's blijven werken zonder netwerk als bijproduct van de lokale opslag.

---

## 18. Toegang en private deployment

Authenticatie-gate vóór alle content in deployed omgevingen, plus blokkering van zoekmachines, om de app strikt intern te houden.

**Gebruikersflow**
1. Gebruiker bezoekt de app-URL op een deployed omgeving
2. Server retourneert alleen een login-pagina; geen content in de response
3. Gebruiker authenticeert met wachtwoord, single sign-on of platform-niveau access
4. Na succesvolle authenticatie wordt content beschikbaar
5. Lokale development vereist geen auth en draait direct vanaf localhost

**UI-overzicht**
Een login-pagina dient als de enige ingang van de app in deployed omgevingen, met een standaard auth-formulier — wachtwoord-input, SSO-knop, of beide afhankelijk van configuratie. Na succesvolle auth laadt de gewone app. Onauthenticeerde gebruikers krijgen geen app-content te zien — ook crawlers die robots.txt negeren krijgen niets. Op localhost is de auth-gate uit zodat development soepel verloopt.

---

## 19. AI assistent in slide-panel

Een uitschuifbaar paneel met een chat-assistent die de huidige pagina als context kent voor vragen aan een LLM.

**Gebruikersflow**
1. Gebruiker klikt op het AI-icoon in de header
2. Een paneel schuift in vanaf rechts en valt deels over de content
3. Gebruiker typt een vraag; de assistent antwoordt met context van de huidige pagina
4. Antwoord streamt geleidelijk binnen
5. Bij AI-uitval toont het paneel één duidelijke melding met één retry-knop, terwijl de rest van de app blijft werken

**UI-overzicht**
Een slide-out paneel vanaf de rechterrand met een chat-stijl conversatie — input onderaan, berichten erboven. Antwoorden verschijnen geleidelijk via streaming. Een sluit-affordance — X-knop of klik buiten het paneel — dismist de UI terug naar de pagina. Bij failure-states toont het paneel één retry-knop in plaats van automatisch te retryen.

---

## 20. Wiskundige formules en diagrammen

Markdown-pagina's kunnen wiskundige formules (KaTeX) en diagrammen (Mermaid) bevatten. Beide zijn opt-in per pagina zodat pagina's zonder formules of diagrammen geen extra runtime-payload krijgen.

**Gebruikersflow**
1. Auteur schrijft een formule in markdown met `$inline$` of `$$display$$` syntax
2. Auteur schrijft een diagram als markdown code-block met language `mermaid`
3. Lezer opent de pagina en ziet de formule of het diagram correct gerenderd
4. Bij theme-wissel (light/dark) past de rendering zich aan
5. Bij een syntax-fout in een formule of diagram toont de pagina een fallback met de raw bron en blijft de rest van de pagina werken

**UI-overzicht**
Formules renderen inline of block-niveau met goede typografie en correcte spacing rondom de tekst. Diagrammen verschijnen als gerenderde SVG of canvas-blocks tussen de markdown-content. Diagram-kleuren volgen het actieve theme. Render-fouten tonen een omkaderd codeblock met een waarschuwing — geen pagina-crash.

---

## 21. Image lightbox

Klik op een afbeelding in een artikel opent een fullscreen overlay met de afbeelding op volledige resolutie. Bedoeld voor screenshots, terminal-output en diagrammen waar lezers details willen zien die niet zichtbaar zijn op de inline-grootte.

**Gebruikersflow**
1. Lezer scrollt door een artikel en wil een screenshot beter bekijken
2. Klik op de afbeelding opent een fullscreen overlay met de afbeelding op volledige resolutie
3. Markdown alt-text verschijnt als caption onder de afbeelding
4. Lezer sluit de overlay via `Esc`, klik buiten de afbeelding, of de sluit-knop
5. Pagina-positie blijft behouden — lezer is niet uit de flow van het artikel

**UI-overzicht**
De overlay heeft een semi-transparante donkere backdrop, gecentreerde afbeelding op `max-w-full max-h-full` met `object-contain`, een caption eronder in muted text, en een sluit-knop rechtsboven. Body-scroll is geblokkeerd terwijl de lightbox open is. Op mobiel vult de lightbox de volledige viewport.

---

