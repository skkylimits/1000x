# 1000x — Agent Context

> Canonical AI/agent context. CLAUDE.md en GEMINI.md zijn pointers naar dit bestand.

## Project

**1000x** — bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Doelpubliek: intern, werknemers. Niet voor publiek of zoekmachines.

Zie `spec.md` voor de volledige product-specificatie en `features.md` voor de implementatie-volgorde per fase.

## Stack

- **Framework**: Nuxt 4 (stable; Nuxt 3 EOL juli 2026)
- **UI**: Nuxt UI v4 (`@nuxt/ui` — geünificeerd open-source)
- **Content**: Nuxt Content v3 (markdown, SQLite-backed in productie)
- **i18n**: `@nuxtjs/i18n` — NL default, EN secundair
- **Iconen**: `@nuxt/icon` met lokale Iconify-bundles. Custom SVG's alleen onder `app/components/icons/` als er geen Iconify-icoon bestaat. Geen inline SVG's in components.
- **PWA**: `@vite-pwa/nuxt` — Workbox, cache-as-you-go
- **Code-editor (Phase 4)**: CodeMirror 6
- **Code-execution (Phase 4)**: Web Workers + WASM, runtime per taal
- **Persistentie Phase 1**: localStorage voor drafts en lokale tree-mutaties
- **Persistentie later**: IndexedDB → git PR-flow
- **Deployment Phase 1**: SSG op Cloudflare Pages of Vercel
- **Deployment later**: Dockerized voor Azure/AWS/on-prem

## Repository structuur

```
1000x/
├── app/
│   ├── assets/css/main.css       # Tailwind + Nuxt UI imports
│   ├── components/
│   │   └── icons/                # Custom SVGs only (Iconify is preferred)
│   ├── layouts/
│   ├── pages/
│   ├── app.vue
│   └── app.config.ts
├── content/                      # Markdown content (root level, NIET in app/)
├── i18n/locales/                 # nl.json, en.json
├── public/                       # Static assets, mirrort de content-tree
├── server/                       # Server routes (AI etc., later)
├── content.config.ts             # Nuxt Content collections + frontmatter schema
├── nuxt.config.ts
├── eslint.config.mjs             # withNuxt(antfu({...}))
└── package.json
```

## Dev commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server op localhost:3000 |
| `pnpm build` | Production build |
| `pnpm generate` | SSG output naar `.output/public/` |
| `pnpm preview` | Preview de productie-build lokaal |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |
| `pnpm typecheck` | TypeScript-check via `nuxt typecheck` |

## Conventies

### Code style

- **Tabs** voor indentatie (size 4 in editor weergave). Geen spaces.
- **Single quotes** voor strings.
- **Geen semicolons** — antfu's preset.
- **No Prettier** — ESLint is alleenheerser via `@antfu/eslint-config`.
- **Vue SFC**: `<script setup lang="ts">` altijd voor nieuwe components.
- **Auto-imports** zijn aan — gebruik `useRouter`, `ref`, `computed` zonder import.

### Iconen

- Eerste keuze: een Iconify-set die al geïnstalleerd is (`lucide`, `tabler`, `simple-icons`). Refereren als `lucide:search`, `tabler:code`, `simple-icons:javascript`.
- Niet beschikbaar in een set? Voeg een nieuwe Iconify-set als devDependency toe (`@iconify-json/<set>`) — niet zelf SVG's downloaden.
- Geen passende Iconify-icoon? Maak een Vue-component in `app/components/icons/` en register als custom collection met prefix `kh:`.
- **Nooit inline SVG-strings** in andere components.

### Content / markdown

- Frontmatter velden zijn gevalideerd via Zod-schema in `content.config.ts`. Onbekende velden → dev warning, geen crash.
- Filenames blijven inhoudelijk (`closures.md`, niet `1.intro.md`). Volgorde via `nav: [...]` in `index.md` van een directory.
- Iedere directory met `scope: self` of `scope: children` is een sidebar-grens. Zie spec feature 19.
- Variants: `closures.junior.nl.md`, `closures.mid.nl.md` etc. Eén logische node in de nav-tree.
- Assets in `public/` mirrort de content-tree: `public/syntax/javascript/closures/figure-1.png`.

### i18n

- UI-strings in `i18n/locales/{lang}.json` — geen hardcoded strings in components.
- Content per taal: `page.nl.md`, `page.en.md`. Default `nl`.
- LocalStorage-keys bevatten `{lang}`: `draft:nl:syntax/javascript/closures`.

## Architectuur-grenzen

- **Markdown is de bron van waarheid**. Geen content-database; database komt later voor non-content (gebruikers, comments, audit logs).
- **Phase 1 = lokaal-first**: drafts en tree-mutaties in localStorage. Geen netwerk-dependency.
- **AI is geïsoleerd**: een AI-uitval mag nooit andere features raken. Zie spec feature 12.
- **Privé-deployment**: `robots.txt` Disallow + meta noindex + auth-gate in alle deployed envs. Zie spec feature 18.

## Niet doen

- Geen `.navigation.yml`-bestanden — nav-tree komt uit filesystem + frontmatter + localStorage. Zie spec feature 19.
- Geen Prettier installeren of configureren.
- Geen runtime-fetches naar Iconify CDN — `serverBundle: 'local'` is verplicht.
- Geen content scrapen of regurgiteren in AI-features (copyright).
- Geen telemetry in Phase 1; pas in latere fases. Architectuur staat het toe maar implementeren komt later.
