# 1000x — Roadmap

> Navigatie-index over de drie stages. Detail per item leeft in de eigen `SPEC.md`. Voor de overall productspec zie [`SPEC.md`](./SPEC.md); voor de architectuur-discipline zie [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## De drie stages

1. **`01-FOUNDATION/`** — éénmalige scaffold + branding + i18n + content-schema + tooling + content-stubs als integration-testbed. Zodra dit staat, raken we het niet meer aan
2. **`02-TEMPLATE/`** — zware tweaks bovenop wat de Nuxt UI docs-template en Nuxt Content out-of-the-box leveren. Alles wat de lezer in chrome en rendering ziet ontstaat hier
3. **`03-FEATURES/`** — echt nieuwe functionaliteit die nieuwe libraries, eigen state-management en eigen interactie-modellen meebrengt

Werk-volgorde: foundation eerst en tot het écht klaar is (inclusief content-stubs). Dan template in een outside-in volgorde die elke stap visueel zichtbaar maakt — markdown-rendering (01), section-sidebar (02 — geeft `useNavTree` als data-foundation én visible sidebar), header (03 — module-dropdowns), levels (04 — AppLevelHeader sub-header), tabs (05 — TabBar in-content), chrome (06–07), panel-inhoud (08), onderaan-pagina (09–10), extras (11–13). Dan features.

---

## 01-FOUNDATION

| | Customization | Wat het doet |
|---|---|---|
| | [SCAFFOLDING.md](./01-FOUNDATION/SCAFFOLDING.md) | Stap-voor-stap setup-bron-van-waarheid (Nuxt UI docs-template clonen, dependencies, configs) |
| | [FOUNDATION.md](./01-FOUNDATION/FOUNDATION.md) | Initial-scaffold scope en non-goals |
| 01 | [01-branding](./01-FOUNDATION/01-branding/SPEC.md) | 1000x-logo (rode "1" + default "000x"), accent-kleur, site-name op alle plekken — eerste-pas; fijntuning kan later |
| 02 | [02-i18n](./01-FOUNDATION/02-i18n/SPEC.md) | NL default + EN secundair via `@nuxtjs/i18n`; UI-strings + content-files per taal |
| 03 | [03-content-stubs](./01-FOUNDATION/03-content-stubs/SPEC.md) | Demo-content tree onder `content/` (scope-modes, levels-folders, tabs-files, MDC inline ::tabs, standalone topics, kb-fallback) als testbed voor stage 2 |

---

## 02-TEMPLATE

| | Customization | Wat het tweakt |
|---|---|---|
| 01 | [01-markdown-rendering](./02-TEMPLATE/01-markdown-rendering/SPEC.md) | Server-side rendering, code-blocks, callouts, embeds, frontmatter schema, MDC inline `::tabs` voor kleine alternatieven |
| 02 | [02-section-sidebar](./02-TEMPLATE/02-section-sidebar/SPEC.md) | Scope-bound sidebar i.p.v. de auto-sidebar; één `useNavTree()` als data-foundation én visible sidebar; kind-detection (page/chapter/levels-container/tabs-container/level/tab) |
| 03 | [03-header](./02-TEMPLATE/03-header/SPEC.md) | Logo + zes module-dropdowns + vijf icon-only actie-knoppen — consumeert `useNavTree` |
| 04 | [04-levels](./02-TEMPLATE/04-levels/SPEC.md) | AppLevelHeader chrome-sub-header voor secties met `levels: true` (Junior/Mid/Senior, Windows/Linux/macOS — folder-based) |
| 05 | [05-tabs](./02-TEMPLATE/05-tabs/SPEC.md) | TabBar in-content (onder H1) voor directories met `tabs: true` (Tailwind-stijl: Vite/PostCSS/CLI installation — file-based siblings) |
| 06 | [06-page-chrome](./02-TEMPLATE/06-page-chrome/SPEC.md) | Breadcrumb + pagina-actiebalk (View/Edit + Copy) inline naast H1 |
| 07 | [07-right-panel](./02-TEMPLATE/07-right-panel/SPEC.md) | Drie-kolom skelet, resize-handle, open/close, panel-switcher buttons |
| 08 | [08-smart-toc](./02-TEMPLATE/08-smart-toc/SPEC.md) | `<UContentToc>` als basis; scroll-driven auto-fit toevoegen pas wanneer OOTB-gedrag tekortschiet (lange ToC, file-based tabs/levels) |
| 09 | [09-changelog](./02-TEMPLATE/09-changelog/SPEC.md) | `<UChangelog>` als renderer + git-data layer (server-route per pagina) |
| 10 | [10-prev-next](./02-TEMPLATE/10-prev-next/SPEC.md) | `queryCollectionItemSurroundings` OOTB + dunne scope-filter wrapper |
| 11 | [11-search](./02-TEMPLATE/11-search/SPEC.md) | `<UContentSearch>` Cmd+K OOTB + scope-toggle erbovenop ("huidige sectie" / "alles") |
| 12 | [12-math-en-diagrammen](./02-TEMPLATE/12-math-en-diagrammen/SPEC.md) | KaTeX (formules) + Mermaid (diagrammen), opt-in per page |
| 13 | [13-image-lightbox](./02-TEMPLATE/13-image-lightbox/SPEC.md) | Klik op afbeelding → fullscreen overlay met alt-text als caption |

---

## 03-FEATURES

| | Feature | Wat het toevoegt |
|---|---|---|
| 01 | [01-edit-met-drafts](./03-FEATURES/01-edit-met-drafts/SPEC.md) | View/Edit-toggle met lokale drafts in browser-storage; export/import van drafts |
| 02 | [02-content-management](./03-FEATURES/02-content-management/SPEC.md) | In-app aanmaken van hoofdstukken, pagina's, levels en tabs zonder codebase te openen |
| 03 | [03-settings](./03-FEATURES/03-settings/SPEC.md) | Settings-pagina (kaart-stijl) — taal, thema, editor-voorkeuren, drafts-management, profiel |
| 04 | [04-code-editor](./03-FEATURES/04-code-editor/SPEC.md) | CodeMirror 6 + browser-based execution (Web Worker / WASM per taal) met pass/fail-challenges |
| 05 | [05-card-trainer](./03-FEATURES/05-card-trainer/SPEC.md) | Flashcards / quiz / exam — slide-in panel, manueel-gedefinieerde cards in eerste release |
| 06 | [06-comments](./03-FEATURES/06-comments/SPEC.md) | Threaded comments à la YouTube — likes, sorteer, voor feedback en stemmen |
| 07 | [07-mobiele-layout](./03-FEATURES/07-mobiele-layout/SPEC.md) | Drie-kolom-layout collapsed naar één met overlays, hamburger-menu, slide-ins |
| 08 | [08-pwa-offline](./03-FEATURES/08-pwa-offline/SPEC.md) | Installeerbaar PWA + cache-as-you-go service worker + per-module offline-download |
| 09 | [09-toegang-private-deployment](./03-FEATURES/09-toegang-private-deployment/SPEC.md) | `noindex`, auth-gate, geen content voor unauthenticated requests |
| 10 | [10-ai-assistent](./03-FEATURES/10-ai-assistent/SPEC.md) | Slide-panel chatbot met paginacontext, gestreamed via server-route |

---

## Werk-volgorde principes

- **Foundation eerst, en helemaal af** — branding (eerste-pas), i18n, schema, tooling, deploy-config, content-stubs. Geen half-werk meenemen naar template-tweaks
- **Template: outside-in** — markdown rendering (01) vóór section-sidebar (02 — bevat de tree-bron én visible sidebar) vóór header (03) vóór levels (04) vóór tabs (05) vóór chrome (06–07) vóór panel-inhoud (08) vóór onderaan-pagina (09–10) vóór extras (11–13). Section-sidebar Step 1 (tree-build) is de data-foundation die header / levels / tabs allemaal consumeren. Zonder rijke content-stubs (`01-FOUNDATION/03-content-stubs`) kan de tree-bron niet getest worden
- **Features-stage komt pas wanneer template-stage stabiel is** — pas dan introduceren we Pinia (zie `ARCHITECTURE.md` § Pinia-migratiepath), nieuwe runtimes (CodeMirror, Pyodide) en eigen interactie-modellen
- **Iedere customization en feature heeft één canonieke SPEC** in de eigen folder. Geen dubbele specs, geen drift. Voor architectuur-discipline zie `ARCHITECTURE.md`
