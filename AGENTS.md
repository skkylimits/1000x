# 1000x — Agent Context

> Canonical AI/agent context. CLAUDE.md en GEMINI.md zijn pointers naar dit bestand.

## Greetings

Groet me om verschillende manieren steeds op de meeste creative manier als een enlighted person

## Project

**1000x** — bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Doelpubliek: intern, werknemers. Niet voor publiek of zoekmachines. Gebouwd op de Nuxt UI docs-template als baseline.

Documentatie-structuur in `TDD/`:

- `TDD/SPEC.md` — productspec, wat het systeem doet
- `TDD/FEATURES.md` — drie-stage roadmap (foundation, template, features) met links naar elke individuele SPEC
- `TDD/ARCHITECTURE.md` — twee scalability-regels (single entry-point per data-source; pure derivations als utilities) en het Pinia-migratiepath
- `TDD/CONTRIBUTING.md` — proces en classificatie van werk per stage
- `TDD/TOOLING-STRATEGY.md` — volledige tooling-configs en AI-agent code-style deep-dive
- `TDD/01-FOUNDATION/SCAFFOLDING.md` — stap-voor-stap setup van foundation
- `TDD/01-FOUNDATION/` — branding, i18n, content-stubs
- `TDD/02-TEMPLATE/` — 13 customizations
- `TDD/03-FEATURES/` — 10 features

# Development philosophy

- Prefer simple solutions over clever ones.
- Write code that is clear and self-explanatory.
- Build with the long term in mind.

## Stack

