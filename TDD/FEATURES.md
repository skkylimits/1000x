# 1000x — Roadmap

> Navigatie-index over de drie stages. Detail per item leeft in de eigen `SPEC.md`. Voor de overall productspec zie [`SPEC.md`](./SPEC.md); voor de architectuur-discipline zie [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## De drie stages

1. **`01-foundation/`** — éénmalige scaffold + branding + i18n + content-schema + tooling. Zodra dit staat, raken we het niet meer aan
2. **`02-template/`** — zware tweaks bovenop wat de Nuxt UI docs-template en Nuxt Content out-of-the-box leveren. Alles wat de lezer in chrome en rendering ziet ontstaat hier
3. **`03-features/`** — echt nieuwe functionaliteit die nieuwe libraries, eigen state-management en eigen interactie-modellen meebrengt

Werk-volgorde: foundation eerst en tot het écht klaar is. Dan template — content-rendering vóór navigatie-chrome (anders ontbreekt de testbaarheid). Dan features.

---

## 01-foundation

| | Customization | Wat het doet |
|---|---|---|
| | [SCAFFOLDING.md](./01-foundation/SCAFFOLDING.md) | Stap-voor-stap setup-bron-van-waarheid (Nuxt UI docs-template clonen, dependencies, configs) |
| | [FOUNDATION.md](./01-foundation/FOUNDATION.md) | Initial-scaffold scope en non-goals |
| 01 | [01-branding](./01-foundation/01-branding/SPEC.md) | 1000x-logo (rode "1" + default "000x"), accent-kleur, site-name op alle plekken |
| 02 | [02-i18n](./01-foundation/02-i18n/SPEC.md) | NL default + EN secundair via `@nuxtjs/i18n`; UI-strings + content-files per taal |

> **Ook foundation-territory:** demo-content stubs voor het testen van latere customizations (rijke content met variants, content-tabs, code-blocks, math, diagrammen). Deze content wordt in foundation geprepareerd zodat 02-template tegen werkelijke content kan ontwikkelen.

---

## 02-template

| | Customization | Wat het tweakt |
|---|---|---|
| 01 | [01-markdown-rendering](./02-template/01-markdown-rendering/SPEC.md) | Server-side rendering, code-blocks, callouts, embeds, frontmatter schema |
| 02 | [02-section-sidebar](./02-template/02-section-sidebar/SPEC.md) | Scope-bound sidebar i.p.v. de auto-sidebar; één tree voedt alle nav-surfaces |
| 03 | [03-header](./02-template/03-header/SPEC.md) | Logo + zes module-dropdowns + vijf icon-only actie-knoppen |
| 04 | [04-variant-tabs](./02-template/04-variant-tabs/SPEC.md) | Sub-header voor variant-pagina's (Junior/Mid/Senior, OS-keuze, etc.) met overflow-collapse |
| 05 | [05-page-chrome](./02-template/05-page-chrome/SPEC.md) | Breadcrumb + pagina-actiebalk (View/Edit + Copy) + rechter-panel-skelet |
| 06 | [06-content-tabs](./02-template/06-content-tabs/SPEC.md) | Tabs in markdown-content met horizontaal-scrollende overflow |
| 07 | [07-rechter-panel-en-toc](./02-template/07-rechter-panel-en-toc/SPEC.md) | Smart ToC (scroll-driven, tab- en variant-bewust) + panel-switcher buttons |
| 08 | [08-changelog-en-prev-next](./02-template/08-changelog-en-prev-next/SPEC.md) | Commit-timeline + variant-aware prev/next-kaarten onderaan iedere pagina |
| 09 | [09-search](./02-template/09-search/SPEC.md) | `Cmd+K` command palette + scope-toggle ("huidige sectie" / "alles") |
| 10 | [10-math-en-diagrammen](./02-template/10-math-en-diagrammen/SPEC.md) | KaTeX voor formules + Mermaid voor diagrammen, opt-in per pagina |
| 11 | [11-image-lightbox](./02-template/11-image-lightbox/SPEC.md) | Klik op afbeelding → fullscreen overlay met alt-text als caption |

---

## 03-features

| | Feature | Wat het toevoegt |
|---|---|---|
| 01 | [01-edit-met-drafts](./03-features/01-edit-met-drafts/SPEC.md) | View/Edit-toggle met lokale drafts in browser-storage; export/import van drafts |
| 02 | [02-content-management](./03-features/02-content-management/SPEC.md) | In-app aanmaken van hoofdstukken, pagina's, varianten, content-tabs zonder codebase te openen |
| 03 | [03-settings](./03-features/03-settings/SPEC.md) | Settings-pagina (kaart-stijl) — taal, thema, editor-voorkeuren, drafts-management, profiel |
| 04 | [04-code-editor](./03-features/04-code-editor/SPEC.md) | CodeMirror 6 + browser-based execution (Web Worker / WASM per taal) met pass/fail-challenges |
| 05 | [05-card-trainer](./03-features/05-card-trainer/SPEC.md) | Flashcards / quiz / exam — slide-in panel, manueel-gedefinieerde cards in eerste release |
| 06 | [06-comments](./03-features/06-comments/SPEC.md) | Threaded comments à la YouTube — likes, sorteer, voor feedback en stemmen |
| 07 | [07-mobiele-layout](./03-features/07-mobiele-layout/SPEC.md) | Drie-kolom-layout collapsed naar één met overlays, hamburger-menu, slide-ins |
| 08 | [08-pwa-offline](./03-features/08-pwa-offline/SPEC.md) | Installeerbaar PWA + cache-as-you-go service worker + per-module offline-download |
| 09 | [09-toegang-private-deployment](./03-features/09-toegang-private-deployment/SPEC.md) | `noindex`, auth-gate, geen content voor unauthenticated requests |
| 10 | [10-ai-assistent](./03-features/10-ai-assistent/SPEC.md) | Slide-panel chatbot met paginacontext, gestreamed via server-route |

---

## Werk-volgorde principes

- **Foundation eerst, en helemaal af** — branding, i18n, schema, tooling, deploy-config. Geen half-werk meenemen naar template-tweaks
- **Template: content-rendering vóór navigatie-chrome** — `01-markdown-rendering` levert de basis waar `02-section-sidebar`, `07-rechter-panel-en-toc` en `08-changelog-en-prev-next` op rusten. Zonder rijke content kan de sidebar/ToC niet getest worden
- **Demo-content stubs** in foundation zorgen dat customizations vanaf dag één tegen werkelijk variërende content kunnen ontwikkelen (variants, content-tabs, math, diagrammen)
- **Features-stage komt pas wanneer template-stage stabiel is** — pas dan introduceren we Pinia (zie `ARCHITECTURE.md` § Pinia-migratiepath), nieuwe runtimes (CodeMirror, Pyodide, Mermaid, KaTeX) en eigen interactie-modellen
- **Iedere customization en feature heeft één canonieke SPEC** in de eigen folder. Geen dubbele specs, geen drift. Voor architectuur-discipline zie `ARCHITECTURE.md`
