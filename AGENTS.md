# 1000x — Agent Context

> Canonical AI/agent context. CLAUDE.md en GEMINI.md zijn pointers naar dit bestand.

## Project

**1000x** — bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Doelpubliek: intern, werknemers. Niet voor publiek of zoekmachines. Gebouwd op de Nuxt UI docs-template als baseline.

Zie `TDD/SPEC.md` voor de volledige product-specificatie, `TDD/FEATURES.md` voor de implementatie-volgorde, `TDD/SCAFFOLDING.md` voor de foundation-setup, en `TDD/features/` voor alle 21 feature-specs.

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

## Drie soorten werk

Wanneer een task binnenkomt, classificeer hem eerst:

1. **Foundation** (`TDD/SCAFFOLDING.md`) — éénmalig setup: branding, i18n, schema, AGENTS, deployment
2. **Template customization** (later, `template/`) — aanpassen wat de template levert: sidebar, layout-chrome, search, etc.
3. **Eigen feature** (`TDD/features/`) — bouwen wat de template niet heeft: code-editor, card-trainer, AI-assistent, etc.

Niet door elkaar halen. Een PR die zowel foundation als customizations als feature-werk doet wordt afgewezen.

## Conventies

### Code style

- **Tabs** voor indentatie (size 4 in editor weergave)
- **Single quotes** voor strings
- **Geen semicolons** — `@antfu/eslint-config`
- **No Prettier** — ESLint is alleenheerser
- **Vue SFC**: `<script setup lang="ts">` voor nieuwe components
- **Auto-imports** zijn aan

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
- Filenames blijven inhoudelijk (`closures.md`, niet `1.intro.md`). Volgorde via `nav: [...]`
- Iedere directory met `scope: self` of `scope: children` is een sidebar-grens
- Variants: `closures.junior.nl.md`, `closures.mid.nl.md`. Eén logische node in nav-tree
- Assets in `public/` mirrort de content-tree

### i18n

- UI-strings in `i18n/locales/{lang}.json` — geen hardcoded strings
- Content per taal: `page.nl.md`, `page.en.md`. Default `nl`
- LocalStorage-keys bevatten `{lang}`: `draft:nl:syntax/javascript/closures`

## Niet doen

- Geen `.navigation.yml` — nav-tree komt uit filesystem + frontmatter + localStorage
- Geen Prettier
- Geen runtime-fetches naar Iconify CDN
- Geen content scrapen of regurgiteren in AI-features
- Geen telemetry in Phase 1