- **Baseline**: Nuxt UI docs-template (https://github.com/nuxt-ui-templates/docs)
- **Framework**: Nuxt 4
- **UI**: Nuxt UI v4
- **Content**: Nuxt Content v3
- **i18n**: `@nuxtjs/i18n` — NL default, EN secundair
- **Iconen**: `@nuxt/icon` met lokale Iconify-bundles. Custom SVGs alleen als laatste redmiddel.
- **Images**: `@nuxt/image` met IPX provider (vanaf het begin geïntegreerd in `ProseImg`-override)
- **PWA**: `@vite-pwa/nuxt`
- **Code-editor (later)**: CodeMirror 6
- **Code-execution (later)**: Web Workers + WASM
- **Persistentie Phase 1**: localStorage
- **Deployment Phase 1**: SSG op Cloudflare Pages of Vercel
- **Package manager**: pnpm (`pnpm-lock.yaml`, `packageManager: pnpm@10.x`)

## Drie soorten werk

Wanneer een task binnenkomt, classificeer hem eerst:

1. **Foundation** (`TDD/01-FOUNDATION/`) — éénmalig setup: branding, i18n, content-schema, AGENTS, deployment, content-stubs als integration-testbed
2. **Template customization** (`TDD/02-TEMPLATE/`) — aanpassen wat de Nuxt UI docs-template of Nuxt Content levert: markdown-rendering, section-sidebar, header, levels, tabs, page-chrome, right-panel, smart-toc, changelog, prev-next, search, math/diagrammen, image-lightbox
3. **Eigen feature** (`TDD/03-FEATURES/`) — bouwen wat de template niet heeft: edit-met-drafts, content-management, settings, code-editor, card-trainer, comments, mobiele-layout, PWA, auth-gate, AI-assistent

Niet door elkaar halen. Een PR die zowel foundation als customizations als feature-werk doet wordt afgewezen.

## Code style

- **Tabs** voor indentatie (size 4 in editor-weergave)
- **Single quotes** voor strings
- **Geen semicolons** — geregeld via `@antfu/eslint-config`
- **Geen Prettier** — ESLint is alleenheerser
- **Vue SFC**: `<script setup lang="ts">` voor nieuwe components
- **Auto-imports** staan aan

## Conventions

- Gebruik altijd de Composition API. Nooit de Options API
- Gebruik `useFetch` of `useAsyncData` voor data-fetching. Nooit raw `fetch` of `$fetch` in components voor initial data loads
- Gebruik Nuxt's server routes (`server/api/`) voor backend-logica. Nooit API-logica in client-side code
- Vertrouw op Nuxt's auto-imports voor composables, components en utils. Importeer nooit handmatig wat Nuxt auto-importeert
- **Pinia pas vanaf feature 02 in 03-FEATURES** (In-app content management). Daarvóór is `useState` + `useAsyncData` voldoende voor shared state. Niet preemptief Pinia toevoegen — zie `TDD/ARCHITECTURE.md` § Pinia-migratiepath
- Gebruik file-based routing. Nooit routes handmatig definiëren in een config-bestand, tenzij je default-gedrag bewust wilt overrulen
- Gebruik `definePageMeta` voor page-level middleware en layout-assignments. Nooit elders
- Gebruik `NuxtLink` voor interne navigatie. Nooit raw `<a>`-tags of `navigateTo` voor simpele links
- Gebruik `useState()` voor shared SSR-safe reactive state. Nooit `ref()` op module-scope buiten `<script setup>` — dat lekt state tussen server requests heen
- Gebruik `createError()` voor error-responses. `throw createError()` op de server, `createError({ fatal: true })` op de client voor full-page errors
- Gebruik route middleware voor navigation guards. Nooit `useRoute()` binnen middleware — gebruik de `to`/`from` parameters

### Componenten

Nuxt UI v4 levert vrijwel alle componenten die we nodig hebben. Bij elk UI-element:

1. Eerst checken of Nuxt UI v4 het levert (component én MDC-block)
2. Pas als het niet bestaat of fundamenteel onvoldoende is, een eigen component bouwen door een Nuxt UI component te slot-overriden of te wrappen
3. Volledig from-scratch alleen als laatste optie

"Niet bestaat" betekent letterlijk niet bestaat — niet "bestaat maar ik wil iets anders". Smaak-verschillen los je op met theming via `app.config.ts`.

### Iconen

Eerste keuze Iconify (`lucide:search`, `tabler:code`, `simple-icons:javascript`). Niet beschikbaar? Iconify-set toevoegen. Geen passende? Custom SVG in `app/components/icons/`. Nooit inline SVG-strings in components.

### Content

- Frontmatter velden gevalideerd via Zod-schema in `content.config.ts`
- Filenames blijven inhoudelijk (`closures.md`, niet `1.intro.md`). Volgorde via `nav: [...]`-array op directory's `index.md`
- Iedere directory met `scope: self` of `scope: children` op zijn `index.md` is een sidebar-grens
- **Levels** zijn folder-based: directory met `levels: true` op zijn `index.md` heeft folder-children als levels (bv. `javascript/{junior,mid,senior}/`). AppLevelHeader rendert chrome-sub-header
- **Tabs** zijn file-based: directory met `tabs: true` op zijn `index.md` heeft file-children als tabs (bv. `installation/{vite,postcss,cli}.md`). TabBar rendert in-content onder H1
- **Geen file-suffix-variants** zoals `<page>.<variant>.<lang>.md` voor sectie-niveau levels — folder-based is de aanpak
- Een directory mag maximaal één van `levels: true` of `tabs: true` hebben (build faalt op beide tegelijk)
- Assets in `public/` mirrort de content-tree

### i18n

- UI-strings in `i18n/locales/{lang}.json` — geen hardcoded strings
- Content per taal: `page.nl.md`, `page.en.md`. Default `nl`
- LocalStorage-keys bevatten `{lang}`: `draft:nl:syntax/javascript/closures`

## Niet doen

- **Geen `.navigation.yml`** — nav-tree komt uit filesystem + `index.md`-frontmatter + (vanaf feature 02 in 03-FEATURES) localStorage-overlay. Reden: single source per directory, geen drift tussen yml en md, AI/CMS-friendly. Zie `TDD/ARCHITECTURE.md` § Anti-patterns
- **Geen Prettier** — ESLint is alleenheerser
- **Geen runtime-fetches naar Iconify CDN** — lokaal gebundelde sets only
- **Geen content scrapen of regurgiteren in AI-features**
- **Geen telemetry in Phase 1**
- **Geen Pinia vóór feature 02 in 03-FEATURES**
- **Geen npm of yarn** — pnpm is de package manager
- **Geen handmatige `.git/hooks/`-files plaatsen** — alle git-hooks worden declaratief beheerd via `simple-git-hooks` in `package.json` (zie `TDD/TOOLING-STRATEGY.md` § Hook-management). Bij broken hooks: stale file verwijderen, `pnpm install` regenereert 'm

# Verification

Na wijzigingen draai altijd deze checks en fix issues vóór "klaar":

1. **Build**: `pnpm build`
2. **Lint**: `pnpm lint:fix` (ESLint via antfu)
3. **Type check**: `pnpm typecheck`
4. **Unit tests**: `pnpm test` (Vitest)
5. **E2E tests**: `pnpm test:e2e` (Playwright) — alleen wanneer de change UI raakt