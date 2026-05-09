# Markdown rendering & content-engine

## Summary

Pagina's worden geschreven in markdown en gerenderd als gestylede, interactieve documentatie. Dit is de basis-laag waar alle andere features op rusten — zonder gerenderde markdown is er geen pagina om te lezen, te bewerken of mee te interacteren.

## Goals

- Lezers kunnen pagina's met opgemaakte content lezen: koppen, code, tabs, callouts en media
- Lange pagina's kunnen gecondenseerd worden zonder de bron-file op te splitsen
- Content blijft eenvoudig te onderhouden in markdown — één bron-bestand per pagina
- Het frontmatter-schema is forward-compatible zodat refactoren mogelijk blijft zonder honderden pagina's handmatig aan te passen

## Requirements

- Headings van H1 tot en met H4 zijn ondersteund, met klikbare anchor-links die deelbare URL-fragmenten genereren
- Code blocks tonen syntax highlighting per taal en hebben een copy-knop
- In-page tabs splitsen lange pagina's in sub-secties zonder de file op te delen; iedere tab heeft eigen H2/H3-koppen
- Bij meer tabs dan in beeld passen scrollt de tab-rij horizontaal — touch-swipe, trackpad-scroll en shift+scrollwheel werken native
- Een subtiele schaduw aan de zichtbare rand van een scrollende tab-rij signaleert dat er meer tabs zijn
- Callouts, afbeeldingen en embedded media zijn ondersteund
- Assets (afbeeldingen, media) leven in een vaste mappenstructuur die de content-tree spiegelt — één bron-locatie, makkelijk te vinden
- UI-screenshots blijven taal-onafhankelijk waar mogelijk; alleen écht taal-gevoelige beelden krijgen per taal een eigen versie
- Iedere pagina heeft impliciet een schema-versie via frontmatter (default versie 1)
- Onbekende frontmatter-velden geven tijdens development een waarschuwing maar laten de pagina gewoon renderen — geen crashes
- Bij breaking changes in het frontmatter-schema kan een pagina worden gemigreerd via een versie-ophoging die oude velden naar de nieuwe vorm vertaalt
- Toekomstige content-ingestie kan externe bronnen (video's, social posts, nieuwsartikelen) automatisch omzetten naar markdown-pagina's met frontmatter — output blijft een gewoon markdown-bestand zodat de rest van het systeem niets hoeft te weten van de bron

## Technical

Implementatie leunt volledig op de stack uit `spec.md` — Nuxt 4 + Nuxt Content + **Nuxt UI v4** (de unified open-source library, voorheen Pro). Nuxt UI v4 is niet alleen "prose-styling": het is een complete componentenbibliotheek met 100+ componenten — header, navigation, dashboard, content-surround, content-toc, tabs, breadcrumbs, alerts, cards, collapsibles, accordions, command palette, modals, toast, en veel meer. Voor élk UI-element geldt **dezelfde volgorde**:

1. Eerst checken of Nuxt UI v4 het al levert (zowel als component als als MDC-block in `::syntax`)
2. Pas als het niet bestaat of fundamenteel onvoldoende is, een eigen component bouwen — bij voorkeur door een Nuxt UI component te slot-overriden of te wrappen
3. Volledig from-scratch bouwen alleen als laatste optie

Deze regel geldt project-breed, niet alleen voor markdown rendering. De Technical sectie hieronder verdeelt deze feature in drie categorieën: wat **uit de doos** komt, wat we **configureren**, en wat we **zelf moeten bouwen**.

### Uit de doos — geen werk

Deze requirements worden volledig afgevangen door Nuxt UI v4's prose- en MDC-componenten:

- **Headings met anchor-links (H1-H4)** — `ProseH1` t/m `ProseH4` rendert automatisch `id`-attributen plus klikbare anchor-iconen op hover. URL-fragmenten werken native
- **Code blocks met syntax highlighting + copy-knop** — `ProsePre` heeft Shiki-highlighting, copy-button, filename-display, file-type-iconen, line-highlighting via `{N-M}`-syntax, en `diff`-language support. Allemaal standaard. Geen `ProsePre.vue`-override nodig
- **In-page tabs** — `::tabs` / `:::tabs-item{label="..."}` MDC-syntax. Headings binnen elke tab werken natuurlijk
- **Tab-overflow** — ingebouwd in `<UTabs>`, inclusief horizontale scroll met touch/trackpad/shift+wheel support. Of de default-styling al een fade-shadow heeft aan de overflowing kant: te checken bij implementatie; zo niet, een dunne CSS-laag eromheen met `mask-image: linear-gradient`
- **Callouts** — `::callout` met `::note`, `::tip`, `::warning`, `::caution` shortcuts. Volledig MDC-native, kleur en icon configureerbaar via app.config
- **Afbeeldingen en embedded media** — `ProseImg` voor afbeeldingen; voor video/embeds gebruiken we de standaard markdown-syntax of een custom `::video`-component als dat nodig blijkt

Aanvullende MDC-blocks die Nuxt UI ook levert en die we **gratis meekrijgen** (zonder extra werk), zelfs als de spec ze niet expliciet noemt: `::code-group` (meerdere code-blocks in tabs), `::code-tree` (file-tree views), `::code-preview` (live preview naast code), `::code-collapse` (inklapbare lange blocks), `::steps`, `::accordion`, `::collapsible`, `::card`, `::card-group`. Auteurs kunnen die direct gebruiken in markdown — handig voor instructie-content.

### Configureren — kleine werk

Deze requirements worden afgevangen door bestaande functionaliteit, maar vragen project-specifieke configuratie:

- **Shiki theme en languages whitelist** in `nuxt.config.ts` onder `content.build.markdown.highlight`: theme-pair die meebeweegt met `useColorMode` (bijv. `material-theme-lighter` / `material-theme-palenight`, of `github-light` / `github-dark`), plus een expliciete language-lijst (`js`, `ts`, `vue`, `python`, `bash`, `json`, `md`, `html`, `css`, `go`, `rust` als startset). Whitelisting voorkomt dat we 200 grammars ongebruikt meebundelen
- **Copy-button-iconen** in `app.config.ts` onder `ui.icons.copy` en `ui.icons.copyCheck` — alleen aanpassen als we van de defaults willen afwijken (`lucide:copy` / `lucide:copy-check` zijn al consistent met onze Lucide-set)
- **Callout-kleuren en iconen** in `app.config.ts` onder `ui.prose.callout` — alleen aanpassen als de defaults niet stroken met de rode accent-kleur
- **Pagina-content opvragen** via `queryCollection('content').path(route).first()` in `useAsyncData`, gerenderd via `<ContentRenderer :value="page" />` — standaard Nuxt Content patroon
- **Content-collectie definitie** in `content.config.ts` met `defineCollection({ type: 'page', source: '**/*.md' })` plus een zod-schema voor frontmatter
- **`@nuxt/image` als image-pipeline** — installeren en configureren in `nuxt.config.ts` met de **`ipx` provider** (lokaal optimaliseren via Nitro server). Werkt zowel voor SSG als voor Docker-deployment, hostingplatform-agnostisch. Levert automatische image-optimalisatie (resize per breakpoint, format-conversie naar WebP/AVIF, lazy-loading), wat voor een screenshot-heavy leersysteem direct relevant is. Door dit **vanaf de start** mee te nemen voorkomen we een latere refactor waarbij alle bestaande `ProseImg`-instances en markdown-image-syntax aangepast moeten worden. `ProseImg.vue` wordt overschreven om intern `<NuxtImg>` te gebruiken in plaats van `<img>`, zodat álle markdown-images automatisch door de pipeline gaan zonder dat auteurs iets bijzonders moeten doen in hun markdown. Latere migratie naar een edge-provider (Cloudflare, Vercel) is een config-wijziging, geen codewijziging

### Zelf bouwen — echt werk

Deze requirements vallen buiten wat Nuxt UI / Nuxt Content levert en zijn dus écht implementatie-werk:

- **Frontmatter schema-versioning en migraties** — geen ingebouwde oplossing. **Pragmatisch advies voor de eerste release: zet alleen `schemaVersion: 1` in alle frontmatter (eventueel als zod-default), bouw de migrators-machinery pas op het moment dat we de eerste breaking change in een schema doorvoeren.** Het veld nu vastleggen kost niks en voorkomt later een file-mass-edit; de migrator-runtime daarentegen is YAGNI zolang we nog op één schema-versie zitten. Wanneer de eerste migratie wél nodig is, ziet de implementatie er als volgt uit:
  - `schemaVersion`-veld in frontmatter (default `1`) lezen vóór zod-validatie
  - Een `migrators`-array (`{ from: 1, to: 2, run: (fm) => ... }`) draait in een Nuxt Content `transform`-hook **voordat** het collection-schema valideert
  - Migraties draaien op build/index-tijd (Nuxt Content parst content één keer bij dev-start of build), niet bij elke read
- **Tolerante validatie + dev-warning voor onbekende velden** — zod biedt `.passthrough()` om onbekende velden te accepteren; een diff tussen geparseerde object en de schema-keys logt `console.warn` in dev-mode (alleen tijdens `nuxt dev`, uitschakelen in productie)
- **Localized assets-resolver** — kleine helper die naast `image.png` ook `image.nl.png` / `image.en.png` checkt op disk en de juiste variant kiest op basis van `useI18n().locale.value`. Geen suffix → taal-onafhankelijk, fallback gebruiken. Geen ingebouwde Nuxt Content-feature
- **Asset-pad-resolutie naar mirror-tree** — relatieve paden in markdown (`![alt](./img.png)`) herschrijven naar absolute paden onder `/assets/<page-path>/`. Implementatie via een rehype-plugin in `markdown.rehypePlugins` of een Nuxt Content `transform`-hook. De keuze hangt af van wanneer het pad zichtbaar moet worden voor andere features (search-indexering bijvoorbeeld)
- **n8n-ingestion-pipeline** voor externe bronnen — out-of-band, conform spec.md. Aparte n8n-flow die markdown-bestanden met frontmatter genereert en commit naar `content/`. De render-laag weet er niks van. Geen koppeling tussen ingestion en runtime

### Open punten voor implementatie

- Of `<UTabs>` de fade-shadow op de overflowing kant zelf al meeneemt of dat we een wrapper nodig hebben
- Exacte plek waar schema-migraties draaien binnen Nuxt Content's parse-cyclus — een `transform`-hook lijkt logisch maar moet bij implementatie van de eerste migratie geverifieerd worden
- Of asset-pad-resolutie in een Nitro-plugin of Nuxt Content `transform`-hook moet — beide kan, hangt af van wanneer het pad zichtbaar moet worden downstream

## Implementation Steps

De feature is opgebroken in zeven sequentiële stappen die ieder een werkende, observeerbare verbetering opleveren. Elke stap is bedoeld als één review-eenheid (één PR, één review-sessie). De volgorde gaat van fundament naar nuance: eerst werkt rendering, daarna ziet het er goed uit, daarna komen custom blocks erbij, vervolgens images, paden, lokalisatie, en als laatste schema-tolerantie.

**Stap 1 — Basis Nuxt Content + page-rendering**

Fundamentele rendering-pipeline opzetten zodat een markdown-file geserveerd wordt als gestylede pagina.

- Installeer `@nuxt/content` en `@nuxt/ui` v4
- Definieer een collection in `content.config.ts` met basis frontmatter-schema via zod: `title`, `description`, `schemaVersion` (default `1`)
- Pagina-template gebruikt `useAsyncData` + `queryCollection('content').path(route).first()` en rendert via `<ContentRenderer :value="page" />`
- Eén of twee test-pagina's met H1-H4, paragraphs, lists, links, blockquotes — alle standaard markdown
- Zet `schemaVersion: 1` in alle bestaande frontmatter (de zod-default vangt missende velden)

**Acceptance**: een test-pagina rendert met correcte typografie via Nuxt UI's prose-componenten; alle headings hebben klikbare anchors die deelbare URL-fragmenten genereren; `schemaVersion: 1` is aanwezig in frontmatter.

**Stap 2 — Code blocks met syntax highlighting + theme-binding**

Code blocks bruikbaar maken voor CS- en security-content.

- Configureer Shiki in `nuxt.config.ts` onder `content.build.markdown.highlight`: theme-pair die meebeweegt met `useColorMode` (bijv. `github-light` / `github-dark` of `material-theme-lighter` / `material-theme-palenight`)
- Language-whitelist met startset: `js`, `ts`, `vue`, `python`, `bash`, `json`, `md`, `html`, `css`, `go`, `rust`
- Test-pagina met code blocks in meerdere talen, een filename op één van de blocks (` ```ts [nuxt.config.ts] `), en een line-highlight via `{N-M}`-syntax
- Verifieer of de copy-button-iconen in `app.config.ts` (`ui.icons.copy` / `copyCheck`) overeenkomen met onze Lucide-set; alleen aanpassen als nodig

**Acceptance**: code blocks tonen syntax highlighting in zowel light als dark mode, theme wisselt mee bij `useColorMode`-toggle, copy-button werkt en geeft visuele feedback, line-highlighting werkt, filename + file-icon verschijnen wanneer opgegeven.

**Stap 3 — MDC custom blocks valideren (tabs, callouts, code-group)**

Verifiëren dat de uit-de-doos MDC-blocks werken zoals de spec vereist en dat tab-overflow correct gedraagt.

- Test-pagina met `::tabs` met meerdere `:::tabs-item` blocks, ieder met eigen H2/H3-koppen
- Test-pagina met `::callout`, `::note`, `::tip`, `::warning`, `::caution` — verifieer dat de defaults bij ons rode accent passen, anders aanpassen via `app.config.ts` onder `ui.prose.callout`
- Test-pagina met `::code-group` voor meerdere code-blocks in tabs (NL/EN-versies van een code-snippet bijvoorbeeld)
- Test-pagina met genoeg tabs om horizontaal te scrollen, in alle browsers — verifieer touch-swipe, trackpad-scroll en shift+wheel
- Check of `<UTabs>` een fade-shadow op de overflowing kant heeft; zo niet, een dunne CSS-laag toevoegen met `mask-image: linear-gradient` op de tab-rij wrapper

**Acceptance**: alle drie de block-types renderen correct, tabs scrollen native met alle drie de input-methodes, fade-shadow verschijnt aan de overflowing kant van een lange tab-rij, callout-kleuren stroken met het rode accent.

**Stap 4 — `@nuxt/image` pipeline + ProseImg-override**

Image-pipeline vanaf het begin opzetten zodat we later geen refactor hoeven te doen op alle bestaande images.

- Installeer `@nuxt/image` en configureer in `nuxt.config.ts` met `provider: 'ipx'` (lokaal optimaliseren via Nitro)
- `ProseImg.vue`-override in `app/components/content/` die intern `<NuxtImg>` gebruikt in plaats van `<img>`
- Test-pagina met meerdere markdown-images van verschillende groottes
- Verifieer dat het netwerk-tabblad WebP/AVIF-varianten serveert in moderne browsers en dat lazy-loading werkt

**Acceptance**: alle markdown-images gaan automatisch door de `@nuxt/image`-pipeline, worden geserveerd in WebP/AVIF waar de browser dat ondersteunt, juiste size voor het breakpoint, lazy-loading werkt, geen wijziging nodig in markdown-syntax.

**Stap 5 — Asset-pad-resolutie naar mirror-tree**

Auteurs laten relatieve paden gebruiken die automatisch herschreven worden naar de mirror-asset-structuur.

- Rehype-plugin in `markdown.rehypePlugins` of een Nuxt Content `transform`-hook die relatieve paden (`./img.png`, `../img.png`) herschrijft naar absolute paden onder `/assets/<page-path>/`
- Conventie documenteren in een korte README naast `content/` of inline in `content.config.ts`-comments
- Test-pagina met een image die uit een sibling-directory wordt gelezen

**Acceptance**: een markdown-file kan `![alt](./img.png)` schrijven en de image verschijnt op de pagina, geserveerd vanuit `public/assets/<page-path>/img.png`. Het werkt samen met `@nuxt/image` uit stap 4 — paden gaan eerst door de resolver, dan door de pipeline.

**Stap 6 — Localized assets-resolver**

Taal-specifieke afbeeldingen ondersteunen voor de paar gevallen waar UI-screenshots écht taal-gevoelig zijn.

- Helper-functie die naast `image.png` ook `image.{locale}.png` checkt op disk en de juiste variant kiest op basis van `useI18n().locale.value`
- Integratie in de asset-pad-resolver van stap 5: eerst checken op locale-suffix, dan fallback naar non-suffix
- Test-pagina met één taal-specifieke screenshot (bijv. `screenshot.nl.png` + `screenshot.en.png`) en één taal-onafhankelijke (`diagram.png`)

**Acceptance**: bij locale-switch in de UI wisselt de taal-specifieke variant; de taal-onafhankelijke variant blijft hetzelfde; een page met alleen `image.png` (zonder locale-suffix) werkt onveranderd.

**Stap 7 — Tolerante frontmatter-validatie + dev-warning**

De parse-laag zo maken dat refactoren mogelijk blijft zonder dat één onbekend veld een hele pagina laat crashen.

- Pas zod-schema in `content.config.ts` aan met `.passthrough()` zodat onbekende velden niet rejected worden
- Implementeer een dev-only check (in een Nuxt Content `transform`-hook of Nitro plugin) die het geparseerde object diff't tegen de schema-keys en `console.warn` doet voor onbekende velden — alleen tijdens `nuxt dev`, uitgeschakeld in productie
- Test-pagina met een onbekend frontmatter-veld (bijv. `experimental: true`)

**Acceptance**: page met onbekend frontmatter-veld rendert nog steeds correct, console toont een dev-warning met bestandspad en onbekend veld, productie-build geeft geen warning, zod-schema rejects geen valid velden.

**Niet in deze stappen:** de migrators-machinery voor schema-versie-ophogingen (bouwen wanneer de eerste breaking change zich voordoet, zie Technical → Zelf bouwen) en de n8n-ingestion-pipeline (out-of-band, separate flow buiten de app-codebase, zie spec.md).

## Out of scope

Dingen die bij feature 1 voor de hand lijken te liggen maar bewust niet hier horen — ofwel omdat ze in een andere feature thuishoren, ofwel omdat ze tegen een project-keuze ingaan, ofwel omdat ze scope-creep zijn. Bij elke "ah laat me even"-impuls eerst hier checken.

**Hoort bij andere features — niet hier inbouwen**

* *Inline Table of Contents bovenaan of in de zijbalk van de markdown-body* — de ToC woont in het rechter panel, zie feature 5
* *"Laatst bijgewerkt"-stempel boven elke pagina* — de changelog onder de content (feature 6) is de canonieke last-updated; een tweede stempel bovenaan is duplicatie
* *Reading time / word count boven elk artikel* — geen aparte feature, mocht het ooit gewenst zijn dan hoort het bij de page-actiebalk (feature 7)
* *Anchor scroll-spy met actieve-heading highlighting in de page-template* — de smart variant-bewuste ToC in feature 5 doet dit; geen tweede scroll-spy implementeren
* *Comment-section onder elke pagina* — feature 15 (comment-systeem)
* *"Edit on GitHub" link onder elke pagina* — feature 10 (View/Edit-toggle) en feature 11 (in-app content management) lossen dit in-app op zonder gebruikers naar GitHub te sturen
* *Wiskundige formules (KaTeX/MathJax)* — verplaatst naar feature 20
* *Diagrammen (Mermaid)* — verplaatst naar feature 20
* *Image lightbox / klik-om-te-vergroten* — verplaatst naar feature 21

**Public-docs reflexen — botsen met auth-gated principe**

* *SEO meta tags / `useSeoMeta` per pagina* — content is auth-gated, indexering is uitgesloten in de spec
* *Open Graph cards / Twitter cards* — content is auth-gated, niemand kan ze zien
* *RSS feed* — niet gevraagd, en niet bruikbaar achter auth-gate
* *`sitemap.xml`* — geen indexering, geen sitemap nodig
* *`robots.txt` met crawl-regels* — niet relevant, content is sowieso unreachable voor crawlers
* *Print stylesheet (`@media print`)* — leersysteem, niet bedoeld om uitgeprint te worden
* *Dependency `@nuxtjs/seo` of `@nuxtjs/sitemap`* — niet installeren

**Image-rendering scope-creep**

* *Blur-placeholders / dominant-color placeholders* — extra complexiteit, geen meerwaarde voor screenshots-heavy content
* *Image lightbox / multi-image gallery* — gallery-functionaliteit zit überhaupt niet in scope (feature 21 is enkel-image lightbox)
* *Pinch-to-zoom op afbeeldingen* — feature 21 sluit dit expliciet uit

**Custom MDC-wildgroei**

* *Eigen componenten verzinnen die niet in de spec staan* — geen `::quiz`, `::definition`, `::author-note`, `::pro-tip`, `::exercise`, `::feature-grid` of vergelijkbaar zonder expliciete feature-aanvraag. `::callout` met types dekt het meeste; nieuwe blocks komen via een feature-spec, niet door een implementer-impuls
* *Dependency `@nuxtjs/mdc`-plugins toevoegen die niet bij een feature horen* — Nuxt Content levert MDC al; geen losse `@nuxtjs/mdc` extensies installeren tenzij een specifieke feature ze noemt

**Dependencies die niet binnenkomen**

* *Geen `@nuxtjs/seo`* — auth-gated content
* *Geen `@nuxtjs/sitemap`* — geen indexering
* *Geen aparte syntax-highlighter naast Shiki* — Shiki is ingebouwd in Nuxt Content, geen Prism / highlight.js / etc.
* *Geen aparte markdown-parser naast remark/rehype* — Nuxt Content levert de pipeline, geen markdown-it / marked / etc. erbij
